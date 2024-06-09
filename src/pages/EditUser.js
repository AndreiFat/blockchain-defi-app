import React, { useState } from 'react';
import { useEffect } from 'react';
//import contract from './UserContract';
import web3 from './web3Service';


const EditUser = () => {
    const [userAddress, setUserAddress] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.updateUser(userAddress, userData.name, userData.email).send({ from: accounts[0] });

            setMessage('Datele utilizatorului au fost actualizate cu succes!');
        } catch (error) {
            console.error(error);
            setMessage('A apărut o eroare la actualizarea datelor utilizatorului.');
        }

        setLoading(false);
    };

    return (
        <div>
            <h2>Editare Date Utilizator</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Adresa Utilizatorului:</label>
                    <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Nume:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Actualizare...' : 'Actualizează'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditUser;
