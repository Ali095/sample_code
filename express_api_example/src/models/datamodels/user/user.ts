import { DTO } from "../dto";


export class UserDTO extends DTO {
    email?: string = undefined;
    name?: string = undefined;
    calendar_URL?: string = undefined;
    access_token?: string = undefined;
    refresh_token?: string = undefined;
    type = "login";
}