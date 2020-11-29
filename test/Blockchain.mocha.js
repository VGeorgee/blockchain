var assert = require('assert')
let Blockchain = require('../src/Blockchain')
let Wallet = require('../src/Wallet')
const { buildTransaction } = require('../src/Transaction')

describe('Blockchain tests', function() {
    this.timeout(10000)
    it('should calculate correct balances after 3 rounds of circular, same amount transactions', function() {
    
        let blockchain = new Blockchain()

        let A = new Wallet('my_A_wallet')
        let B = new Wallet('my_B_wallet')
        let C = new Wallet('my_C_wallet')
    
        const expectedAmount = 1000
        
        blockchain.confirm([
            A.transact(B, 250, 'A making transaction to B'),
            B.transact(C, 250, 'B making transaction to C'),
            C.transact(A, 250, 'C making transaction to A')
        ])

        assert(expectedAmount === blockchain.getBalanceOfWallet(A.getAddress()))
        assert(expectedAmount === blockchain.getBalanceOfWallet(B.getAddress()))
        assert(expectedAmount === blockchain.getBalanceOfWallet(C.getAddress()))

        blockchain.confirm([
            A.transact(B, 250, 'A making transaction 2 to B'),
            B.transact(C, 250, 'B making transaction 2 to C'),
            C.transact(A, 250, 'C making transaction 2 to A')
        ])
        
        assert(expectedAmount === blockchain.getBalanceOfWallet(A.getAddress()))
        assert(expectedAmount === blockchain.getBalanceOfWallet(B.getAddress()))
        assert(expectedAmount === blockchain.getBalanceOfWallet(C.getAddress()))

        blockchain.confirm([
            A.transact(B, 50, 'A making transaction 3 to B'),
            B.transact(C, 50, 'B making transaction 3 to C'),
            C.transact(A, 50, 'C making transaction 3 to A')
        ])

        assert(expectedAmount === blockchain.getBalanceOfWallet(A.getAddress()))
        assert(expectedAmount === blockchain.getBalanceOfWallet(B.getAddress()))
        assert(expectedAmount === blockchain.getBalanceOfWallet(C.getAddress()))
    })

    it('should calculate correct balances after 3 rounds of transactions', function() {
    
        let blockchain = new Blockchain()

        let A = new Wallet('my_A_wallet')
        let B = new Wallet('my_B_wallet')
        let C = new Wallet('my_C_wallet')
        
        let singleTransaction =  A.transact(C, 250, 'A making transaction to B')
        
        blockchain.confirm([
            singleTransaction,
            B.transact(C, 250, 'B making transaction to C'),
            C.transact(A, 250, 'C making transaction to A')
        ])

        let transaction = buildTransaction(singleTransaction)[0]

        assert(blockchain.verifyTransactionInBlock(1, transaction))

        let invalidTransaction = Object.assign({}, transaction)
        invalidTransaction.to = 'invalidWalletAddress'
        assert(!blockchain.verifyTransactionInBlock(1, invalidTransaction))

        assert(1000, blockchain.getBalanceOfWallet(A.getAddress()))
        assert(750 === blockchain.getBalanceOfWallet(B.getAddress()))
        assert(1250 === blockchain.getBalanceOfWallet(C.getAddress()))


        blockchain.confirm([
            A.transact(B, 250, 'A making transaction 2 to B'),
            B.transact(C, 750, 'B making transaction 2 to C'),
            C.transact(A, 1250, 'C making transaction 2 to A')
        ])
        

        assert(2000 === blockchain.getBalanceOfWallet(A.getAddress()))
        assert(250 === blockchain.getBalanceOfWallet(B.getAddress()))
        assert(750 === blockchain.getBalanceOfWallet(C.getAddress()))

        blockchain.confirm([
            A.transact(B, 750, 'A making transaction 3 to B'),
            B.transact(C, 250, 'B making transaction 3 to C'),
            C.transact(A, 50, 'C making transaction 3 to A')
        ])

        
        assert(1300 === blockchain.getBalanceOfWallet(A.getAddress()))
        assert(750 === blockchain.getBalanceOfWallet(B.getAddress()))
        assert(950 === blockchain.getBalanceOfWallet(C.getAddress()))
    
    })
})
