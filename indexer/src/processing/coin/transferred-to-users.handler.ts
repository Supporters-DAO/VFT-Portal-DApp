import { EntitiesService } from "../entities.service";
import { randomUUID } from "node:crypto";
import { ICoinEventHandler } from "./coin.handler";
import { EventInfo } from "../event-info.type";
import { Coin, Transfer } from "../../model";
import { TransferredToUsersEvent } from "../../types/coin.events";
import { deductBalance } from "../../types/balance.utils";

export class TransferredToUsersHandler implements ICoinEventHandler {
  async handle(
    event: TransferredToUsersEvent,
    { source: address, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { from, to, amount } = event;
    const coin = await storage.getCoin(address);

    if (coin === undefined) {
      console.warn(`[TransferredToUsersHandler] ${address}: coin is not found`);
      return;
    }

    const fromBalance = await storage.getAccountBalance(from, coin);
    const isFromAdmin = coin.admins.includes(from);

    let distributed = coin.distributed;
    let holders = coin.holders;

    for (const toAddress of to) {
      deductBalance(fromBalance, amount);

      const isToAdmin = coin.admins.includes(toAddress);
      const toBalance = await storage.getAccountBalance(toAddress, coin);

      if (toBalance.balance === BigInt(0)) {
        holders += 1;
      }

      toBalance.balance += amount;

      await storage.setAccountBalance(toBalance);

      if (isFromAdmin && !isToAdmin) {
        distributed += amount;
      } else if (!isFromAdmin && isToAdmin) {
        distributed -= amount;
      }

      storage.addTransfer(
        new Transfer({
          id: randomUUID(),
          coin: coin,
          from,
          to: toAddress,
          amount,
          blockNumber,
          timestamp,
          extrinsicHash: txHash,
        })
      );
    }

    if (fromBalance.balance === BigInt(0)) {
      holders -= 1;
    }

    await storage.setAccountBalance(fromBalance);
    await storage.setCoin(new Coin({ ...coin, distributed, holders }));
  }
}
