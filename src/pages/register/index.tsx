import { createUser } from '@apis';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import Auth from '@components/Auth';

type User = {
    email: string;
    phoneNumber: string;
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
        phoneNumber: '',
        password: '',
        username: '',
    });

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUser((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event: any) => {
        const success = await createUser(user);
        if (success) {
            alert('Create user successfully');
        } else {
            alert('Something wrong, please try again!');
        }
    };

    const returnHome = () => {
        router.push('/');
    };

    return (
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
            <Auth />
            <h2>Create an account</h2>
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
                Phone number:
                <input
                    type="number"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleChange}
                />
            </label>
            <label>
                First name:
                <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                />
            </label>
            <label>
                Last name:
                <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                />
            </label>
            <label>
                Username:
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
            <div className={styles.buttons}>
                <button type="submit">Create</button>
                <button type="button" onClick={returnHome}>
                    Back
                </button>
            </div>
        </form>
    );
}
