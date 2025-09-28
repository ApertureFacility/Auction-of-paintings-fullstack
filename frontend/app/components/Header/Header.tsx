"use client";
import styles from "./Header.module.css";
import SearchInput from "../Search/Search";
import { ChangeEvent, useState, useEffect } from "react";
import { useModalStore } from "../../lib/modalStore";
import { useAuthStore } from "../../lib/authStore";
import Link from "next/link";

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const openModal = useModalStore((state) => state.open);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const toggleProfileMenu = () => setIsProfileMenuOpen((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        AUCTION.COM
      </Link>

      <nav className={styles.nav}>
        <Link href="/news">Новости</Link>
        <Link href="/about">О нас</Link>
        <Link href="/contacts">Контакты</Link>
        <Link href="/products">Наши услуги</Link>
        <Link href="/delivery">Как купить или продать</Link>
      </nav>

      <div className={styles.right}>
        <div className={styles.rigt_part}>
          {!isAuthenticated ? (
            <button
              className={styles.authButton}
              onClick={() => openModal("login")}
            >
              <img src="/login.svg" alt="auth" />
              <span>Вход</span>
            </button>
          ) : (
            <button className={styles.authButton} onClick={logout}>
              <img src="/login.svg" alt="logout" />
              <span>Выйти</span>
            </button>
          )}
          <img src="/star.svg" alt="Избранное" className={styles.iconStar} />
        </div>

        <div className={styles.profileWrapper}>
          {isAuthenticated && (
            <>
              <div className={styles.authButton} onClick={toggleProfileMenu}>
                <img
                  src="/userSquare.svg"
                  alt="Профиль"
                  className={styles.iconBasket}
                />
                <span>Профиль</span>
              </div>
              {isProfileMenuOpen && (
                <div className={styles.profileDropdown}>
                  <Link href="/profile/personal">
                    <button
                      className={styles.profileMenuButton}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <img src="/ProfileInfo.svg" alt="Данные" />
                      <span>Персональные данные</span>
                    </button>
                  </Link>

                  <Link href="/profile/favorites">
                    <button
                      className={styles.profileMenuButton}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <img src="/star.svg" alt="Избранное" />
                      <span>Избранные лоты</span>
                    </button>
                  </Link>

                  <Link href="/profile/purchases">
                    <button
                      className={styles.profileMenuButton}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <img src="/shop.svg" alt="Покупки" />
                      <span>История покупок</span>
                    </button>
                  </Link>
                </div>
              )}
            </>
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
  );
};

export default Header;
