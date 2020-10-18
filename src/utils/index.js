let crypto = require('crypto')
const bs58 = require('bs58')
var pem = require('pem')

module.exports = {
    
    sha256: function (data){
        let copy = Object.assign({}, data)
        delete copy.timestamp
        return module.exports.getHash('sha256', typeof data === 'string' ? data : JSON.stringify(data))
    },

    RIPEMD160: function(data){
        return module.exports.getHash('RIPEMD160', data)
    },

    getHash: function name(type, data) {
        return crypto.createHash(type).update(data).digest('hex')
    },

    convertHexToBin: function (hex){
        let final = ''
        for(let i = 0; i < 16; i++){
            let num = hex.substr(i * 4, 4)
            let number = (parseInt(num, 16)).toString(2);
            while(number.length != 16){
                number = '0' + number
            }
            final += number
        }
        return final
    },

    hexToBase58: function (hex) {
        return bs58.encode(Buffer.from(hex, 'hex'))
    },

    generateKeys: function() {
        return crypto.generateKeyPairSync('rsa',  {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem',
              cipher: 'aes-256-cbc',
              passphrase: ''
            }
          })
    },

    getPublicKey: function (key) {
        
    },

    getPrivateKey: function (key) {
        
    }

}