let Wallet = require('../src/Wallet')
var assert = require('assert')
const fs = require('fs')

describe('Wallet tests', function() {
    this.timeout(10000)
    it('should create a new wallet', function() {
        const expected = 'my wallet 1'
        let wallet = new Wallet(expected)
        assert(wallet.name == expected)
        fs.unlinkSync(`./data/wallets/wallet_${wallet.name}.json`)
    })

    it('should create a transaction', function() {
        let walletA = new Wallet('a')
        let walletB = new Wallet('b')
        const expectedVolume = 124.3
        const expectedMessage = "henlo!"
        let transaction = walletA.transact(walletB, expectedVolume, expectedMessage)
        
        assert.strictEqual(transaction.from === walletA.getAddress())
        assert.strictEqual(transaction.to === walletB.getAddress())
        assert.strictEqual(transaction.message === expectedMessage)
        assert.strictEqual(transaction.publicKey === walletA.publicKey)
        assert(transaction.volume === expectedVolume )
        
        
        fs.unlinkSync(`./data/wallets/wallet_${walletA.name}.json`)
        fs.unlinkSync(`./data/wallets/wallet_${walletB.name}.json`)
    })

    it('should create another transaction', function() {
        let walletA = new Wallet('a')
        let walletB = new Wallet('b')
        const expectedVolume = 124.3
        const expectedMessage = "henlo!"
        let transaction = walletA.transact(walletB.getAddress(), expectedVolume, expectedMessage)
        
        assert(transaction.from === walletA.getAddress())
        assert(transaction.to === walletB.getAddress())
        assert(transaction.message === expectedMessage)
        assert(transaction.publicKey === walletA.publicKey)
        assert(transaction.volume === expectedVolume )
        
        fs.unlinkSync(`./data/wallets/wallet_${walletA.name}.json`)
        fs.unlinkSync(`./data/wallets/wallet_${walletB.name}.json`)
    })
    
})



