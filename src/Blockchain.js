let {Block, createGenesis} = require('./Block')
const crypto = require('crypto')

function verifySignature(transaction){
    let verifier = crypto.createVerify('sha256').update(transaction.message).end()
    return verifier.verify(transaction.publicKey, Buffer.from(transaction.signature, 'hex'))
}


module.exports = class Blockchain {
    #blocks
    constructor(){
        this.#blocks = [createGenesis()]
    }

    confirm(transactions) {
        transactions = this.validateAllIncomingTransactions(transactions)
        
        let block = new Block(transactions, this.#blocks.length)
        block.setPreviousHash(this.getCurrentBlock().getHash())
        this.#blocks.push(block)
    }
    
    getCurrentBlock(){
        return this.#blocks[this.#blocks.length - 1]
    }

    getBlock(index){
        return this.#blocks[index]
    }

    getBlockHeight(){
        return this.#blocks.length
    }

    verifyTransactionInBlock(index, transaction){
        return this.#blocks[index].verifyTransaction(transaction)
    }

    
    validateAllIncomingTransactions(transactions){
        for (let i = 0; i < transactions.length; i++){

            const transaction = transactions[i]
            
            if(!verifySignature(transaction)){
                console.log("Transaction deleted, invalid signature");
                delete transactions[i]
                continue
            }
            
            let balanceOfWallet = this.getBalanceOfWallet(transaction.from)

            if(balanceOfWallet < transaction.volume){
                console.log("Transaction deleted, invalid balance");
                delete transactions[i]
            }
            console.log(`Transaction approved from ${transaction.from} to ${transaction.to} with volume ${transaction.volume}`);
            transaction.balance = balanceOfWallet
        }

        return transactions.filter(e => e)
    }

    getBalanceOfWallet(wallet){
        let balance = 0
        let index = this.getBlockHeight() - 1
        let block
        do {
            block = this.#blocks[index--]
            if(block.transactionsOut[wallet]){
                balance += block.getSumOfTransactionsToWallet(wallet)
            }
        } while (index >= 0 && !block.transactionsIn[wallet])
        return balance
    }

}


