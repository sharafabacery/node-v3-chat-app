const englishChar = () => "abcdefghijklmnopqrstuvwxyz";
const caear_cipher_encrypt = (message, numofpos = 0) => {
  const max = 26;
  const low = englishChar();
  const upper = englishChar().toLocaleUpperCase();
  let encryptedMessage = "";
  for (let index = 0; index < message.length; index++) {
    let checkwherecharlow = low.indexOf(message[index]);
    let checkwherecharupper = upper.indexOf(message[index]);
    encryptedMessage +=
      checkwherecharlow > -1
        ? low[(checkwherecharlow + numofpos) % max]
        : checkwherecharupper > -1
        ? upper[(checkwherecharupper + numofpos) % max]
        : message[index];
  }
  return encryptedMessage;
};
const caear_cipher_dencrypt = (message, numofpos = 0) => {
  const max = 26;
  const low = englishChar();
  const upper = englishChar().toLocaleUpperCase();
  let decryptMessage = "";
  for (let index = 0; index < message.length; index++) {
    let checkwherecharlow = low.indexOf(message[index]);
    let checkwherecharupper = upper.indexOf(message[index]);
    decryptMessage +=
      checkwherecharlow > -1
        ? low[(checkwherecharlow - numofpos + max) % max]
        : checkwherecharupper > -1
        ? upper[(checkwherecharupper - numofpos + max) % max]
        : message[index];
  }
  return decryptMessage;
};
const brute_force_attack = (message) => {
  const max = 26;
  let arrayOfResult = [];
  for (let index = 0; index < max; index++) {
    let decryptMessage = caear_cipher_dencrypt(message, index);
    arrayOfResult.push(decryptMessage);
  }
  return arrayOfResult;
};
module.exports={caear_cipher_encrypt,caear_cipher_dencrypt}
// const message = caear_cipher_encrypt("Hello World", 3);
// console.log(message);
// const messagek = caear_cipher_dencrypt(message, 3);
// console.log(messagek);
// const attack = brute_force_attack(message);
// console.log(attack);
