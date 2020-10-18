let crypto = require('crypto')
const bs58 = require('bs58')

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
    }

}