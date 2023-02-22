import { model, Schema } from "mongoose";
import { DTOCreate } from "../../datamodels/dto";
import { CallDTO } from "../../datamodels/call";

const schemaFields: Record<keyof DTOCreate<CallDTO>, any> = {
    sid: { type: String, required: true },
    to: { type: String, required: false },
    type: { type: String, required: true },
    status: { type: String, required: false, default: "in-progress" },
    start_time: { type: Date, required: true, default: new Date() },
    end_time: { type: Date, required: false },
    recording_url: { type: String, required: false },
    forwarded_to: { type: String, required: false },
    from: { type: String, required: false },
    recording_duration: { type: Number, required: false, default: 0 }
};

const schema = new Schema(schemaFields, { timestamps: true });
export const CallModel = model("call_details", schema);

