exports.wordInString = function (s, word) {
  return new RegExp('\\b' + word + '\\b', 'i').test(s)
}
