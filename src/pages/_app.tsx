import {AppProps} from 'next/app';
import'../styles/global.scss'
import {Header} from '../components/Header'
import {Provider as NextAuthProvider} from 'next-auth/client'
import {PayPalScriptProvider} from '@paypal/react-paypal-js'

const initialOptions ={
  "client-id":"AcR7_yd3_4FXJFJFEA3AFOzU1kgdwZgxHwetImu3df3E7Wn7Ytqf-PbsaCbNq03o6eY4T2lZjQhvLo8s",
  currency:"BRL",
  intent:"capture",
}
function MyApp({ Component, pageProps }:AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
    <PayPalScriptProvider options={initialOptions}>
      <Header/>
      <Component {...pageProps} />
    </PayPalScriptProvider>
    </NextAuthProvider>
  )
}

export default MyApp
