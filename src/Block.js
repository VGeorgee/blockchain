let {sha256, isValidProof} = require('./utils') 
let MerkleTree = require('./MerkleTree')
const { buildTransaction } = require('./Transaction')



module.exports = {
    Block: class Block {
        constructor(transactions, blockHeight = 0) {
            this.header = {
                timestamp: Date.now(),
                nonce: 0,
                merkleRoot: null,
                difficulty: 10,
                previousBlockHash: null,
                blockHeight
            },
            
            this.transactionsIn = {}
            this.transactionsOut = {}
            this.transactions = []

            this.merkleTree = null
            this.headerHash = null
            if(blockHeight !== 0) {
                this.calculateTransactions(transactions)
                this.processTransactions(transactions)
            }
        }
        calculateTransactions(transactions) {
            let tree = MerkleTree.buildTree(transactions)
            this.merkleTree = tree.head
            this.transactionHashes = tree.transactionHashes
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
        
        processTransactions(transactions){
            transactions.forEach(transaction => {
                this.transactionsIn[transaction.from] = 1
                this.transactionsOut[transaction.from] = 1
                this.transactionsOut[transaction.to] = 1
                this.transactions.push(...buildTransaction(transaction))
            })
        }

        verifyTransaction(transaction){
            return this.transactionHashes.includes(sha256(transaction)) 
                && MerkleTree.verifyTransaction(this.merkleTree, transaction)
        }

        getSumOfTransactionsToWallet(wallet){
            let balance = 0
            this.transactions.forEach(transaction => {
                if(transaction.to === wallet){
                    balance += transaction.volume
                }
            })
            return balance
        }

    },
    createGenesis() {
        console.log('Creating Genesis block');
        let genesis = new module.exports.Block()
        genesis.header.previousBlockHash = sha256('genesis' + Date.now())
        genesis.calculateTransactions([{'Genesis': 'Block'}])
        genesis.header.previousBlockHash = 0
        
        genesis.transactionsIn = {
            '2HaZ6oWwS31Se5hRmwS4Mtwes6uT': 1, 
            'KUWQLTFE7vaYDFjxve8cLC7C1fT': 1, 
            '2tDwy61MwkurZrXbaqXcgkmUaZFo': 1
        },
        genesis.transactionsOut = {
            '2HaZ6oWwS31Se5hRmwS4Mtwes6uT': 1, 
            'KUWQLTFE7vaYDFjxve8cLC7C1fT': 1, 
            '2tDwy61MwkurZrXbaqXcgkmUaZFo': 1
        },

        genesis.transactions = [
            {
                from: "2HaZ6oWwS31Se5hRmwS4Mtwes6uT",
                to: "2HaZ6oWwS31Se5hRmwS4Mtwes6uT",
                volume: 1000.0,
            },
            {
                from: "KUWQLTFE7vaYDFjxve8cLC7C1fT",
                to: "KUWQLTFE7vaYDFjxve8cLC7C1fT",
                volume: 1000.0,
            },
            {
                from: "2tDwy61MwkurZrXbaqXcgkmUaZFo",
                to: "2tDwy61MwkurZrXbaqXcgkmUaZFo",
                volume: 1000.0,
            }
        ]
        console.log('Genesis block created');
        return genesis
    }
}
