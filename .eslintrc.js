const INLINE_ELEMENTS = require('./node_modules/eslint-plugin-vue/lib/utils/inline-non-void-elements.json');
const htmlElementContentNewlineIgnores = ["pre", "textarea", "v-icon", ...INLINE_ELEMENTS];

module.exports = {
    "extends": ["eslint:recommended",
    'plugin:vue/recommended'],
    "env": {
        "browser": true,
        "es6": true
    },
    "globals": {
        "$STR": "readonly",
        "$STRF": "readonly",
        "$": "readonly",
        "$$": "readonly",
        "browser": "readonly",
        "chrome": "readonly",
        "BigInteger": "readonly",
        "__KeeIsRunningInAWebExtensionsBrowser": "readonly"
    },
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "@typescript-eslint/parser",
        "project": "tsconfig.json",
        "sourceType": "module",
        "extraFileExtensions": [".vue"]
    },
    "plugins": [
        "@typescript-eslint",
        "vuetify"
    ],
    "rules": {
        "vue/require-prop-types": "off",
        "vue/singleline-html-element-content-newline": ["error", {
            "ignoreWhenNoAttributes": true,
            "ignoreWhenEmpty": true,
            "ignores": htmlElementContentNewlineIgnores
        }],
        "vue/multiline-html-element-content-newline": ["error", {
            "ignoreWhenEmpty": true,
            "ignores": htmlElementContentNewlineIgnores,
            "allowEmptyLines": false
        }],
        "vue/attribute-hyphenation": "off",
        "vuetify/no-deprecated-classes": "error",
        "vuetify/grid-unknown-attributes": "error",
        "vuetify/no-legacy-grid": "error",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/indent": "error",
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/quotes": [
            "error",
            "double",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "arrow-body-style": "error",
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "camelcase": "error",
        "comma-dangle": "error",
        "eol-last": "error",
        // Way too buggy to use in feb 2020
        // https://github.com/eslint/eslint/issues/12567
        // "id-blacklist": [
        //     "error",
        //     "any",
        //     "Number",
        //     "number",
        //     "String",
        //     "string",
        //     "Boolean",
        //     "boolean",
        //     "Undefined",
        //     "undefined"
        // ],
        "id-match": "error",
        "linebreak-style": [
            "error",
            "windows"
        ],
        "max-len": [
            "error",
            {
                "code": 250
            }
        ],
        "new-parens": "error",
        "no-duplicate-case": "error",
        "no-eval": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2
            }
        ],
        "no-redeclare": "error",
        "no-return-await": "error",
        "no-sequences": "off",
        "no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-throw-literal": "error",
        "no-trailing-spaces": [
            "error",
            {
                "ignoreComments": true
            }
        ],
        "no-undef-init": "error",
        "no-underscore-dangle": "off",
        "no-unsafe-finally": "error",
        "no-unused-expressions": [
            "error",
            {
                "allowShortCircuit": true
            }
        ],
        // Doesn't work well with TypeScript
        "no-unused-vars": "off",

        "no-var": "error",
        "one-var": [
            "error",
            "never"
        ],
        "prefer-const": "error",
        "quote-props": [
            "error",
            "consistent-as-needed"
        ],
        "space-before-function-paren": [
            "error",
            "always"
        ],
        // "@typescript-eslint/tslint/config": [
        //     "error",
        //     {
        //         "rules": {
        //             "whitespace": [
        //                 true,
        //                 "check-branch",
        //                 "check-separator",
        //                 "check-type"
        //             ]
        //         }
        //     }
        // ]
    }
};
