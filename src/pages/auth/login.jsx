import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const router = useRouter();
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            username: credentials.username,
            password: credentials.password,
        });
        if (!result.error) {
            // Successfully signed in, redirect to the desired page
            await router.push('/');
        } else {
            // Error signing in
            console.error('Error signing in:', result.error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={credentials.username} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
