import Navbar from './navbar'
import Footer from './footer'

export default function AuthLayout({children}) {
    return (
        <>
            <Navbar/>
            <main className={"container"}>{children}</main>
            <Footer/>
        </>
    )
}