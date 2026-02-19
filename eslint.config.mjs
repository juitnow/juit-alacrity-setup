import configurations from '@plugjs/eslint-plugin-vue'

export default [
  ...configurations,

  // ===== DEFINE THE LOCATION OF OUR TSCONFIG.JSON FILES ======================
  {
    name: 'local/options',

    languageOptions: {
      parserOptions: {
        createDefaultProgram: true,
        project: [
          './tsconfig.json',
          './tsconfig.node.json',
          './tsconfig.vue.json',
          './worker/tsconfig.json',
        ],
      },
    },
  },

  // ===== IGNORED FILES =======================================================
  // REMEMBER! Ignores *must* be in its own configuration, they can not coexist
  // with "rules", "languageOptions", "files", ... or anything else, otherwise
  // ESLint will blaantly ignore the ignore files!
  {
    name: 'local/ignores',

    ignores: [
      'dist/',
      'public/',
    ],
  },
]
