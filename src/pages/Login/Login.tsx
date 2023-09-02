import { useState, useEffect, MouseEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import PageNav from '@/components/PageNav/PageNav';

import styles from './Login.module.css';

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('jack@example.com');
  const [password, setPassword] = useState('qwerty');

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const handleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (email && password) login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/cities');
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}
