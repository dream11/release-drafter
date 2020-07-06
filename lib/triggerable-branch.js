const log = require('./log')

const flatten = arr => {
  return Array.prototype.concat(...arr)
}

const isWildCardMatch = (matchString, matchRule) => {
  const escapeRegex = matchString =>
    matchString.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
  return new RegExp(
    '^' +
      matchRule
        .split('*')
        .map(escapeRegex)
        .join('.*') +
      '$'
  ).test(matchString)
}

module.exports.isTriggerableBranch = ({ app, context, branch, config }) => {
  const validBranches = flatten([config.branches])
  const relevant = validBranches.some(branchRule => {
    return isWildCardMatch(branch, branchRule)
  })
  if (!relevant) {
    log({
      app,
      context,
      message: `Ignoring push. ${branch} is not one of: ${validBranches.join(
        ', '
      )}`
    })
  }
  return relevant
}
