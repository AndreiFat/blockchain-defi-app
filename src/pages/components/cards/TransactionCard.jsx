import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong, faRightLong} from "@fortawesome/free-solid-svg-icons";
import {truncateAddress} from "@/pages/components/utils/truncateAddress";
import {faEthereum} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

function TransactionCard(props) {
    return (
        <>
            <Link href={props.link}
                  className="text-decoration-none card border-0 rounded-4 bg-secondary-subtle p-1 p-lg-2 mb-4"
                  data-bs-theme={"dark"}>
                <div className="card-body">
                    <div className={"d-flex me-3 align-items-center"}>
                        <div className={"me-2 me-lg-3"}>
                            <img src={props.href} height={64} alt=""/>
                        </div>
                        <div className={"w-100"}>
                            <div className={"d-flex justify-content-between align-items-center mb-1"}>
                                <h5>{props.notificationTitle}</h5>
                                <div className={"d-flex justify-content-between align-items-center gap-2"}>
                                    {props.direction === "left" ? <>
                                        <span
                                            className={"eth-address-wrap"}>{truncateAddress('0x32Be343B94f860124dC4fEe278FDCBD38C102D88')}</span>
                                        <FontAwesomeIcon className={"font-text-primary"} icon={faRightLong}/>
                                        <span
                                            className={"eth-address-wrap"}>{truncateAddress('0x32Be343B94f860124dC4fEe278FDCBD38C102D88')}</span></> : <>
                                        <span
                                            className={"eth-address-wrap"}>{truncateAddress('0x32Be343B94f860124dC4fEe278FDCBD38C102D88')}</span>
                                        <FontAwesomeIcon className={"font-text-primary"} icon={faLeftLong}/>
                                        <span
                                            className={"eth-address-wrap"}>{truncateAddress('0x32Be343B94f860124dC4fEe278FDCBD38C102D88')}</span></>}
                                </div>
                            </div>
                            <div className={"d-flex justify-content-between align-items-center"}>
                                <p className="mb-0 text-light fs-7 text-muted">{props.notificationDescription}</p>
                                <h6 className={"font-text-primary mb-0"}>{props.ethAmount} <FontAwesomeIcon
                                    icon={faEthereum}/></h6>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default TransactionCard