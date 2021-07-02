/**
 * Check whether the atrule is valid less variable.
 *
 * @param {atRule} node
 *
 * @returns {true or false}
 */

export default function isValidVariable(atRule) {
    if ('variable' in atRule && atRule.raws.afterName.includes(":")) {
        return true;
    }
    return false;
}