import { EntitiesService } from "../entities.service";
import { randomUUID } from "node:crypto";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin, Transfer } from "../../model";
import { NullAddress } from "../../consts";
import { MintedEvent } from "../../types/coin.events";

export class MintedHandler implements ICoinEventHandler {
  async handle(
    event: MintedEvent,
    { source: address, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { to, amount } = event;
    const coin = await storage.getCoin(address);
    if (coin === undefined) {
      console.warn(`[MintedEvent] ${address}: coin is not found`);
      return;
    }
    storage.addTransfer(
      new Transfer({
        id: randomUUID(),
        coin: coin,
        from: NullAddress,
        to,
        amount,
        blockNumber,
        timestamp,
        extrinsicHash: txHash,
      })
    );
    const toBalance = await storage.getAccountBalance(to, coin);
    if (toBalance.balance === BigInt(0)) {
      coin.holders += 1;
    }
    toBalance.balance += amount;
    await storage.setAccountBalance(toBalance);
    coin.circulatingSupply = coin.circulatingSupply + amount;
    coin.minted = coin.minted + amount;

    await storage.setCoin(
      new Coin({
        ...coin,
      })
    );
  }
}
