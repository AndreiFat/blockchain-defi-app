import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import {SessionProvider} from "next-auth/react";
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import FontAwesome CSS
import {config} from '@fortawesome/fontawesome-svg-core';
import {useEffect} from "react";


config.autoAddCss = false;

export default function App({
                                Component,
                                pageProps: {session, ...pageProps},
                            }) {
    const getLayout = Component.getLayout ?? ((page) => page)
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);


    return (
        <SessionProvider session={session}>
            {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
    )
}