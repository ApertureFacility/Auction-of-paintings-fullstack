import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.column_support}>
        <h3 className={styles.title}>Support</h3>
        <ul className={styles.list}>
          <li>Help ctnter</li>
          <li>Locations</li>
          <li>Download the app</li>
        </ul>
      </div>

      <div className={styles.column_corporate}>
        <h3 className={styles.title}>Corporate</h3>
        <ul className={styles.list}>
          <li>Press</li>
          <li>Privacy policy</li>
          <li>Corporate governance</li>
          <li>Careers</li>
        </ul>
      </div>

      <div className={styles.column_more}>
        <h3 className={styles.title}>More</h3>
        <ul className={styles.list}>
          <li>Security</li>
          <li>Terms&Conditions</li>
          <li>Conidtions of buisiness</li>
          <li>Modern slavery statement</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
