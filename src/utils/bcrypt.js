const bCrypt = require('bcrypt')

const encryptPWD = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

const compareBcrypt = (pass1, pass2) => {
  return bCrypt.compareSync(pass1, pass2);
}

const encryptPassword = async (pass) => {
  try {
    return bCrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bCrypt.hash(pass, salt, (err, hash) => {
        if (err) throw err;
        return hash;
      })
    })
  } catch (err) {
    throw err
  }
}

const comprarePassword = (handler, password) => {
  try {
    return bCrypt.compareSync(password, handler);
  } catch (err) {
    throw err
  }
}
module.exports = {
  compareBcrypt,
  encryptPWD,
  encryptPassword,
  comprarePassword
}

