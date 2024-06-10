import web3 from "@/services/web3";
import Contract from "@/services/contract";
import {faEthereum} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoneyBillTransfer} from "@fortawesome/free-solid-svg-icons";

function GoalCard(props) {
    const contract = Contract();

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
                                <p>{props.balance !== '0.' ? props.balance : "0"}</p>

                            </div>
                            <div>
                                <p className={"mb-0 text-secondary"}>Target</p>
                                <p>{props.target} ETH</p>
                            </div>
                        </div>
                        <div>
                            {!props.completed && (
                                <button className={"btn btn-primary me-2"}
                                        onClick={() => fundGoal(props.index, 0.0001, props.account)}><FontAwesomeIcon
                                    className={"fa-lg me-2"}
                                    icon={faEthereum}/> Deposit</button>
                            )}
                            <button className={"btn btn-success rounded-4"}
                                    onClick={() => withdrawFromGoal(props.index, 0.0001, props.account)}>
                                <FontAwesomeIcon
                                    className={"fa-lg me-2"}
                                    icon={faMoneyBillTransfer}/> Withdraw
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default GoalCard;