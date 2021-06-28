var stylelint = require("stylelint");
var isStandardSyntaxAtRule = require('stylelint/lib/utils/isStandardSyntaxAtRule');
import { isValidVariable } from "../../utils";
import { namespace } from "../../utils";
import valueParser from 'postcss-value-parser';
var validateOptions = require('stylelint/lib/utils/validateOptions');
export const ruleName = namespace("color-no-hex");
export const messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: function(hex) {
        return `Unexpected hex color "${hex}"`;
    },
    invalid: function(variableName) {
        return `invalid variable "${variableName}"`;
    }
});
const HEX = /^#[0-9A-Za-z]+/;
const IGNORED_FUNCTIONS = new Set(['url']);

export default function(actual, options) {


    return function(root, result) {
        const validOptions = validateOptions(result, ruleName, { actual });

        if (!validOptions) {
            return;
        }
        root.walkAtRules(function(node) {
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
                    const parsedValue = valueParser(node.params);
                    parsedValue.walk((parsedValueNode) => {
                        if (isIgnoredFunction(parsedValueNode)) return false;

                        if (!isHexColor(parsedValueNode)) return;

                        stylelint.utils.report({
                            message: messages.rejected(parsedValueNode.value),
                            node: node,
                            word: parsedValueNode.value,
                            result,
                            ruleName,
                        });
                    });
                }
            }
        });
    }
}

function isIgnoredFunction({ type, value }) {
    return type === 'function' && IGNORED_FUNCTIONS.has(value.toLowerCase());
}

function isHexColor({ type, value }) {
    return type === 'word' && HEX.test(value);
}