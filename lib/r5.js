const r5 = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/, '')
    .substr(0, 5)
module.exports = r5
