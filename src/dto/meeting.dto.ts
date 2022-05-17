import { MeetingType } from "src/constants/meeting.type";

export class MeetingDto {
    id: number;
    type: MeetingType;
    date: Date;
    
}