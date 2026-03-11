import { Sails, getFnNamePrefix, getServiceNamePrefix } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";
import { readFileSync } from "fs";
import { HexString } from "@gear-js/api";
import { ContractInfo } from "./lib";

let instance: DnsEventsParser | undefined;

export async function getDnsEventsParser(): Promise<DnsEventsParser> {
  if (!instance) {
    instance = new DnsEventsParser();
    await instance.init();
  }
  return instance;
}

export enum DnsEventType {
  ProgramIdChanged = "ProgramIdChanged",
}

export type ProgramIdChangedEvent = {
  type: DnsEventType.ProgramIdChanged;
  program: string;
  name: string;
  admins: string[];
  updatedAt: Date | null;
};

export type DnsEvent = ProgramIdChangedEvent;

type ContractInfoChangedPayload = {
  name: string;
  contract_info: ContractInfo;
};

export class DnsEventsParser {
  private sails?: Sails;

  async init() {
    const idl = readFileSync("./assets/dns.idl", "utf-8");
    const parser = await SailsIdlParser.new();
    this.sails = new Sails(parser);
    this.sails.parseIdl(idl);
  }

  getDnsEvent(payload: HexString): DnsEvent | undefined {
    if (!this.sails) {
      throw new Error(`sails is not initialized`);
    }

    const serviceName = getServiceNamePrefix(payload);
    const functionName = getFnNamePrefix(payload);

    const service = this.sails.services[serviceName];
    const decoder = service?.events?.[functionName];

    if (!decoder) {
      return undefined;
    }

    const ev = decoder.decode(payload);

    switch (functionName) {
      case "ProgramIdChanged": {
        const event = ev as ContractInfoChangedPayload;
        return {
          type: DnsEventType.ProgramIdChanged,
          program: event.contract_info.program_id.toString(),
          admins: event.contract_info.admins.map((a) => a.toString()),
          name: event.name,
          updatedAt: event.contract_info.registration_time
            ? new Date(event.contract_info.registration_time)
            : null,
        };
      }
    }
    return undefined;
  }
}
