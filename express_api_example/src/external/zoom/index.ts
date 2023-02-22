import jwt from "jsonwebtoken";
import rp from "request-promise";
import { ZOOM_API_KEY, ZOOM_API_SECRET, ZOOM_USER_ID } from "../../util/secrets";

//Use the ApiKey and APISecret from config.js
const payload = {
    iss: ZOOM_API_KEY,
    exp: ((new Date()).getTime() + 50000)
};
const zoomJwtToken = jwt.sign(payload, ZOOM_API_SECRET);

export const createNewMeeting = async (details: Record<string, any>): Promise<any> => {
    const dateDiffinMS = new Date(details.end_date_time).getTime() - new Date(details.start_date_time).getTime();
    const options = {
        method: "POST",
        uri: "https://api.zoom.us/v2/users/" + ZOOM_USER_ID + "/meetings",
        body: {
            agenda: details.description,
            schedule_for: details.organizer,
            start_time: new Date(details.start_date_time),
            timezone: "Asia/Karachi",
            topic: details.summary,
            duration: Math.round(dateDiffinMS / 60000),
            type: 2,
            pre_schedule: false,
            settings: {
                host_video: "true",
                participant_video: "true",
                calendar_type: 2,
                allow_multiple_devices: true,
                email_notification: true,
                alternative_hosts_email_notification: true,
                approval_type: 1,
                join_before_host: false,
                meeting_invitees: [{ email: details.attendees }],
                registrants_confirmation_email: true,
                registrants_email_notification: true
            }
        },
        auth: {
            bearer: zoomJwtToken
        },
        headers: {
            "User-Agent": "Zoom-api-Jwt-Request",
            "content-type": "application/json"
        },
        json: true //Parse the JSON string in the response
    };

    const meetingResponse = await rp(options);
    return meetingResponse;
};




