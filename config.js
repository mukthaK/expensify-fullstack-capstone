exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://demo:demo123@ds259711.mlab.com:59711/expensifydb';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://demo:demo123@ds259711.mlab.com:59711/expensifydb';
exports.PORT = process.env.PORT || 8080;
