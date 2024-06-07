const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf, errors} = format;

const logFormat = printf(({level, message, timestamp, stack}) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        errors({stack: true}),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'logs/error.log', level: 'error'}),
        new transports.File({filename: 'logs/combined.log'})
    ],
    exceptionHandlers: [
        new transports.File({filename: 'logs/exceptions.log'})
    ]
});

module.exports = logger;
