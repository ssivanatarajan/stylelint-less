const revision = "main";

/**
 * Get the specified rule's URL.
 *
 * @param {string} ruleName
 * @return {string}
 */
export function ruleUrl(ruleName) {
  let name = ruleName;
  if (name.includes("/")) {
    [, name] = name.split("/", 2);
  }
  return `https://github.com/Dnd-Safran/stylelint-less/blob/${revision}/src/rules/${name}`;
}