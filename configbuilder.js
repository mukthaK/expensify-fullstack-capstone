exports.config = function () {
    let c;
    try {
        c = require('./config')
    } catch (err) {
        c = {}
    }
    return {
        DATABASE_URL: c.DATABASE_URL || process.env.DATABASE_URL,
        TEST_DATABASE_URL: c.TEST_DATABASE_URL || process.env.TEST_DATABASE_URL,
        PORT: c.PORT || process.env.PORT,
        PASSWORD_EMAIL: c.PASSWORD_EMAIL || process.env.PASSWORD_EMAIL
    }
}
