import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = [
  ...nextCoreWebVitals,
  prettierRecommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'import/order': 'off',
      // React Hooks 7 rules added in eslint-config-next 16 flag existing components (32 places). They are warnings until
      // the components are fixed in a separate change, then back to errors.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
];

export default eslintConfig;
