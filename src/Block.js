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

module.exports = class Block {
    constructor() {
        this.header = {
            timestamp: Date.now(),
            nonce: 0,
            merkleRoot: 0,
            difficulty: 0,
            previousBlockHash: null
        }
        this.merkleTree = null
        this.headerHash = null
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
    verifyTransaction(transaction){
        return MerkleTree.verifyTransaction(this.merkleTree, transaction)
    }
}

