import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {useSession} from "next-auth/react";
import MainLayout from "@/components/MainLayout"
import MoneyStateCard from "@/components/cards/MoneyStateCard";
import TextSideBySide from "@/components/text/TextSideBySide";
import NotificationCard from "@/components/cards/NotificationCard";
import {useEffect, useState} from "react";
import Web3 from "@/services/web3";
import Contract from "@/services/contract";

const Home = () => {
    const {data: session, status} = useSession();
    const [contract, setContract] = useState(Contract);
    const [goalAmount, setGoalAmount] = useState(0);
    const [depositAmount, setDepositAmount] = useState('');
    const [account, setAccount] = useState(null)
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // Paste your contract address here
    const [userAccount, setUserAccount] = useState(null);
    const [balance, setBalance] = useState('0');

    const centralAccount = '0xDda92628F4090E966c878Bbc2087f010DB14229E';
    const centralAccountPrivateKey = '0xa6fd3e495dc20a4717fa6bf8eb2b2e1c36e7bf5cd4c0e16e07c20550644816ca';

    useEffect(() => {
        console.log(contract)
        if (contract) {
            getBalanceOfContract();
            getBalanceOfAnAddress()
        }

    }, [contract]);

    const getBalanceOfContract = async () => {
        try {
            const balance = await contract.methods.getBalance().call();
            console.log('Contract Balance:', balance);
        } catch (error) {
            console.error('Error fetching contract balance:', error);
        }
    };

    const getBalanceOfAnAddress = async () => {
        try {
            const balanceInWei = await contract.methods.getBalance().call({from: '0xdD4A93CA8DDA29E1382A0b958637aD740580F9dF'});
            const balance = Web3.utils.fromWei(balanceInWei, 'ether')
            console.log('Balanta contului', balance);
        } catch (error) {
            console.error('Error fetching contract balance:', error);
        }
    }

    const createNewUserAddress = async () => {
        const account = await contract.methods.owner().call();
        setAccount(account);

        try {
            const newAccount = await createAndFundAccount();
            console.log('Address:', newAccount.address);
            console.log('Private Key:', newAccount.privateKey);
            setUserAccount(newAccount);

            const balanceInWei = await contract.methods.getBalance().call({from: newAccount.address});
            const balance = Web3.utils.fromWei(balanceInWei, 'ether')
            console.log('Balanta contului', balance);
        } catch (error) {
            console.error('Error creating and funding account:', error);
        }
    };

    const createAndFundAccount = async () => {
        const account = Web3.eth.accounts.create();
        console.log('Created account:', account.address);

        const fundAmount = '0.01'; // 0.01 Ether
        const amountInWei = Web3.utils.toWei(fundAmount, 'ether');

        const gasPrice = await Web3.eth.getGasPrice();
        const gasLimit = 21000;

        const tx = {
            from: centralAccount,
            to: account.address,
            value: amountInWei,
            gas: gasLimit,
            gasPrice: gasPrice
        };

        try {
            const signedTx = await Web3.eth.accounts.signTransaction(tx, centralAccountPrivateKey);
            const receipt = await Web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Funding transaction receipt:', receipt);
            console.log('New account created and funded:', account.address);


            // Initialize the balance in the smart contract
            await initializeBalanceInContract(account, amountInWei);

            return account;
        } catch (error) {
            console.error('Transaction error:', error);
        }
    };

    const initializeBalanceInContract = async (accountCreated, amountInWei) => {
        try {
            // Get the owner's address from the contract
            const ownerAddress = await contract.methods.owner().call();

            console.log(`Initializing balance for ${accountCreated.address} with ${amountInWei} Wei`);

            // Prepare the transaction data
            const txData = contract.methods.initializeBalance(accountCreated.address, amountInWei).encodeABI();
            // Sign the transaction using the owner's private key
            const signedTx = await Web3.eth.accounts.signTransaction({
                from: ownerAddress, // Sender's address (contract owner)
                to: contractAddress, // Contract address
                data: txData, // Transaction data
                gas: 2100000, // Gas limit
                gasPrice: await Web3.eth.getGasPrice() // Gas price
            }, process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY); // Owner's private key

            // Send the signed transaction to the network
            const receipt = await Web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Initialize balance transaction receipt:', receipt);
        } catch (error) {
            console.error('Error during initializing balance:', error);
        }
    };

    const deposit = async (amountInEth) => {
        const amountInWei = Web3.utils.toWei(amountInEth.toString(), 'ether');
        await contract.methods.deposit().send({from: account, value: amountInWei});
        await getBalanceOfContract(contract, account);
    };

    const withdraw = async (amountInEth) => {
        const amountInWei = Web3.utils.toWei(amountInEth.toString(), 'ether');
        await contract.methods.withdraw(amountInWei).send({from: account});
        await getBalanceOfContract(contract, account);
    };

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
                <button onClick={createNewUserAddress}>generate new user address</button>

                <div>
                    <p>Balance: {balance} ETH</p>
                    <button onClick={() => deposit(1)}>Deposit 1 ETH</button>
                    <button onClick={() => withdraw(1)}>Withdraw 1 ETH</button>
                </div>

                <pre>{JSON.stringify(session, null, 2)}</pre>
                {/*<LoginBtn/>*/}

                <div className="row">
                    <div className="col-md-6">
                        <p className={"text-secondary"}>Account Summary</p>
                        <MoneyStateCard amount={1500} dollarAmount={40}/>
                        <div className={"mb-3"}>
                            <TextSideBySide text={"Money Saved"} moneyAmount={100.31}></TextSideBySide>
                            <TextSideBySide text={"Money blocked in transactions"}
                                            moneyAmount={313.11}></TextSideBySide>
                            <TextSideBySide text={"Money for subscriptions"} moneyAmount={500.31}></TextSideBySide>
                            <TextSideBySide text={"From future transactions"} moneyAmount={1232423.31}></TextSideBySide>
                            <TextSideBySide text={"Loan money"} moneyAmount={1203.31}></TextSideBySide>

                        </div>
                        <MoneyStateCard amount={1500} goal={"new car"} moneyNeeded={"293"}/>
                        <MoneyStateCard amount={1500} goal={"new car"} moneyNeeded={"293"}/>
                    </div>
                    <div className="col-md-6">
                        <p className={"text-secondary"}>Notifications</p>
                        <NotificationCard
                            href={"/assets/3DIcons/plus-dynamic-color.svg"}
                            notificationTitle={"Money Added"}
                            notificationDescription={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus id lectus sodales consectetur. Nunc eleifend auctor augue, sed pulvinar odio tempus at."}
                        ></NotificationCard>
                        <NotificationCard
                            href={"/assets/3DIcons/at-dynamic-color.svg"}
                            notificationTitle={"Transaction in progress"}
                            notificationDescription={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus id lectus sodales consectetur. Nunc eleifend auctor augue, sed pulvinar odio tempus at."}
                        ></NotificationCard>

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