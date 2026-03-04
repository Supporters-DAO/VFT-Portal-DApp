import { safeUnwrapToBigInt } from "./event.utils";
import { getFnNamePrefix, getServiceNamePrefix, Sails } from "sails-js";
import { readFileSync } from "fs";
import { HexString } from ".";
import { SailsIdlParser } from "sails-js-parser";

let instance: CoinEventsParser | undefined;

export async function getCoinEventsParser(): Promise<CoinEventsParser> {
  if (!instance) {
    instance = new CoinEventsParser();
    await instance.init();
  }
  return instance;
}

export enum CoinEventType {
  Transferred = "Transferred",
  TransferredToUsers = "TransferredToUsers",
  AdminAdded = "AdminAdded",
  AdminRemoved = "AdminRemoved",
  Minted = "Minted",
  Burned = "Burned",
}

export type TransferEvent = {
  type: CoinEventType.Transferred;
  from: string;
  to: string;
  amount: bigint;
};

export type MintedEvent = {
  type: CoinEventType.Minted;
  to: string;
  amount: bigint;
};

export type BurnedEvent = {
  type: CoinEventType.Burned;
  from: string;
  amount: bigint;
};

export type TransferredToUsersEvent = {
  type: CoinEventType.TransferredToUsers;
  from: string;
  to: string[];
  amount: bigint;
};

export type AdminAddedEvent = {
  type: CoinEventType.AdminAdded;
  admin: string;
};

export type AdminDeletedEvent = {
  type: CoinEventType.AdminRemoved;
  admin: string;
};

export type CoinEvent =
  | TransferEvent
  | TransferredToUsersEvent
  | AdminAddedEvent
  | AdminDeletedEvent
  | MintedEvent
  | BurnedEvent;

export class CoinEventsParser {
  private sails?: Sails;

  async init() {
    const idl = readFileSync("./assets/coin.idl", "utf-8");

    const parser = await SailsIdlParser.new();
    this.sails = new Sails(parser);

    this.sails.parseIdl(idl);
  }

  getCoinEvent(payload: HexString): CoinEvent | undefined {
    if (!this.sails) {
      throw new Error(`sails is not initialized`);
    }
    const serviceName = getServiceNamePrefix(payload);
    const functionName = getFnNamePrefix(payload);
    if (!this.sails.services[serviceName].events[functionName]) {
      return undefined;
    }
    const ev =
      this.sails.services[serviceName].events[functionName].decode(payload);
    switch (functionName) {
      case "Minted": {
        const event = ev as {
          to: `0x${string}` | Uint8Array;
          value: number | string;
        };
        return {
          type: CoinEventType.Minted,
          to: event.to.toString(),
          amount: safeUnwrapToBigInt(event.value)!,
        };
      }
      case "Burned": {
        const event = ev as {
          from: `0x${string}` | Uint8Array;
          value: number | string;
        };
        return {
          type: CoinEventType.Burned,
          from: event.from.toString(),
          amount: safeUnwrapToBigInt(event.value)!,
        };
      }
      case "Transfer": {
        const event = ev as {
          from: `0x${string}` | Uint8Array;
          to: `0x${string}` | Uint8Array;
          value: number | string;
        };
        return {
          type: CoinEventType.Transferred,
          from: event.from.toString(),
          to: event.to.toString(),
          amount: safeUnwrapToBigInt(event.value)!,
        };
      }
      case "TransferredToUsers": {
        const event = ev as {
          from: `0x${string}` | Uint8Array;
          to: Array<`0x${string}` | Uint8Array>;
          value: number | string;
        };
        return {
          type: CoinEventType.TransferredToUsers,
          from: event.from.toString(),
          to: event.to.map((t) => t.toString()),
          amount: safeUnwrapToBigInt(event.value)!,
        };
      }
    }

    return undefined;
  }
}
