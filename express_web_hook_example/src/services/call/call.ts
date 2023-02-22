import {
    makeNewCall, getUserInput, forwardTheCall,
    recordTheCall, endCall, handleInvalidOption
} from "../../external/twilio/voice-handler";
import { CallDTO } from "../../models/datamodels/call";
import { callDAO } from "../../dao/call";





class CallService {
    public async makeCall(targetNumber: string): Promise<string> {
        const callSID: string = await makeNewCall(targetNumber);
        const callDetails: CallDTO = {
            sid: callSID,
            type: "outgoing",
        };
        await callDAO.createNewCall(callDetails);
        return callSID;
    }

    public async answerCallWithVoice(callSID: string, from: string, redo: string): Promise<string> {
        const xmlResponse: string = getUserInput();
        if (!redo) {
            const callDetails: CallDTO = {
                sid: callSID,
                from: decodeURI(from),
                type: "incoming",
                start_time: new Date()
            };
            await callDAO.createNewCall(callDetails);
        }
        return xmlResponse;
    }

    public async processUserInput(digits: string): Promise<string> {
        let xmlResponse: string;
        // If the user entered digits, process their request accordingly
        if (digits) {
            switch (digits) {
                case "1":
                    xmlResponse = forwardTheCall("+923335375062");
                    break;
                case "2":
                    xmlResponse = recordTheCall();
                    break;
                default:
                    xmlResponse = handleInvalidOption();
                    xmlResponse += getUserInput();
                    break;
            }
        } else {
            // If no input was sent, collect user input again
            xmlResponse = getUserInput();
        }
        return xmlResponse;
    }

    public async hangup(selectedOption: string, callDetails: any): Promise<string> {
        const xmlResponse = endCall();
        const call: CallDTO = {
            // type: "incoming",
            // sid: callDetails.CallSid,
            status: "completed",
            end_time: new Date()
        };
        if (selectedOption === "record") {
            call.recording_duration = callDetails.RecordingDuration;
            call.recording_url = decodeURI(callDetails.RecordingUrl);
        }
        await callDAO.updateOneRecord(callDetails.CallSid, call);
        return xmlResponse;
    }

    public async getAllCalls(): Promise<CallDTO[]> {
        return await callDAO.findAll();
    }

}

export const callService: CallService = new CallService();
export default callService;
