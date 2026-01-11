import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  // add more generic rulesets here, such as:
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'indent': ['error', 2],
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    }
  },
  {
    // Test files configuration
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      // Allow multiple Vue components in test files
      'vue/one-component-per-file': 'off',
      // Allow reassigning global in tests (for mocking)
      'no-redeclare': 'off'
    }
  }
]
