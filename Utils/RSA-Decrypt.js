const NodeRSA = require('node-rsa');
const key = require('../config/key.config.js').key;

function decryptRSA(encrypted) {
    
    const private_key = new NodeRSA(key);
    private_key.setOptions({
        encryptionScheme: 'pkcs1'
    });
    return private_key.decrypt(encrypted, 'utf8');
}

module.exports = decryptRSA;