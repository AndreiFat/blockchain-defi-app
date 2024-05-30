import {useState} from 'react';
import {signIn} from 'next-auth/react';

export default function Register() {
    const [credentials, setCredentials] = useState({username: '', email: '', password: ''});

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Call the custom API route to register the user
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('User registered successfully:', data.message);

            // Now sign in the user using next-auth
            const result = await signIn('credentials', {
                redirect: false,
                username: credentials.username,
                password: credentials.password,
            });

            if (!result.error) {
                // Successfully signed in
                console.log('Successfully signed in');
                window.location.href = '/';
            } else {
                // Error signing in
                console.error('Error signing in:', result.error);
            }
        } else {
            // Error registering user
            console.error('Error registering user:', data.message);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={credentials.username}
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={credentials.email} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={credentials.password}
                           onChange={handleChange}/>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
