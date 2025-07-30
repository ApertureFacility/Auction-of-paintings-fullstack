"use client";

import styles from "./Header.module.css";
import SearchInput from "../Search/Search";
import { ChangeEvent } from "react";
import { useModalStore } from "../../lib/modalStore";
import Link from "next/link";
import { useAuth } from "../hooks/Auth";

const Header = () => {
  const openModal = useModalStore((state) => state.open);
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          AUCTION.COM
        </Link>
        <nav className={styles.nav}>
          <a href="#">preferred access</a>
          <a href="#">about</a>
          <a href="#">discover</a>
          <a href="#">services</a>
          <a href="#">Как купить или продать</a>
        </nav>
        <div className={styles.right}>
          <div className={styles.rigt_part}>
            {!isAuthenticated ? (
              <button
                className={styles.authButton}
                onClick={() => openModal("login")}
              >
                <img src="/login.svg" alt="auth" />
                <span>Авторизация</span>
              </button>
            ) : (
              <button className={styles.authButton} onClick={logout}>
                <img src="/login.svg" alt="logout" />
                <span>Выйти</span>
              </button>
            )}

            <img src="/lupa.svg" alt="Поиск" className={styles.icon} />
            <img src="/star.svg" alt="Избранное" className={styles.iconStar} />
          </div>
          <img src="/Bag.svg" alt="Корзина" className={styles.iconBasket} />
          <img
            src="/Burger.svg"
            alt="Избранное"
            className={styles.iconBurger}
          />
        </div>
        <SearchInput
          value={""}
          onChange={function (e: ChangeEvent<HTMLInputElement>): void {
            throw new Error("Function not implemented.");
          }}
        />
      </header>
    </>
  );
};

export default Header;
