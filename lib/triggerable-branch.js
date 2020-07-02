const log = require('./log')

const flatten = arr => {
  return Array.prototype.concat(...arr)
}

function matchBranch(str, rule) {
  var escapeRegex = str => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
  return new RegExp(
    '^' +
      rule
        .split('*')
        .map(escapeRegex)
        .join('.*') +
      '$'
  ).test(str)
}

module.exports.isTriggerableBranch = ({ app, context, branch, config }) => {
  const validBranches = flatten([config.branches])
  const relevant = validBranches.some(branchRule => {
    return matchBranch(branch, branchRule)
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
