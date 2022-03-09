var stylelint = require("stylelint");
var isStandardSyntaxAtRule = require('stylelint/lib/utils/isStandardSyntaxAtRule');
const validateOptions = require('stylelint/lib/utils/validateOptions');
import { isValidVariable } from "../../utils";
import { namespace } from "../../utils";
export const ruleName = namespace("no-duplicate-variables");
export const messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: function(prop) {
        return `unexpected duplicate property in "${prop}"`;
    },
    invalid: function(variableName) {
        return `Unexpected Invalid variable  "${variableName}"`;
    }
});
export default function(actual, options) {

    return function(root, result) {
        const validOptions = validateOptions(result, ruleName, { actual });

        if (!validOptions) {
            return;
        }
        var globalVariables = [];
        root.walkRules((rule) => {
            var variables = [];
            rule.nodes.forEach(function(node) {
                if (node.type == "atrule") {
                    if(!isStandardSyntaxAtRule(node)){
                        if (!isValidVariable(node)) {
                            stylelint.utils.report({
                                result,
                                ruleName,
                                message: messages.invalid(node.name),
                                node: node,
                                word: node.name

                            });
                        } else {
                            if (variables.includes(node.name)) {
                                stylelint.utils.report({
                                    result,
                                    ruleName,
                                    message: messages.rejected(node.name),
                                    node: node,
                                    word: node.name

                                });
                            } else {
                                variables.push(node.name);
                            }
                        }
                    }
                }
            })
        });
        root.walkAtRules((node) => {
            //check duplicate in globalvariables 
            if (node.parent.type == "root") {
                if (!isStandardSyntaxAtRule(node)) {
                    if (!isValidVariable(node)) {
                        stylelint.utils.report({
                            result,
                            ruleName,
                            message: messages.invalid(node.name),
                            node: node,
                            word: node.name

                        });
                    } else {
                        if (globalVariables.includes(node.name)) {
                            stylelint.utils.report({
                                result,
                                ruleName,
                                message: messages.rejected(node.name),
                                node: node,
                                word: node.name

                            });
                        } else {
                            globalVariables.push(node.name);
                        }
                    }
                }
            }
        });
    }
}