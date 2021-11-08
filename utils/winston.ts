import winston, { transports } from "winston";

const { format, createLogger } = winston;

const { colorize, printf, label, timestamp } = format;

const PrintFormat = printf(({ level, message, label, timestamp }) => {
 return `${timestamp}-${level}: ${message}`;
});
//transports.ConsoleTransportInstance
let listOfTransports: (transports.FileTransportInstance | transports.ConsoleTransportInstance)[] = [
 new winston.transports.File({ level: "info", filename: "logs/combined.logs" }),
 new winston.transports.File({ level: "error", filename: "logs/error.logs" }),
];

const exceptionTransports: transports.FileTransportInstance[] = [
 new winston.transports.File({ filename: "logs/exceptions.logs" }),
];

if (process.env.NODE_ENV !== "production") {
 listOfTransports = [...listOfTransports, new winston.transports.Console()];
}

const logger = createLogger({
 format: format.combine(timestamp(), colorize(), label(), PrintFormat),
 transports: listOfTransports,
 exceptionHandlers: exceptionTransports,
 exitOnError: false,
});

export { logger };
