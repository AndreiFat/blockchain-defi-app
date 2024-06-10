import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEthereum} from "@fortawesome/free-brands-svg-icons";
import {faEyeSlash} from "@fortawesome/free-regular-svg-icons";
import {faVault} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

function MoneyStateCard(props) {
    const [isVisible, setIsVisible] = useState(true);
    const handleViewMoneyAmount = () => {
        setIsVisible(!isVisible)
    };

    const handleAddMoneyToGoal = () => {
        console.log("Add Money to " + props.goal)
    }

    return (
        <>
            <div className="card border-0 rounded-4 bg-secondary-subtle p-2 mb-4" data-bs-theme={"dark"}>
                <div className="card-body">
                    <div className={"d-flex justify-content-between align-items-center"}>
                        <div className={"d-flex align-items-end"}>
                            <h1 id="amount"
                                className={`mb-0 font-text-primary fw-bold fs-1 me-3 ${isVisible ? '' : 'blurAmount'}`}>{new Intl.NumberFormat("en-US").format(props.amount)}
                                <FontAwesomeIcon className={"ms-2"}
                                                 icon={faEthereum}/>
                            </h1>
                            {props.dollarAmount ?
                                <p id="dollarAmount" className={`mb-0 fs-5 ${isVisible ? '' : 'blurAmount'}`}>
                                    {props.dollarAmount ? (props.loading ? (
                                        <div className={"spinner-style"}></div>
                                    ) : (`${new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD'
                                    }).format(props.dollarAmount)}`)) : ('$ 0')}
                                </p> : <></>}
                            {props.goal ? <p id="dollarAmount" className="mb-0 fs-5">
                                For {props.goal}
                            </p> : <></>}
                        </div>
                        <div>
                            <button className={"btn btn-link text-decoration-none text-muted fs-5 m-0 p-0 "}
                                    onClick={handleViewMoneyAmount}>
                                <FontAwesomeIcon
                                    icon={faEyeSlash}/></button>
                        </div>
                    </div>
                    {props.goal ?
                        <div className={"d-flex justify-content-between align-items-center mt-3"}>
                            <div className={"text-secondary"}>
                                {

                                    `${new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD'
                                    }).format(props.moneyNeeded)}`} more is needed
                            </div>
                            <button className={"font-text-primary p-0 btn btn-link text-decoration-none"}
                                    onClick={handleAddMoneyToGoal}>
                                <FontAwesomeIcon
                                    className={"me-2"}
                                    icon={faVault}/> Add money now
                            </button>
                        </div> : <></>}
                </div>
            </div>
        </>
    )
}

export default MoneyStateCard