import { model, Schema } from "mongoose";
import { DTOCreate } from "../../datamodels/dto";
import { MeetingDTO } from "../../datamodels/meeting";

const schemaFields: Record<keyof DTOCreate<MeetingDTO>, any> = {
    organizer: { type: String, required: true },
    members: [{ type: String, required: true }],
    attendee: { type: String, required: true },
    summary: { type: String, required: false },
    description: { type: String, required: false },
    status: { type: String, required: false },
    start_time: { type: Date, required: false },
    end_time: { type: Date, required: false },
    duration: { type: Number, required: true, default: 0 },
    timezone: { type: String, required: false },
    start_url: { type: String, required: false },
    join_url: { type: String, required: false },
    location: { type: String, required: true, default: "Online" }
};

const schema = new Schema(schemaFields, { timestamps: true });
export const MeetingModel = model("meetings", schema);

