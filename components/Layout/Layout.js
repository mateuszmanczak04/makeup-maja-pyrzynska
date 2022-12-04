import useWindowWidth from '../../hooks/useWindowWidth';
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';
import styles from './Layout.module.scss';

export default function Layout({ children }) {
  const windowWidth = useWindowWidth();

  return (
    <div className={styles.container}>
      {windowWidth >= 1100 ? <Header /> : <SideNav />}
      {children}
    </div>
  );
}
