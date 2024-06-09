import Web3 from "@/services/web3";
import web3 from "@/services/web3";
import Contract from "@/services/contract";

const contract = Contract();
export const fetchUserData = async (session) => {
    if (session) {
        try {
            const response = await fetch('/api/user');
            if (response.ok) {
                const data = await response.json();
                return data.user; // Assuming the returned object has a 'user' key
            } else {
                console.error('Failed to fetch user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
};

export const getUserBalance = async (userData) => {
    if (!userData || !userData.ethAddress) {
        console.error('Error: userData or userData.ethAddress is not defined.');
        return;
    }

    let ethAddress = userData.ethAddress;
    if (!ethAddress.startsWith('0x')) {
        ethAddress = '0x' + ethAddress;
    }

    console.log('Using Ethereum address:', ethAddress);

    try {
        const balanceInWei = await web3.eth.getBalance(ethAddress);
        const balanceAmount = Web3.utils.fromWei(balanceInWei, 'ether');
        console.log('User balance:', balanceAmount);
        return balanceAmount
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
};