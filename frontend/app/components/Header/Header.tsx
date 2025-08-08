"use client";

import styles from "./Header.module.css";
import SearchInput from "../Search/Search";
import { ChangeEvent, useState } from "react";
import { useModalStore } from "../../lib/modalStore";
import Link from "next/link";
import { useAuth } from "../hooks/Auth";

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const openModal = useModalStore((state) => state.open);
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

          <div className={styles.profileWrapper}>
            <img
              src="/userSquare.svg"
              alt="Профиль"
              className={styles.iconBasket}
              onClick={toggleProfileMenu}
            />
            {isProfileMenuOpen && isAuthenticated && (
              <div className={styles.profileDropdown}>
                <button
                  className={styles.profileMenuButton}
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <img src="/ProfileInfo.svg" alt="Данные" />
                  <span>Персональные данные</span>
                </button>

                <Link
                  href="/profile/favorites"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <button className={styles.profileMenuButton}>
                    <img src="/star.svg" alt="Избранное" />
                    <span>Избранные лоты</span>
                  </button>
                </Link>

                <button
                  className={styles.profileMenuButton}
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <img src="/shop.svg" alt="Покупки" />
                  <span>История покупок</span>
                </button>
              </div>
            )}

            <img
              src="/Burger.svg"
              alt="Меню"
              className={styles.iconBurger}
              onClick={toggleMenu}
            />
          </div>
        </div>
        <SearchInput
          value={""}
          onChange={function (e: ChangeEvent<HTMLInputElement>): void {
            throw new Error("Function not implemented.");
          }}
        />

        {/* Бургер-меню */}
        {isMenuOpen && (
          <div className={styles.burgerMenu}>
            <a href="#">preferred access</a>
            <a href="#">about</a>
            <a href="#">discover</a>
            <a href="#">services</a>
            <a href="#">Как купить или продать</a>
            {!isAuthenticated ? (
              <button
                className={styles.mobileAuthButton}
                onClick={() => {
                  openModal("login");
                  toggleMenu();
                }}
              >
                <img src="/login.svg" alt="auth" />
                <span>Авторизация</span>
              </button>
            ) : (
              <button
                className={styles.mobileAuthButton}
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
              >
                <img src="/login.svg" alt="logout" />
                <span>Выйти</span>
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
