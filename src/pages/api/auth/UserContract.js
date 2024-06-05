import web3 from './web3Service';

const address = 'ADRESA_CONTRACTULUI_INTELIGENT';
const abi = [
    // ABI-ul contractului inteligent
];

const contract = new web3.eth.Contract(abi, address);

export default contract;
