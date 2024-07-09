import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {useSession} from "next-auth/react";
import MainLayout from "@/components/MainLayout"
import MoneyStateCard from "@/components/cards/MoneyStateCard";
import TextSideBySide from "@/components/text/TextSideBySide";
import {useEffect, useState} from "react";
import web3 from "@/services/web3";
import Contract from "@/services/contract";
import {fetchUserData, getUserBalance} from "@/utilities/user/userData";

const Home = () => {
    const {data: session, status} = useSession();
    const contract = Contract();
    const [goalAmount, setGoalAmount] = useState(0);
    const [depositAmount, setDepositAmount] = useState('');
    const [account, setAccount] = useState(null)
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // Paste your contract address here
    const [userAccount, setUserAccount] = useState(null);
    const [balance, setBalance] = useState('0');
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        ethAddress: "",
    });
    const [priceLoading, setPriceLoading] = useState(true);
    const [ethAmount, setEthAmount] = useState('');
    const [usdAmount, setUsdAmount] = useState(null);
    const [ethPrice, setEthPrice] = useState(null);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/cryptoCurrency');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCryptoData(data); // Adjust according to the structure of the response
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching data', error);
                setLoading(false); // Set loading to false even if there is an error
            }
        };

        // Initial fetch
        fetchData();

    }, []);

    useEffect(() => {
        const fetchUserDataAndBalance = async () => {
            const data = await fetchUserData(session);
            setUserData(data);
            if (data && data.ethAddress) {
                const userBalance = await getUserBalance(data);
                setBalance(userBalance);

                const goalsCount = await contract.methods.getAllGoals(data.ethAddress).call();
                const allGoals = [];
                let count = 0;
                if (goalsCount.length !== 0) {
                    count = 1
                    count = goalsCount.length !== 1 ? 2 : 1
                }
                for (let i = 0; i < count; i++) {
                    const goal = await contract.methods.getGoal(data.ethAddress, i).call();
                    allGoals.push({index: i, ...goal});
                }
                setGoals(allGoals);
            }

        };

        if (session) {
            fetchUserDataAndBalance();

        }
    }, [session]);

    useEffect(() => {
        const fetchUserDataAndBalance = async () => {
            if (userData && userData.ethAddress) {

                const goalsCount = await contract.methods.getAllGoals(userData.ethAddress).call();
                const allGoals = [];
                let count = 0;
                if (goalsCount.length !== 0) {
                    count = 1
                    count = goalsCount.length !== 1 ? 2 : 1
                }
                for (let i = 0; i < count; i++) {
                    const goal = await contract.methods.getGoal(userData.ethAddress, i).call();
                    allGoals.push({index: i, ...goal});
                }
                setGoals(allGoals);
            }

        };
        if (session) {
            fetchUserDataAndBalance();

        }
    }, [session, goals]);


    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch('/api/eth-to-usd');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEthPrice(data.price);
                setPriceLoading(false);
            } catch (error) {
                console.error('Error fetching ETH price', error);
                setPriceLoading(false);
            }
        };

        fetchEthPrice();
    }, []);

    useEffect(() => {
        if (ethPrice && balance) {
            console.log(ethPrice)
            console.log(balance)
            const usd = parseFloat(balance) * ethPrice;
            setUsdAmount(usd);
        }
    }, [ethPrice, balance]);

    const convertToUsd = (ethAmount) => {
        if (ethPrice) {
            return parseFloat(ethAmount) * ethPrice;
        }
    }

    // if (!session) {
    //     return <>
    //         <Head>
    //             <title>EtherLoan</title>
    //             <meta name="description" content="Generated by create next app"/>
    //             <meta name="viewport" content="width=device-width, initial-scale=1"/>
    //             <link rel="icon" href="/assets/Logo-simple.svg"/>
    //         </Head>
    //         <main className={"my-5"}>
    //             <div class="row">
    //                 <div class="col-md-6">
    //                     <CardUnauthenticated></CardUnauthenticated>
    //                 </div>
    //             </div>
    //         </main>
    //     </>
    // }

    return (
        <>
            <Head>
                <title>EtherLoan</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/assets/Logo-simple.svg"/>
            </Head>
            <main className={`${styles.main}`}>
                {/*<button onClick={createNewUserAddress}>generate new user address</button>*/}

                {/*<div>*/}
                {/*    <button onClick={() => deposit(1)}>Deposit 1 ETH</button>*/}
                {/*    <button onClick={() => withdraw(1)}>Withdraw 1 ETH</button>*/}
                {/*</div>*/}

                {/*<pre>{JSON.stringify(session, null, 2)}</pre>*/}
                {/*<LoginBtn/>*/}

                <div className="row my-4">
                    <div className="col-md-8">
                        <p className={"text-secondary"}>Account Summary</p>
                        <MoneyStateCard amount={balance} dollarAmount={usdAmount} loading={priceLoading}/>
                        <div className={"mb-3"}>
                            <TextSideBySide text={"Money Saved"} moneyAmount={100.31}></TextSideBySide>
                            <TextSideBySide text={"Money blocked in transactions"}
                                            moneyAmount={313.11}></TextSideBySide>
                            <TextSideBySide text={"Money for subscriptions"} moneyAmount={500.31}></TextSideBySide>
                            <TextSideBySide text={"From future transactions"} moneyAmount={1232423.31}></TextSideBySide>
                            <TextSideBySide text={"Loan money"} moneyAmount={1203.31}></TextSideBySide>

                        </div>
                        {goals.map((goal, index) => (
                            <div key={index}>
                                <MoneyStateCard amount={web3.utils.fromWei(goal.balance, "ether")} goal={goal.name}
                                                index={index} account={userData}
                                                moneyNeeded={convertToUsd(web3.utils.fromWei(goal.targetAmount, "ether")) - convertToUsd(web3.utils.fromWei(goal.balance, "ether"))}/>
                            </div>
                        ))}

                    </div>
                    <div className="col-md-4">
                        <p className={"text-secondary"}>Crypto Data</p>
                        {/*<NotificationCard*/}
                        {/*    href={"/assets/3DIcons/plus-dynamic-color.svg"}*/}
                        {/*    notificationTitle={"Money Added"}*/}
                        {/*    notificationDescription={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus id lectus sodales consectetur. Nunc eleifend auctor augue, sed pulvinar odio tempus at."}*/}
                        {/*></NotificationCard>*/}
                        {/*<NotificationCard*/}
                        {/*    href={"/assets/3DIcons/at-dynamic-color.svg"}*/}
                        {/*    notificationTitle={"Transaction in progress"}*/}
                        {/*    notificationDescription={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus id lectus sodales consectetur. Nunc eleifend auctor augue, sed pulvinar odio tempus at."}*/}
                        {/*></NotificationCard>*/}
                        <div className="card border-0 rounded-4 bg-secondary-subtle px-1 px-lg-3"
                             data-bs-theme={"dark"}>
                            <div className="card-body">
                                {loading ? (
                                    <div className={"spinner-style"}></div>
                                ) : (
                                    cryptoData.map((crypto) => (
                                        <div key={crypto.id} className={"my-1 my-lg-3"}>
                                            <div className={"d-flex justify-content-between align-items-center"}>
                                                <div className={"d-flex align-items-center"}>
                                                    <img src={crypto.logo} alt={`${crypto.name} logo`} width="36"
                                                         height="36"/>
                                                    <div className={"ms-3"}>
                                                        <h6 className={"mb-0"}>{crypto.name}</h6>
                                                        <p className={"mb-0 text-secondary"}>{crypto.symbol}</p>
                                                    </div>
                                                </div>
                                                <p className={"mb-0"}>${crypto.quote.USD.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )))}

                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

Home.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};

export default Home;