import web3 from "@/services/web3";
import Contract from "@/services/contract";
import {faEthereum} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoneyBillTransfer} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

function GoalCard(props) {
    const contract = Contract();
    const [inputValueFund, setInputValueFund] = useState('');
    const [inputValueWithdraw, setInputValueWithdraw] = useState('');
    const getImage = (type) => {
        let element
        switch (type) {
            case "vacation":
                element = <img
                    src={props.image !== '' ? props.name : "/assets/3DIcons/umbrella-dynamic-color.png"}
                    height={48}
                    alt=""/>
                break;
            case "investement":
                element = <img
                    src={props.image !== '' ? props.name : "/assets/3DIcons/bag-dynamic-color.png"}
                    height={48}
                    alt=""/>
                break;
            case "saving":
                element = <img
                    src={props.image !== '' ? props.name : "/assets/3DIcons/locker-dynamic-color.png"}
                    height={48}
                    alt=""/>
                break;
            case "gifts":
                element = <img
                    src={props.image !== '' ? props.name : "/assets/3DIcons/gift-dynamic-color.png"}
                    height={48}
                    alt=""/>
                break;
        }
        return <div>{element}</div>;
    }

    const fundGoal = async (goalIndex, amount, account) => {
        try {
            const amountInWei = web3.utils.toWei(amount.toString(), "ether");
            await contract.methods.fundGoal(goalIndex).send({from: account.ethAddress, value: amountInWei});

        } catch (error) {
            console.error("Error funding goal:", error);
        }
    };

    const withdrawFromGoal = async (goalIndex, amount, account) => {
        try {
            const amountInWei = web3.utils.toWei(amount.toString(), "ether");
            await contract.methods.withdrawFromGoal(account.ethAddress, goalIndex, amountInWei).send({from: account.ethAddress});
        } catch (error) {
            console.error("Error withdrawing from goal:", error);
        }
    };
    return (
        <>
            <div className="card border-0 rounded-4 bg-secondary-subtle p-1 p-lg-2 mb-4" data-bs-theme={"dark"}>
                <div className="card-body">
                    <div className={"d-flex align-items-center justify-content-between"}>
                        <div className={"d-flex align-items-center gap-3"}>
                            <img
                                src={props.image !== '' ? "/assets/3DIcons/umbrella-dynamic-color.png" : "/assets/3DIcons/umbrella-dynamic-color.png"}
                                height={48}
                                alt=""/>
                            <h6>{props.name}</h6>
                        </div>
                        <div className={"d-flex gap-4"}>
                            <div>
                                <p className="mb-0 text-secondary">Deadline</p>
                                <p>{props.deadline}</p>
                            </div>
                            <div>
                                <p className="mb-0 text-secondary">Status</p>
                                <p>{props.status}</p>
                            </div>
                        </div>
                    </div>
                    <div className={"d-flex gap-4 justify-content-between"}>
                        <div className={"d-flex gap-4"}>
                            <div>
                                <p className="mb-0 text-secondary">Balance</p>
                                <p className={"mb-0"}>{props.balance !== '0.' ? props.balance : "0"}</p>

                            </div>
                            <div>
                                <p className={"mb-0 text-secondary"}>Target</p>
                                <p className={"mb-0"}>{props.target} ETH</p>
                            </div>
                        </div>
                        <div>
                            {!props.completed && (
                                <><a className="btn btn-primary me-2" href="#" role="button"
                                     data-bs-toggle="dropdown" aria-expanded="false">
                                    <FontAwesomeIcon
                                        className={"fa-lg me-2"}
                                        icon={faEthereum}/> Deposit
                                </a>
                                    <ul className="dropdown-menu rounded-4 mt-1">
                                        <li className={"d-flex align-items-center gap-2 px-2"}>
                                            <input
                                                type="number"
                                                className="form-control py-2 rounded-4"
                                                placeholder="Enter amount"
                                                value={inputValueFund}
                                                onChange={(e) => setInputValueFund(e.target.value)}
                                            />
                                            <button className="btn btn-primary d-flex align-items-center"
                                                    onClick={() => fundGoal(props.index, parseFloat(inputValueFund), props.account)}>
                                                <FontAwesomeIcon
                                                    className={"fa-lg me-2"}
                                                    icon={faEthereum}/> Deposit
                                            </button>
                                        </li>
                                    </ul>
                                </>
                            )}
                            <a className="btn btn-success rounded-4" href="#" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon
                                    className={"fa-lg me-2"}
                                    icon={faMoneyBillTransfer}/> Withdraw
                            </a>
                            <ul className="dropdown-menu rounded-4 mt-1">
                                <li className={"d-flex align-items-center gap-2 px-2"}>
                                    <input
                                        type="number"
                                        className="form-control py-2 rounded-4"
                                        placeholder="Enter amount"
                                        value={inputValueWithdraw}
                                        onChange={(e) => setInputValueWithdraw(e.target.value)}
                                    />
                                    <button className="btn btn-success d-flex align-items-center"
                                            onClick={() => withdrawFromGoal(props.index, parseFloat(inputValueWithdraw), props.account)}>
                                        <FontAwesomeIcon
                                            className={"fa-lg me-2"}
                                            icon={faMoneyBillTransfer}/> Withdraw
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default GoalCard;