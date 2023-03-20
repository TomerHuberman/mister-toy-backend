require('dorenv').config()

module.exports = {
  dbURL: process.env.ATLAS_URL,
  dbName: process.env.DB_NAME
}
