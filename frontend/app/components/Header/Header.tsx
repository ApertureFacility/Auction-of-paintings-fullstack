import styles from "./Header.module.css";
import SearchInput from "../Search/Search";
import { ChangeEvent } from "react";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>AUCTION.COM</div>

      <nav className={styles.nav}>
        <a href="#">preferred access</a>
        <a href="#">about</a>
        <a href="#">discover</a>
        <a href="#">services</a>
        <a href="#">Как купить или продать</a>
      </nav>

      <div className={styles.right}>
        <div className={styles.rigt_part}>
        <button className={styles.authButton}>
          <img src="/login.svg" alt="auth" />
          <span>Авторизация</span>
        </button>


        <img src="/lupa.svg" alt="Поиск" className={styles.icon} />
        <img src="/star.svg" alt="Избранное" className={styles.iconStar} />


        </div>
      <img src="/Bag.svg" alt="Корзина" className={styles.iconBasket} />
      <img src="/Burger.svg" alt="Избранное" className={styles.iconBurger} />
      </div>
      <SearchInput  value={""} onChange={function (e: ChangeEvent<HTMLInputElement>): void {
              throw new Error("Function not implemented.");
          } }/>
    </header>
  );
};

export default Header;
