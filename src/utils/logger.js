import winston from 'winston';


const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'white'
    }
};


const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        })
    ]
});


const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ 
            filename: './errors.log', 
            level: 'error',
            format: winston.format.simple() 
        })
    ]
});


export const addLogger = (req, res, next) => {

    const environment = process.env.NODE_ENV || 'development';
    
    req.logger = environment === 'production' ? prodLogger : devLogger;
    
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};