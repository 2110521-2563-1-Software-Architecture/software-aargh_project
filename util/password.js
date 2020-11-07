const bcrypt = require('bcrypt')

const hash = async password => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return { hash, salt }
}

const compare = async (password, hash) => {
  const isSame = await bcrypt.compare(password, hash)
  return isSame
}

module.exports = { hash, compare }