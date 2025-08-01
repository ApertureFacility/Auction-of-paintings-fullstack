"use client"

import React, { useState } from 'react'
import styles from "./FilterAccord.module.css";



function FilterAccord() {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <div> <button
    className={styles.accordion_toggle}
    onClick={() => setIsOpen(!isOpen)}
  ><h2 className={styles.filter__title}>Фильтрация</h2>
   
    <img
          src="/downIcon.svg"
          alt="Стрелка вниз"
          className={`${styles.filter__icon} ${isOpen ? styles.rotated : ''}`}
        /></button></div>
  )
}

export default FilterAccord