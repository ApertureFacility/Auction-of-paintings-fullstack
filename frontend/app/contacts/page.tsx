'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Page.module.css'
import Button from '../components/Button/Button'

export default function Page() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Отправка формы контакта', form)
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={styles.page}
    >
      <div className={styles.container}>
        <section className={styles.contactSection}>
          <div>
            <h1 className={styles.title}>Контакты</h1>
            <p className={styles.subtitle}>
              Напишите нам — мы ответим в ближайшее время.
            </p>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <h3>Адрес</h3>
              <p>Minsk, Belarus</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Телефон</h3>
              <p>+375 29 1234567</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Email</h3>
              <p>hello@yourproject.dev</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Часы</h3>
              <p>Пн–Пт 09:00–18:00 (GMT+3)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ваше имя"
              className={styles.input}
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className={styles.input}
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Сообщение"
              className={styles.textarea}
            />

            <div className={styles.actions}>
              <Button variant='secondary'>Отправить</Button>
              {sent && (
                <span className={styles.success}>Спасибо! Сообщение отправлено.</span>
              )}
            </div>
          </form>
        </section>

        <section className={styles.mapSection}>
          <div className={styles.mapContainer}>
            <div className={styles.mapWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d34426.20625645918!2d27.55500185224664!3d53.90366460340134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sru!2sde!4v1757741915178!5m2!1sru!2sde"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={styles.mapIframe}
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  )
}