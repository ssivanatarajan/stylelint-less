var stylelint = require("stylelint");
var isStandardSyntaxAtRule = require('stylelint/lib/utils/isStandardSyntaxAtRule');
import { isValidVariable } from "../../utils";
import { namespace } from "../../utils";
import valueParser from 'postcss-value-parser';
var validateOptions = require('stylelint/lib/utils/validateOptions');
var postcss = require('postcss');
var isLessv = require("stylelint/lib/utils/isLessVariable");
export const ruleName = namespace("color-hex-case");
export const messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: function(actual, expected) {
        return `Expected "${actual}" to be "${expected}"`;
    },
    invalid: function(variableName) {
        return `invalid variable "${variableName}"`;
    }
});
const HEX = /^#[0-9A-Za-z]+/;
const IGNORED_FUNCTIONS = new Set(['url']);

export default function(expectation, options, context) {


    return function(root, result) {
        const validOptions = validateOptions(result, ruleName, {
            actual: expectation,
            possible: ['lower', 'upper'],
        });
        if (!validOptions) {
            return;
        }
        root.walkAtRules(function(node) {
            var node = postcss.atRule(node);
            var r = isLessv(node);
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
                        const expectedValue = expectation === "lower" ? parsedValueNode.value.toLowerCase() : parsedValueNode.value.toUpperCase();
                        if (parsedValueNode.value === expectedValue) return;

                        stylelint.utils.report({
                            message: messages.rejected(parsedValueNode.value, expectedValue),
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