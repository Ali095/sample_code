import {
    generateTokens, getUserProfileData
} from "../../external/google/calendar";
import { UserDTO } from "../../models/datamodels/user";
import { userDAO } from "../../dao/user";
import { createNewMeeting } from "../../external/zoom";






class UserService {
    public async createTokens(code: string): Promise<Record<string, any>> {
        const tokens = await generateTokens(code);
        const userProfile: any = await getUserProfileData(tokens.access_token);
        const existingUser = await userDAO.find(userProfile.email);
        if (!existingUser) {
            let userDetails: UserDTO = new UserDTO();
            userDetails = {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                name: userProfile.name,
                email: userProfile.email,
                type: "login"
            };
            await userDAO.create(userDetails);
        }
        return userProfile;
    }

    public async getAllUsers(): Promise<UserDTO[]> {
        return await userDAO.findAll();
    }

    public async createNewUser(body: Record<string, any>): Promise<any> {
        const userDetails: UserDTO = {
            calendar_URL: body.calendar_URL,
            name: body.name,
            email: body.email,
            type: "public"
        };
        return await userDAO.create(userDetails);
    }

    public async arrangeNewMeeting(details: Record<string, any>): Promise<any> {
        const meetingResults = await createNewMeeting(details);
    }

}

export const userService: UserService = new UserService();
export default userService;
