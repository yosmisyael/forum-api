const dotenv = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV === 'development') {
    dotenv.config({
        path: path.resolve(process.cwd(), '.env.test')
    });
} else {
    dotenv.config();
}

const config = {
    app: {
        host: process.env.HOST,
        port: process.env.PORT,
    },
    database: {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    },
};

module.exports = config;
