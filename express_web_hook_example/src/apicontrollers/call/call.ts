import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import { apiOk, apiValidation } from "../../util/apiHelpers";
import { RouterClass } from "../resource/RouterClass";
import { callService } from "../../services/call";



class CallRouter extends RouterClass { }

export const callRouter = new CallRouter();
export default callRouter;

callRouter.post("/make-call", [], async (req: Request, res: Response, next: NextFunction) => {
        await check("phone_no", "phone_no is required").exists().run(req);
        apiValidation(req, res);
        const phoneNo: string = req.body.phone_no;
        const result = await callService.makeCall(phoneNo);
        apiOk(res, result);
});

callRouter.post("/answer", [], async (req: Request, res: Response, next: NextFunction) => {
        console.log("logging from answer", req.body);
        const callSID: string = req.body.CallSid;
        const from: string = req.body.From;
        const redo: string = req.params.redo;
        //get xml in string and send back
        const result: string = await callService.answerCallWithVoice(callSID, from, redo);
        res.type("text/xml");
        res.send(result);
});

callRouter.post("/handle-input", [], async (req: Request, res: Response, next: NextFunction) => {
        console.log("logging from handle", req.body);
        const digits = req.body.Digits;
        const result = await callService.processUserInput(digits);
        res.type("text/xml");
        res.send(result);
});

callRouter.get("/hangup", [], async (req: Request, res: Response, next: NextFunction) => {
        console.log("logging from hangup", req.body);
        const selectedOption = req.params.option;
        const callDetails = req.params;
        const result = await callService.hangup(selectedOption, callDetails);
        res.type("text/xml");
        res.send(result);
});

callRouter.get("/list-calls", [], async (req: Request, res: Response, next: NextFunction) => {
        const result = await callService.getAllCalls();
        apiOk(res, result);
});