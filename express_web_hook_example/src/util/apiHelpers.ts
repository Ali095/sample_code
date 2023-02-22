import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import { ENVIRONMENT } from "./secrets";
import logger from "./logger";
import { ApiError } from "../errors/apierror";


export interface ApiResponse {
    stack: string;
    errors: Array<string>;
    result: any;
}

export const apiOk = async (res: Response, result: any) => {
    const response: ApiResponse = {
        result: result,
        errors: [],
        stack: ""
    };
    res.status(200).json(response);
};

export const apiError = async (res: Response, err: string | Array<string> | ApiError | Error, statusCode: number = 400) => {
    let myerr: Error = new Error("Something went wrong");
    let errMessages: Array<string> = [];
    if (err instanceof Array) {
        errMessages = err;

    } else if (typeof err === "string") {
        errMessages.push(err);
    }
    else if (err instanceof ApiError) {
        myerr = err;
        errMessages = err.errors;
        statusCode = err.status;
    }
    else if (err instanceof Error) {
        const msg: string = err.message;
        errMessages.push(msg);
        myerr = err;
    } else {
        errMessages.push("Fail to transform thrown error. use string, string[] or Error for throwing errors");
    }

    let stack: string = myerr?.stack;

    if (ENVIRONMENT === "production") {
        stack = "No stack in production";
    }

    const response: ApiResponse = {
        result: null,
        errors: errMessages,
        stack: stack
    };

    res.status(statusCode).json(response);
};


export const errorHandler404 = (req: Request, res: Response, next: NextFunction) => {

    const errMsg = `Can't find ${req.url} on this server!`;
    res.status(404);
    next(new Error(errMsg));

};

export const errorUnhandledRejection = (err: any) => {
    logger.error("Unhandle rejection: ", err);
    // process.exit(1);
};


export const errorUncughtException = (err: any) => {
    logger.error("UNCAUGHT EXCEPTION! Shutting down...");
    logger.error("Uncaught EXCEPTION: ", err);
    process.exit(1);

};

export const errorHandlerAll = (err: Error, req: Request, res: Response, next: NextFunction) => {


    let statusCode = res.statusCode;
    if (statusCode === 200) {
        statusCode = 500;
    }

    logger.error("Error Handler", err);
    apiError(res, err, statusCode);
};

export const catchAsync = (fn: any) => (...args: any[]) => fn(...args).catch(args[2]);

export const apiValidation = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errs = errors.array().map(x => x.msg.toString());
        const err = new ApiError(errs);
        res.status(400);
        throw err;
    }
};