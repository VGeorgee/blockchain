let {sha256} = require('./utils')

module.exports = {
    buildTree: function (transactions) {
        if(transactions.length % 2 != 0){
            transactions.push(transactions[transactions.length - 1])
        }

        let nodes = transactions.map(element => this.createLeafNode(element))

        while(nodes.length != 1){
            if(nodes.length % 2 != 0){
                nodes.push(nodes[nodes.length - 1])
            }

            let nextLayerOfNodes = []
            for(let i = 0; i < nodes.length; i += 2) {
                nextLayerOfNodes.push(this.createNode(nodes[i], nodes[i + 1]))
            }

            nodes = nextLayerOfNodes
        }
        return nodes[0]
    },

    createLeafNode: function (transaction){
        return {
            hash: sha256(transaction),
            transaction
        }
    },

    isLeafNode: function (node){
        return !!node.transaction
    },

    createNode: function (leftNode, rightNode){
        return {
            hash: sha256(leftNode.hash + rightNode.hash),
            left: leftNode,
            right: rightNode || leftNode
        }
    },

    verifyTransaction: function (tree, transaction) {
        transaction = typeof transaction === 'string' ? transaction : JSON.stringify(transaction)
        return this.calculateMerklePath(tree, transaction) === tree.hash
    },

    calculateMerklePath: function (tree, transaction){
        if(this.isLeafNode(tree)){
            return sha256(transaction) === tree.hash ? tree.hash : null
        }
        let hash = this.calculateMerklePath(tree.left, transaction)
        if(hash){
            return sha256(hash + tree.right.hash)
        }
        hash = this.calculateMerklePath(tree.right, transaction)
        if(hash){
            return sha256(tree.left.hash + hash)
        }
        return null   
    }
}
