const bcrypt = require("bcrypt");

const genHash = pass => {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
};

const validatePass = (inputPass, dbPass) => {
  return bcrypt.compareSync(inputPass, dbPass);
};

module.exports = { genHash, validatePass };
