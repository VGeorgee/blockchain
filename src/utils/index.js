let sha = require('js-sha256').sha256;

module.exports = {
    
    sha256: function (data){
        return sha(typeof data === 'string' ? data : JSON.stringify(data))
    },

    convertHexToBin: function (hex){
        let final = ''
        for(let i = 0; i < 16; i++){
            let num = hex.substr(i * 4, 4)
            let number = (parseInt(num, 16)).toString(2);
            while(number.length != 16){
                number = '0' + number
            }
            final += number
        }
        return final
    }

}