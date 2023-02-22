import { google } from "googleapis";
import { reject } from "lodash";
import {
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
    FRONTEND_REDIRECT_URI, GOOGLE_API_KEY
} from "../../util/secrets";


const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_REDIRECT_URI);

export const generateTokens = async (code: string) => {
    const { tokens } = await oAuth2Client.getToken(code);
    return tokens;
};

export const getUserProfileData = async (accessToken: string) => {
    // const authClient = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });
    const oAuth2 = google.oauth2({
        auth: oAuth2Client,
        version: "v2"
    });

    // const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    return new Promise((resolve, reject) => {
        oAuth2.userinfo.get((err, res) => {
            err ? reject(err) : resolve(res.data);
        });
    });
};

export const checkAvailability_internal = async (refreshToken: string, details: { startTime: Date, endTime: Date }) => {
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const startDate = details.startTime.toISOString();
    const endDate = details.endTime.toISOString();
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    const check = {
        auth: oAuth2Client,
        resource: {
            timeMin: startDate,
            timeMax: endDate,
            timeZone: "Asia/Karachi",
            items: [{ id: "primary" }]
        }
    };
    return new Promise((resolve, reject) => {
        calendar.freebusy.query(check, (err: any, response: any) => {
            if (err) {
                reject(err);
            } else {
                const eventArr = response.data.calendars.primary.busy;
                if (eventArr.length === 0)
                    resolve(true);
                else resolve(false);
            }
        });
    });
};

export const checkAvailability_external = async (calendarId: string, details: { startTime: Date, endTime: Date }) => {
    const startDate = details.startTime.toISOString();
    const endDate = details.endTime.toISOString();
    const calendar = google.calendar({ version: "v3", auth: GOOGLE_API_KEY });
    const check = {
        auth: GOOGLE_API_KEY,
        resource: {
            timeMin: startDate,
            timeMax: endDate,
            timeZone: "Asia/Karachi",
            items: [{ id: "primary" }]
        }
    };
    return new Promise((resolve, reject) => {
        calendar.freebusy.query(check, (err: any, response: any) => {
            if (err) {
                reject(err);
            } else {
                const eventArr = response.data.calendars.primary.busy;
                if (eventArr.length === 0)
                    resolve(true);
                else resolve(false);
            }
        });
    });
};

export const insertNewEvent = async (meetingDetails: Record<string, any>) => {
    const eventDetails: any = {
        anyoneCanAddSelf: false,
        attendees: [{
            email: meetingDetails.attendee,
            responseStatus: "needsAction"
        }, {
            email: meetingDetails.organizer,
            responseStatus: "accepted",
            organizer: true
        }],
        conferenceData: {
            entryPoints: [
                {
                    "entryPointType": "video",
                    "uri": meetingDetails.start_url,
                    "label": "Click here to join Zoom meeting"
                }
            ]
        },
        description: meetingDetails.description,
        end: {
            dateTime: new Date(meetingDetails.end_time),
            timeZone: "Asia/Karachi"
        },
        start: {
            dateTime: new Date(meetingDetails.start_time),
            timeZone: "Asia/Karachi"
        },
        eventType: "default",
        location: meetingDetails.start_url,
        organizer: {
            email: meetingDetails.organizer
        },
        summary: meetingDetails.summary
    };

    const options: any = {
        auth: oAuth2Client,
        calendarId: "primary",
        resource: eventDetails
    };

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    return new Promise((resolve, reject) => {
        calendar.events.insert(options, (err: any, res: any) => {
            if (err)
                reject(err);
            else resolve(res);
        });
    });


};
