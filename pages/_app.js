import '/styles/globals.css';
import '/styles/highlight.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { Rubik } from 'next/font/google';

config.autoAddCss = false;

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const App = ({ Component, pageProps }) => {
  return (
    <div className={rubik.variable}>
      <Component {...pageProps} />
    </div>
  );
};

export default App;
