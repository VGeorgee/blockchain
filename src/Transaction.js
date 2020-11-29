module.exports = {
    buildTransaction(transaction){
        return [
            {
                from: transaction.from,
                to: transaction.to,
                message: transaction.message,
                publicKey: transaction.publicKey,
                signature: transaction.signature,
                volume: transaction.volume
            }, 
            {
                from: transaction.from,
                to: transaction.from,
                message: transaction.message,
                publicKey: transaction.publicKey,
                signature: transaction.signature,
                volume: transaction.balance - transaction.volume
            }
        ]
    }
}