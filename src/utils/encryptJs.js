var CryptoJS = require("crypto-js");
var password = 'U2FsdGVkX1+ekWnd0nwp5eEVslashdD6eslash4hxcpzNslashATHsQ='

function encrypt(data) {
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), password);
    return (ciphertext.toString().replace(/\//g, "slash"));
}

function decrypt(data) {
    var dataConver = data.replace(/slash/g, "/");
    var bytes  = CryptoJS.AES.decrypt(dataConver, password);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return(decryptedData)
}




module.exports = {
    decrypt,
    encrypt
}