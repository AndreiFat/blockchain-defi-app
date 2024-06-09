import Link from "next/link";
import {signIn, useSession} from "next-auth/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faUser} from "@fortawesome/free-regular-svg-icons";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Contract from "@/services/contract";
import {truncateAddress} from "@/components/utils/truncateAddress";
import {Toast, ToastContainer} from 'react-bootstrap';
import {fetchUserData, getUserBalance} from "@/utilities/user/userData";

export default function Navbar() {
    const router = useRouter();
    const {pathname} = router;
    const {data: session, status} = useSession();
    const contract = Contract();
    const [balance, setBalance] = useState(null);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        ethAddress: "",
    });
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchDataAndBalance = async () => {
            const data = await fetchUserData(session);
            setUserData(data);
            if (data && data.ethAddress) {
                const userBalance = await getUserBalance(data);

                console.log(typeof userBalance)
                const balance = parseFloat(userBalance)
                setBalance(balance.toFixed(3));
            }
        };

        if (session) {
            fetchDataAndBalance();
        }
    }, [session]);

    const handleCopyClick = async (event) => {
        event.preventDefault(); // Prevent the default link behavior
        const textToCopy = userData.ethAddress;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000); // Hide toast after 2 seconds
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

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
                                            alt="ETH Wallet Address" height={24}/><span
                                            className={"ms-2 fs-6"}
                                            onClick={handleCopyClick}
                                        >{truncateAddress(userData.ethAddress)}
                                            <FontAwesomeIcon className={"ms-2"} icon={faCopy}/></span></a>
                                    </li>
                                    <li className="nav-item">
                                        <span className="nav-link d-flex align-content-center"><img
                                            src={"/assets/3DIcons/eth-front-color.svg"}
                                            alt="ETH Amount" height={24}/><span
                                            className={"ms-2 fs-6"}>{balance} ETH</span></span>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link border border-secondary px-3 rounded-3" href="#"
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

            <ToastContainer position="bottom-end" className="p-3">
                <Toast className={"border-0 rounded-2 rounded-bottom-0"} onClose={() => setShowToast(false)}
                       show={showToast} delay={2500} autohide>
                    <Toast.Header className={"rounded-2 rounded-bottom-0 border-primary border-bottom-3"}>
                        <strong className="me-auto">Address was copied to clipboard</strong>
                    </Toast.Header>
                    {/*<Toast.Body></Toast.Body>*/}
                </Toast>
            </ToastContainer>
        </div>
    </>
}