const express = require('express');
const path = require('path');

const router = express.Router();
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);


const algorithm = 'aes-256-ctr';
let passphrase;

const encrypt = (text) => {
  const cipher = crypto.createCipher(algorithm, passphrase);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};
const decrypt = (text) => {
  const decipher = crypto.createDecipher(algorithm, passphrase);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
router.post('/encode/:passphrase', (req, res) => {
  passphrase = req.params.passphrase;
  const stringifiedData = JSON.stringify(req.body);
  const encrypted = encrypt(stringifiedData);
  res.send(encrypted);
});
router.post('/decode/:passphrase', (req, res) => {
  const encrypted = req.body.encrypted;
  passphrase = req.params.passphrase;
  const decrypted = decrypt(encrypted);
  res.send(decrypted);
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
