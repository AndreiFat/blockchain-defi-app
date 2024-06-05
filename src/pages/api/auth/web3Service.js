import Web3 from 'web3';

let web3;

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
        window.ethereum.enable(); // Solicită acces la contul utilizatorului
    } catch (error) {
        console.error("Utilizatorul a refuzat accesul la conturi.");
    }
} else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
} else {
    console.log('Nu există un provider web3. Folosind un provider fallback.');
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

export default web3;
