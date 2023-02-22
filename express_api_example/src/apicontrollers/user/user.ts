import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import { apiOk, apiValidation } from "../../util/apiHelpers";
import { RouterClass } from "../resource/RouterClass";
import { userService } from "../../services/user";
import { meetingService } from "../../services/meeting";



class UserRouter extends RouterClass { }

export const userRouter = new UserRouter();
export default userRouter;

userRouter.post("/token", [], async (req: Request, res: Response, next: NextFunction) => {
        await check("code", "code is required").exists().run(req);
        apiValidation(req, res);
        const code: string = req.body.code;
        const result = await userService.createTokens(code);
        apiOk(res, result);
});

userRouter.get("/list", [], async (req: Request, res: Response, next: NextFunction) => {
        const result = await userService.getAllUsers();
        apiOk(res, result);
});

userRouter.post("/create", [], async (req: Request, res: Response, next: NextFunction) => {
        await check("calendar_URL", "calendar_URL is required").exists().run(req);
        await check("name", "name is required").exists().run(req);
        await check("email", "email is required").exists().run(req);
        apiValidation(req, res);
        const { calendar_URL, name, email } = req.body;
        const result = await userService.createNewUser({ calendar_URL, name, email });
        apiOk(res, result);
});

userRouter.post("/meeting/create", [], async (req: Request, res: Response, next: NextFunction) => {
        await check("summary", "summary is required").exists().run(req);
        await check("location", "location is required").exists().run(req);
        await check("attendees", "attendees is required").exists().run(req);
        await check("organizer", "organizer is required").exists().run(req);
        await check("start_date_time", "start_date_time is required").exists().run(req);
        await check("end_date_time", "end_date_time is required").exists().run(req);
        apiValidation(req, res);
        const { summary, description, location, start_date_time, end_date_time, organizer, attendees } = req.body;
        const result = await meetingService.arrangeNewMeeting({
                summary, description, location, start_date_time, end_date_time, organizer, attendees
        });
        apiOk(res, result);
});

userRouter.get("/meeting/list?email", [], async (req: Request, res: Response, next: NextFunction) => {
        await check("email", "email is required").exists().run(req);
        apiValidation(req, res);
        const email: string = req.params.email;
        const result = await meetingService.getMyMeetings(email);
        apiOk(res, result);
});