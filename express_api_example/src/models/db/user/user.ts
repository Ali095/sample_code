import { model, Schema } from "mongoose";
import { DTOCreate } from "../../datamodels/dto";
import { UserDTO } from "../../datamodels/user";

const schemaFields: Record<keyof DTOCreate<UserDTO>, any> = {
    email: { type: String, required: true, index: { unique: true, dropDups: true } },
    name: { type: String, required: true },
    type: { type: String, required: true, default: "login" },
    access_token: { type: String, required: false },
    refresh_token: { type: String, required: false },
    calendar_URL: { type: String, required: false }
};

const schema = new Schema(schemaFields, { timestamps: true });
export const UserModel = model("users", schema);

