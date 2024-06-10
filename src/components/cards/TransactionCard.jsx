import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightLong} from "@fortawesome/free-solid-svg-icons";
import {truncateAddress} from "@/components/utils/truncateAddress";
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
                            <div className={"d-flex justify-content-between align-items-center mb-2"}>
                                <h6>{truncateAddress(props.notificationTitle)}</h6>
                                <div className={"d-flex justify-content-between align-items-center gap-2"}>
                                        <span
                                            className={"eth-address-wrap"}>{truncateAddress(props.from)}</span>
                                    <FontAwesomeIcon className={"font-text-primary"} icon={faRightLong}/>
                                    <span
                                        className={"eth-address-wrap"}>{truncateAddress(props.to)}</span>

                                </div>
                            </div>
                            <div className={"d-flex justify-content-between align-items-center"}>
                                <p className="mb-0 text-light fs-7 text-muted">{props.notificationDescription}</p>
                                {
                                    props.ethAmount !== '' ? (
                                        <h6 className={"font-text-primary mb-0"}>{props.ethAmount} <FontAwesomeIcon
                                            icon={faEthereum}/></h6>
                                    ) : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default TransactionCard