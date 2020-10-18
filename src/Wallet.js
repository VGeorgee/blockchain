let utils = require('./utils')
let fs = require('fs')

module.exports = class Wallet {
    constructor(user){
        user += ''
        let keys = utils.generateKeys()
        /*
        fs.writeFileSync('../data/wallets/user_' + user + '.pem', keys.publicKey)
        fs.writeFileSync('../data/wallets/user_' + user + '.key', keys.privateKey)
        // */
       let walletAddress = utils.hexToBase58(utils.RIPEMD160(utils.sha256(keys.publicKey)))
        fs.writeFileSync('../data/wallets/user_' + user + '.wallet', walletAddress)
    }
}
















