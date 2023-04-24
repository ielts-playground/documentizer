import { createUser, ping } from '@apis';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

type User = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
};

export default function () {
    const router = useRouter();

    const [user, setUser] = useState<User>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        username: '',
    });

    useEffect(() => {
        const redirect = encodeURIComponent(window.location.pathname);
        ping().catch(() => {
            router.push(`/log-in?redirect=${redirect}`);
        });
    }, []);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUser((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (event: any) => {
        createUser(user).catch(() => {
            alert('Something wrong, please try again');
        });
    };

    const returnRedirecting = () => {
        router.push('/redirect');
    };

    return (
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
            <h2>Create an account for user</h2>
            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                />
            </label>
            <label>
                FirstName:
                <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                />
            </label>
            <label>
                LastName:
                <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                />
            </label>
            <label>
                UserName:
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Create User</button>
            <button type="button" onClick={returnRedirecting}>
                Return home
            </button>
        </form>
    );
}
