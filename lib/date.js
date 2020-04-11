const toYmd = dt => {
  const y = dt.getUTCFullYear()
  const m = dt.getUTCMonth()
  const d = dt.getUTCDate()
  return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
}
module.exports = {
  toYmd,
}
