import { EntitiesService } from "../entities.service";
import { randomUUID } from "node:crypto";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin, Transfer } from "../../model";
import { NullAddress } from "../../consts";
import { BurnedEvent } from "../../types/coin.events";
import { deductBalance } from "../../types/balance.utils";

export class BurnedHandler implements ICoinEventHandler {
  async handle(
    event: BurnedEvent,
    { source: address, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { from, amount } = event;
    const coin = await storage.getCoin(address);
    if (coin === undefined) {
      console.warn(`[BurnedHandler] ${address}: coin is not found`);
      return;
    }
    const fromBalance = await storage.getAccountBalance(from, coin);
    storage.addTransfer(
      new Transfer({
        id: randomUUID(),
        coin: coin,
        from,
        to: NullAddress,
        amount,
        blockNumber,
        timestamp,
        extrinsicHash: txHash,
      })
    );
    deductBalance(fromBalance, amount);
    coin.circulatingSupply = coin.circulatingSupply - amount;
    coin.burned = coin.burned + amount;

    if (fromBalance.balance === BigInt(0)) {
      coin.holders -= 1;
    }
    await storage.setAccountBalance(fromBalance);

    await storage.setCoin(
      new Coin({
        ...coin,
      })
    );
  }
}
