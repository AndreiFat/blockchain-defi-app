import Navbar from './navbar'
import Footer from './footer'

export default function AuthLayout({children}) {
    return (
        <>
            AUTH!!!
            <Navbar/>
            <main>{children}</main>
            <Footer/>
        </>
    )
}