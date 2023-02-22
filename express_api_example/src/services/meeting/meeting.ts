import { checkAvailability_internal, checkAvailability_external, insertNewEvent } from "../../external/google/calendar";
import { MeetingDTO } from "../../models/datamodels/meeting";
import { meetingDAO } from "../../dao/meeting";
import { createNewMeeting } from "../../external/zoom";
import { ApiError } from "../../errors/apierror";
import { userDAO } from "../../dao/user";





class MeetingService {
    public async getMyMeetings(email: string): Promise<MeetingDTO[]> {
        return await meetingDAO.findAll(email);
    }

    public async arrangeNewMeeting(details: Record<string, any>): Promise<any> {
        const userDetails = await userDAO.find(details.organizer);
        const isHostAvailable = await checkAvailability_internal(userDetails.refresh_token, { startTime: new Date(details.start_date_time), endTime: new Date(details.end_date_time) });
        if (!isHostAvailable)
            throw new ApiError(`${details.organizer} Not available at mentioned time`, 404);
        const isUserAvailable = await checkAvailability_external(details.attendees, { startTime: new Date(details.start_date_time), endTime: new Date(details.end_date_time) });
        if (!isUserAvailable)
            throw new ApiError(`${details.attendees} Not available at mentioned time`, 404);
        const meetingResults = await createNewMeeting(details);
        const meetingDetails: MeetingDTO = {
            summary: details.summary,
            location: details.location || "Online",
            description: details.description,
            organizer: details.organizer,
            attendee: details.attendees,
            start_time: details.start_date_time,
            end_time: details.end_date_time,
            duration: meetingResults.duration,
            start_url: meetingResults.start_url,
            join_url: meetingResults.join_url,
            timezone: meetingResults.timezone,
            status: meetingResults.status,
            members: [details.organizer, details.attendees]
        };
        await meetingDAO.create(meetingDetails);
        const insertEventResults: any = await insertNewEvent(meetingDetails);
        return insertEventResults.htmlLink;
    }

}

export const meetingService: MeetingService = new MeetingService();
export default meetingService;
