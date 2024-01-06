import type { AppProps } from 'next/app';

import '@styles/_font.scss';

export default function ({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
