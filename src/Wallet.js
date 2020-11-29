let utils = require('./utils')
let fs = require('fs')  
const signer = require('crypto')

function load(user){
     return JSON.parse(fs.readFileSync(`./data/wallets/wallet_${user}.json`))
}

function save(user){
    fs.writeFileSync(`./data/wallets/wallet_${user.name}.json`, JSON.stringify(user, null, 2))
}

function sign(message, privateKey){
    return signer.createSign('sha256').update(message).end().sign(privateKey).toString('hex')
}

module.exports = class Wallet {

    constructor(user){
        try{
            let loaded = load(user)
            this.name = loaded.name
            this.address = loaded.address
            this.publicKey = loaded.publicKey
            this.privateKey = loaded.privateKey
        }
        catch(ex){
            let keys = utils.generateKeys()
            let walletAddress = utils.hexToBase58(utils.RIPEMD160(utils.sha256(keys.publicKey)))
            this.address = walletAddress
            this.publicKey = keys.publicKey,
            this.privateKey = keys.privateKey
            this.name = user
            save(this)
        }
    }

    transact(to, volume, message){
        let toAddress = typeof to === 'string' ? to : to.address
        return {
            to: toAddress,
            from: this.address,
            volume,
            message,
            publicKey: this.publicKey,
            signature: sign(message, this.privateKey)
        }
    }

    getAddress(){
        return this.address
    }
}

