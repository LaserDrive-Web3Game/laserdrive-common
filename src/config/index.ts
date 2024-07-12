import dotenv from 'dotenv';
import { Algorithm } from 'jsonwebtoken';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const jwtAlgorithm: Algorithm = 'HS256';

export default {
    port: parseInt(process.env.PORT, 10),

    databaseURL: process.env.POSTGRES_URI,

    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: jwtAlgorithm,

    api: {
        prefix: '/api',
    },

    logs: {
      level: process.env.LOG_LEVEL || 'silly',
    },
};
