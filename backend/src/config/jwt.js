const { JWT_SECRET, JWT_EXPIRE } = require('./env');

module.exports = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRE,
};
