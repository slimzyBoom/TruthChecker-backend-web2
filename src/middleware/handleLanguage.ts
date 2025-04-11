import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the 'language' property
declare global {
    namespace Express {
        interface Request {
            language?: string;
        }
    }
}

const handleLanguage = (req: Request, res: Response, next: NextFunction) => {
    const supportedLanguages = ['en', 'ig', 'ha', 'yo', 'pigin']; // Add supported languages here
    const defaultLanguage = 'en';

    let language = req.headers['accept-language'] || defaultLanguage;

    if (typeof language === 'string') {
        language = language.split(',')[0]; // Extract the first language from the header
    }

    if (!supportedLanguages.includes(language)) {
        language = defaultLanguage; // Fallback to default language if unsupported
    }

    req.language = language; // Attach the language to the request object
    next();
};

export default handleLanguage;