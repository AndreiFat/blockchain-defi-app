import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Codul rulează pe client și MetaMask este instalat
    web3 = new Web3(window.ethereum);
    try {
        window.ethereum.enable(); // Solicită acces la contul utilizatorului
    } catch (error) {
        console.error("Accesul la cont a fost refuzat.");
    }
} else {
    // Codul rulează pe server sau MetaMask nu este instalat
    const provider = new Web3.providers.HttpProvider(
        'http://127.0.0.1:7545' // Adresa nodului local Ganache
    );
    web3 = new Web3(provider);
}

export default web3;



// import Web3 from 'web3';
//
// let web3;
//
// if (window.ethereum) {
//     web3 = new Web3(window.ethereum);
//     try {
//         window.ethereum.enable(); // Solicită acces la contul utilizatorului
//     } catch (error) {
//         console.error("Utilizatorul a refuzat accesul la conturi.");
//     }
// } else if (window.web3) {
//     web3 = new Web3(window.web3.currentProvider);
// } else {
//     console.log('Nu există un provider web3. Folosind un provider fallback.');
//     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// }
//
// export default web3;

