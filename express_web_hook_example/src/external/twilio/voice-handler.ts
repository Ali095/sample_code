import twilio, { Twilio } from "twilio";

import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from "../../util/secrets";

/**
 * Setup SDK client with SID and token
 */
const client: Twilio = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const VoiceResponse = twilio.twiml.VoiceResponse;

/**
 * The Twilio Node.js SDK to build an XML response
 */
let voiceResponse;

/**
 * It is responsible for making new call to a targeted number.
 * @param targetNumber The number on which the call will be made 
 * @returns ID of call
 */
export const makeNewCall = async (targetNumber: string): Promise<string> => {
    const call = await client.calls.create({ url: "http://demo.twilio.com/docs/voice.xml", to: targetNumber, from: TWILIO_NUMBER });
    return call.sid;
};


/**
 * Helper function to get user's input from call --- 
 * No need to export this function as it is internal beaviour for this service.
 */
export const getUserInput = (): string => {
    voiceResponse = new VoiceResponse();
    const gatherNode = voiceResponse.gather({ numDigits: 1, action: "/api/v1/call/handle-input" });
    gatherNode.say("To forward a call, press 1. For leaving a voice mail, press 2.");

    /** If the user doesn't enter input, re-execute the api from start.*/
    voiceResponse.redirect("/api/v1/call/answer?redo=true");
    return voiceResponse.toString();
};

export const forwardTheCall = (targetNumber: string): string => {
    voiceResponse = new VoiceResponse();
    voiceResponse.say("Forwarding the call.");
    // Forward the cal using dial
    const dial = voiceResponse.dial({
        action: "/api/v1/call/hangup?option=forward",
        method: "get"
    });
    dial.number(targetNumber);
    return voiceResponse.toString();
};

export const recordTheCall = (): string => {
    voiceResponse = new VoiceResponse();
    voiceResponse.say("Please leave a message after the beep. Press * for stop recording");
    // Record the cal using record
    voiceResponse.record({
        action: "/api/v1/call/hangup?option=record",
        method: "get",
        finishOnKey: "*"
    });
    return voiceResponse.toString();
};

export const endCall = (): string => {
    voiceResponse = new VoiceResponse();
    // Good bye note
    voiceResponse.say("Thank you for calling! " + "Goodbye.");
    // Hangup the call using hangup
    voiceResponse.hangup();
    return voiceResponse.toString();
};

export const handleInvalidOption = (): string => {
    voiceResponse = new VoiceResponse();
    voiceResponse.say("Please select valid option");
    // Give a small pause
    voiceResponse.pause();
    return voiceResponse.toString();
};

export const getAllCallsList = async () => {
    return await client.calls.list({ limit: 20 });
};
