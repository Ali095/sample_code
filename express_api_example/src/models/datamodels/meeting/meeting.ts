import { DTO } from "../dto";


export class MeetingDTO extends DTO {
    organizer?: string = undefined;
    members?: string[] = undefined;
    attendee?: string = undefined;
    summary?: string = undefined;
    description?: string = undefined;
    status?: string = undefined;
    start_time?: Date = undefined;
    end_time?: Date = undefined;
    duration?: number = undefined;
    timezone?: string = undefined;
    start_url?: string = undefined;
    join_url?: string = undefined;
    location?: string = "Online";
}