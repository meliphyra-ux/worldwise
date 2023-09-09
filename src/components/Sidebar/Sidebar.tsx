import { Outlet } from 'react-router-dom';

import Logo from '../Logo/Logo';
import AppNav from '../AppNav/AppNav';
import Footer from '../Footer/Footer';

import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <Footer />
    </aside>
  );
};

export default Sidebar;
