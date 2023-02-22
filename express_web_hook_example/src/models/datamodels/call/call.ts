import { DTO } from "../dto";


export class CallDTO extends DTO {
    sid?: string = undefined;
    type?: string = undefined;
    status?: string = "in-progress";
    start_time?: Date = new Date();
    end_time?: Date = undefined;
    recording_url?: string = undefined;
    to?: string = undefined;
    from?: string = undefined;
    forwarded_to?: string = undefined;
    recording_duration?: number = 0;
}