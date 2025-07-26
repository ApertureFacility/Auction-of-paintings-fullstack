"use client"

import styles from "./Header.module.css"
import SearchInput from "../Search/Search"
import { ChangeEvent } from "react"
import { useModalStore } from "../../lib/modalStore"
import Link from "next/link"

const Header = () => {
  const openModal = useModalStore((state) => state.open)

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
          <button
            className={styles.authButton}
            onClick={() => openModal("login")}
          >
            <img src="/login.svg" alt="auth" />
            <span>Авторизация</span>
          </button>
          <img src="/lupa.svg" alt="Поиск" className={styles.icon} />
          <img src="/star.svg" alt="Избранное" className={styles.iconStar} />
        </div>
        <img src="/Bag.svg" alt="Корзина" className={styles.iconBasket} />
        <img src="/Burger.svg" alt="Избранное" className={styles.iconBurger} />
      </div>
      <SearchInput
        value={""}
        onChange={function (e: ChangeEvent<HTMLInputElement>): void {
          throw new Error("Function not implemented.")
        }}
      />
    </header>
    <span className={styles.headerText}>Тайна затерянных сокровищ самого известного императора ацтеков — Монтесумы</span>
    <img
    src="/HeaderPic2.png"
    alt="Header Background"
    className={styles.headerImage}
  />
  </>
  )
}

export default Header
