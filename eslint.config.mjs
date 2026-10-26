import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = [
  ...nextCoreWebVitals,
  prettierRecommended,
  {
    rules: {
      'no-unused-vars': ['warn', { ignoreRestSiblings: true }],
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'import/order': 'off',
    },
  },
];

export default eslintConfig;
