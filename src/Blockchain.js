let {Block, createGenesis} = require('./Block')

module.exports = class Blockchain {
    #blocks
    constructor(){
        this.#blocks = [createGenesis()]
    }

    confirm(transactions) {
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

}


