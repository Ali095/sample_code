import winston, { format } from "winston";

import morgan, { StreamOptions } from "morgan";

const { combine, timestamp, splat, colorize, errors, printf, prettyPrint } = winston.format;

const LOGPATH = process.env["LOGPATH"] || "data/logs/log.log";


const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message ? message : "No Message!"} `;

    if (metadata) {
        let stack = "";
        if (metadata["stack"]) {
            stack = metadata["stack"];
            delete metadata["stack"];
        }

        if (Object.keys(metadata).length > 0) {
            msg += JSON.stringify(metadata, null, 2);
        }

        msg += stack;
    }
    return msg;
});


const consoleFormat = combine(

    colorize(),

    splat(),
    timestamp(),
    errors({ stack: true }),
    prettyPrint(),
    myFormat
);

const fileFormat = combine(
    splat(),
    timestamp(),
    errors({ stack: true }),
    prettyPrint(),
    myFormat
);


const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: (process.env.NODE_ENV === "production" ? "info" : "debug"),
            format: consoleFormat
        }),
        new winston.transports.File({ filename: LOGPATH, level: "debug", format: fileFormat })
    ]

};

export const logger = winston.createLogger(options);


const stream: StreamOptions = {
    // Use the http severity
    write: (message) => logger.http(message),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};


export const morganMiddleware = morgan(
    // Define message format string (this is the default one).
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // You can create your custom token to show what do you want from a request.
    ":method :url :status :res[content-length] - :response-time ms",
    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream, skip }
);


if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;
