import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../apiServices';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const credentials = { email, password };

        apiService.login(credentials)
            .then((response) => {
                if (response.data.access_token) {
                    localStorage.setItem('jwtToken', response.data.access_token);

                    const userData = {
                        email: response.data.email,
                        role: response.data.role,
                    };
                    onLogin(userData);
                    navigate('/')

                } else {
                    alert('Invalid credentials');
                }
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f4f4f4',
            fontFamily: 'Arial, sans-serif',
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px',
            }}>
                <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                            Email:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '14px',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                            Password:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '14px',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#007BFF',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
