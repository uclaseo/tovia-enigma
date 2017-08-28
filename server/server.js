const express = require('express');
const path = require('path');
const router = express.Router();
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);


const algorithm = 'aes-256-ctr';
let message, passphrase;

encrypt = (text) => {
  let cipher = crypto.createCipher(algorithm, passphrase);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}
decrypt = (text) => {
  let decipher = crypto.createDecipher(algorithm, passphrase);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

router.post('/encode/:passphrase', (req, res) => {
  message = req.body.message;
  passphrase = req.params.passphrase;
  const decrypted = decrypt(encrypt(message));
  res.send(decrypted);
})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
})
