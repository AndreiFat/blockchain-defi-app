import Link from "next/link";
import {signIn, useSession} from "next-auth/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export default function Navbar() {
    const router = useRouter();
    const {pathname} = router;
    const {data: session, status} = useSession();

    return <>
        <div className="nav-dark" data-bs-theme="dark">
            <nav className="navbar navbar-expand-lg text-white py-4">
                <div className="container">
                    <Link className={"nav-brand me-2"} href={"/"}><img src={"/assets/Logo-simple.svg"}
                                                                       alt={"Go to homepage"} height={42} width={42}
                    /></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse d-lg-flex justify-content-between"
                         id="navbarNavDropdown">

                        <ul className="navbar-nav d-flex gap-lg-3">
                            <li className="nav-item">
                                <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}
                                      aria-current="page" passHref>
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/transactions"
                                      className={`nav-link ${pathname.startsWith('/transactions') ? 'active' : ''}`}
                                      passHref>
                                    Transactions
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/savings" className={`nav-link ${pathname === '/savings' ? 'active' : ''}`}
                                      passHref>
                                    Savings
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/lendings"
                                      className={`nav-link ${pathname === '/lendings' ? 'active' : ''}`}
                                      passHref>
                                    Lending
                                </Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav gap-lg-3">
                            {session ?
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-content-center" href="#"><img
                                            src={"/assets/3DIcons/wallet-front-color.png"}
                                            alt="ETH Wallet Address" height={24}/><span className={"ms-2 fs-6"}>eth address</span></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-content-center" href="#"><img
                                            src={"/assets/3DIcons/eth-front-color.svg"}
                                            alt="ETH Amount" height={24}/><span className={"ms-2 fs-6"}>eth</span></a>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link border border-secondary px-3 rounded-4" href="#"
                                           role="button"
                                           data-bs-toggle="dropdown"
                                           aria-expanded="false"
                                        >
                                            <FontAwesomeIcon className={"me-2"} icon={faUser}/>{session.user.name}
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </li>
                                </>
                                : <button className={"bg-transparent border-0"}
                                          onClick={() => signIn()}>Login</button>}

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </>
}