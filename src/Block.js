let {sha256, convertHexToBin} = require('./utils') 
let MerkleTree = require('./MerkleTree')


function isValidProof(proof, difficulty){
    proof = convertHexToBin(proof)
    for(let i = 0; i < difficulty; i++){
        if(proof[i] != '0'){
            return false
        }
    }
    return true
}

module.exports = {
    Block: class Block {
        constructor(transactions, blockHeight = 0) {
            this.header = {
                timestamp: Date.now(),
                nonce: 0,
                merkleRoot: null,
                difficulty: 0,
                previousBlockHash: null,
                blockHeight
            }
            this.merkleTree = null
            this.headerHash = null
            if(blockHeight !== 0) {
                this.calculateTransactions(transactions)
            }
        }
        calculateTransactions(transactions) {
            this.merkleTree = MerkleTree.buildTree(transactions)
            this.header.merkleRoot = this.merkleTree.hash
        }
        _createHeaderHash() {
            this.headerHash = sha256(this.header)
        }
        _calculateProofOfWork(difficulty) {
            if(!this.headerHash){
                this._createHeaderHash()
            }
            while(!isValidProof(this.headerHash, difficulty || this.header.difficulty)){
                this.header.nonce++
                this._createHeaderHash()
            }
        }
        getHash(){
            if(!this.headerHash){
                this._calculateProofOfWork()
            }
            return this.headerHash
        }
        setPreviousHash(hash){
            this.header.previousBlockHash = hash
        }
        verifyTransaction(transaction){
            return MerkleTree.verifyTransaction(this.merkleTree, transaction)
        }
    },
    createGenesis() {
        console.log('Creating Genesis block');
        let genesis = new module.exports.Block()
        genesis.header.previousBlockHash = sha256('genesis' + Date.now())
        genesis.calculateTransactions([{'Genesis': 'Block'}])
        genesis.header.previousBlockHash = 0
        console.log('Genesis block created');
        return genesis
    }
}
