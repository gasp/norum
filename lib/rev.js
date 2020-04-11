const fs = require('fs')

//  get last revision
const rev = () => {
  const hash = fs.readFileSync(__dirname + '/../.git/HEAD').toString()
  if (hash.indexOf(':') === -1) {
    return hash
  }
  const path = hash.replace(/(\n|\r)+$/, '').substring(5)
  return fs.readFileSync(__dirname + '/../.git/' + path).toString()
}

module.exports = rev
