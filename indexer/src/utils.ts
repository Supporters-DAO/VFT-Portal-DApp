import { Extrinsic, Event } from "./processor";
import { HexString } from "./types";

interface GearRunExtrinsic extends Extrinsic {
  readonly hash: HexString;
}

type UserMessageSentEvent = Omit<Event, "args" | "extrinsic"> & {
  args: UserMessageSentArgs;
  extrinsic: GearRunExtrinsic;
};

interface UserMessageSentArgs {
  readonly message: {
    readonly id: HexString;
    readonly source: HexString;
    readonly destination: HexString;
    readonly payload: HexString;
    readonly value: string;
    readonly details?: UserMessageSentDetails;
  };
}

interface UserMessageSentDetails {
  readonly code: {
    readonly __kind: "Success" | "Error";
  };
  readonly to: HexString;
}

export function isUserMessageSentEvent(
  event: Event
): event is UserMessageSentEvent {
  return event.name === "Gear.UserMessageSent";
}

export function isSailsEvent(event: UserMessageSentEvent) {
  return !event.args.message.details;
}
