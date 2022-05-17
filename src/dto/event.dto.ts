import { EventType } from "puppeteer";

export class EventDto {
    id: number;
    event: EventType;
    creationDate: Date;
}