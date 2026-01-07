import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "info";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Premium Format: JSON for Prod, Colorized for Dev
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  process.env.NODE_ENV === "production" 
    ? winston.format.json() 
    : winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      )
);

const transports = [
  new winston.transports.Console(),
  // Only use file logging if not in Render (which has its own log management)
  ...(process.env.RENDER ? [] : [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ])
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false, // Do not exit on handled exceptions
});

export default logger;
