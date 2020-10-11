let sha = require('js-sha256').sha256;
let sha256 = (data) => {
    return sha(sha(typeof data === 'string' ? data : JSON.stringify(data)))
}

module.exports = {
    buildTree: function (data) {
        if(data.length % 2 != 0){
            data.push(data[data.length - 1])
        }

        let nodes = this.generateLeafNodes(data)

        while(nodes.length != 1){
            if(nodes.length % 2 != 0){
                nodes.push(nodes[nodes.length - 1])
            }

            let nodes2 = []
            for(let i = 0; i < nodes.length; i += 2) {
                nodes2.push(this.createNode(nodes[i], nodes[i + 1]))
            }

            nodes = nodes2
        }
        return nodes[0]
    },

    generateLeafNodes: function (transactions){
        let leafNodes = []

        transactions.forEach(element => {
            leafNodes.push(this.createLeafNode(element))
        })
        return leafNodes
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
