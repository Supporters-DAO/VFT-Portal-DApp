import { EntitiesService } from "../entities.service";
import { EventInfo } from "../event-info.type";
import { MemeRemovedEvent } from "../../types/factory.events";
import { IFactoryEventHandler } from "./factory.handler";

export class MemeRemovedHandler implements IFactoryEventHandler {
  async handle(
    event: MemeRemovedEvent,
    eventInfo: EventInfo,
    storage: EntitiesService
  ): Promise<void> {
    const { memeId } = event;
    const coin = await storage.getCoinByMemeId(memeId);
    if (coin === undefined) {
      console.warn(`[MemeRemovedHandler] ${memeId}: coin not found`);
      return;
    }
    await storage.removeCoin(coin);
  }
}
