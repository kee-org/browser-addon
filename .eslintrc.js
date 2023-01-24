const INLINE_ELEMENTS = require('./node_modules/eslint-plugin-vue/lib/utils/inline-non-void-elements.json');
const htmlElementContentNewlineIgnores = ["v-btn", "pre", "textarea", "v-icon", ...INLINE_ELEMENTS];

module.exports = {
    root: true,
    "extends": [
        "eslint:recommended",
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/recommended',
        "plugin:prettier/recommended",
        "plugin:vuetify/base"
    ],
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
        "prettier",
        "vue"
    ],
    "rules": {
        "prettier/prettier": "off",
        "vue/html-indent": "off",
        "vue/max-attributes-per-line": "off",
        "vue/html-closing-bracket-newline": "off",
        "vue/html-self-closing": "off",
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
        "vue/multi-word-component-names": "off",
        "@typescript-eslint/consistent-type-assertions": "error",
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
        "id-blacklist": [
            "error",
            "any",
            "Number",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
        ],
        "id-match": "error",
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
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
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
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": [
            "error",
            {
                "allowShortCircuit": true
            }
        ],
        "no-var": "error",
        "one-var": [
            "error",
            "never"
        ],
        "prefer-const": "error",
        "curly": [2, "multi-line"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off"
    },
    overrides: [
        {
          files: [
            "**/*.test.ts"
          ],
          env: {
            jest: true
          },
          "extends": ["plugin:jest/recommended"],
          plugins: ["jest"]
        }
    ]
};
