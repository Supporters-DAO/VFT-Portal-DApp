import {
  AccountBalance,
  Coin,
  Factory,
  MemcoinFactoryEvent,
  Transfer,
} from "../model";
import { randomUUID } from "node:crypto";
import { IStorage } from "./storage/storage.inteface";
import { BatchService } from "./batch.service";
import { NullAddress } from "../consts";

export class EntitiesService {
  constructor(
    private readonly storage: IStorage,
    private readonly batchService: BatchService
  ) {}

  async saveAll() {
    await this.batchService.saveAll();
  }

  getFactory(): Factory {
    return this.storage.getFactory();
  }

  async getCoin(contract: string) {
    return this.storage.getCoin(contract);
  }

  async getAccountBalance(
    address: string,
    coin: Coin
  ): Promise<AccountBalance> {
    const accountBalance = await this.storage.getAccountBalance(
      address,
      coin.id
    );
    if (accountBalance === undefined) {
      return new AccountBalance({
        id: randomUUID(),
        address,
        coin,
        balance: BigInt(0),
      });
    }
    console.log(
      `[getAccountBalance] ${address} ${coin.id} ${accountBalance.balance}`
    );
    return new AccountBalance({ ...accountBalance, coin });
  }

  async setCoin(coin: Coin) {
    await this.storage.updateCoin(coin);
    this.batchService.addCoinUpdate(coin);
  }

  addTransfer(transfer: Transfer) {
    this.batchService.addTransfer(transfer);
  }

  async setAccountBalance(balance: AccountBalance) {
    if (balance.address !== NullAddress) {
      console.log(
        `[setAccountBalance] ${balance.address} ${balance.coin.id} ${balance.balance}`
      );
      await this.storage.updateAccountBalance(balance);
      this.batchService.addBalanceUpdate(balance);
    }
  }

  async addEvent(event: Omit<MemcoinFactoryEvent, "factory" | "id">) {
    const entity = new MemcoinFactoryEvent({
      ...event,
      id: randomUUID(),
      factory: this.storage.getFactory(),
    } as MemcoinFactoryEvent);
    this.batchService.addEvent(entity);
  }
}
