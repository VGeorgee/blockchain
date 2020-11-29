module.exports = {
    buildTransaction(transaction){
        return [
            {
                to: transaction.to,
                from: transaction.from,
                volume: transaction.volume,
                message: transaction.message,
                publicKey: transaction.publicKey,
                signature: transaction.signature
            }, 
            {
                to: transaction.from,
                from: transaction.from,
                volume: transaction.balance - transaction.volume,
                message: transaction.message,
                publicKey: transaction.publicKey,
                signature: transaction.signature
            }
        ]
    }
}