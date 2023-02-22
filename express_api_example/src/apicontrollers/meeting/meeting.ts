import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import { apiOk, apiValidation } from "../../util/apiHelpers";
import { RouterClass } from "../resource/RouterClass";
import { meetingService } from "../../services/meeting";



class MeetingRouter extends RouterClass { }

export const meetingRouter = new MeetingRouter();
export default meetingRouter;

meetingRouter.post("/create", [], async (req: Request, res: Response, next: NextFunction) => {
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

meetingRouter.get("/list", [], async (req: Request, res: Response, next: NextFunction) => {
        await check("email", "email is required").exists().run(req);
        apiValidation(req, res);
        let email = req.query.email;
        email = email.toString();
        const result = await meetingService.getMyMeetings(email);
        apiOk(res, result);
});