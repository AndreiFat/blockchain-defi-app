import Web3 from "@/services/web3";
import {ContractABI} from "@/components/utils/savingGoalsABI";

const contract = () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // Paste your contract address here
    try {
        return new Web3.eth.Contract(ContractABI, contractAddress, {
            from: process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS,
            gas: 6721975
        })
    } catch (error) {
        console.error('Error loading accounts:', error);
    }
}

export default contract;