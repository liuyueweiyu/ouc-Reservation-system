function getCon(fn,...args) {
    const connection = require('mysql').createConnection(require('../config/database.config'));
    connection.connect();
    connection.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            fn(...args);
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
    return connection;
}

module.exports = getCon;