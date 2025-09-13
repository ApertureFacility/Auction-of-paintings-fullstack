import React from 'react'
import styles from './Page.module.css'

function Page() {
  const benefits = [
    { id: 1, text: 'Рейтинг доходности русских художников.' },
    { id: 2, text: 'Индикаторы инвестиционного риска.' },
    { id: 3, text: 'Ценовые индексы художников.' },
    { id: 4, text: 'Данные, позволяющие самостоятельно оценивать произведения искусства.' },
  ]

  const plans = [
    { id: 1, period: 'день', price: '1 800 RUB' },
    { id: 2, period: 'месяц', price: '7 500 RUB' },
    { id: 3, period: '6 месяцев', price: '17 000 RUB' },
    { id: 4, period: '12 месяцев', price: '22 950 RUB' },
  ]

  const services = [
    {
      id: 1,
      title: 'Арт-консалтинг',
      desc: 'Индивидуальные консультации от опытных искусствоведов по любым вопросам в сфере искусства',
    },
    {
      id: 2,
      title: 'Составление Инвестиционного Портфеля',
      desc: 'Подбор предметов искусства для инвестирования под любую инвестиционную стратегию',
    },
    {
      id: 3,
      title: 'Индивидуальная оценка',
      desc: 'Наши эксперты проведут профессиональную оценку вашего предмета искусства, учитывая его состояние, авторство, историю и другие факторы',
    },
  ]

  const stats = [
    { id: 1, value: '500+', label: 'Проведенных аукционов' },
    { id: 2, value: '8 800+', label: 'Зарегистрированных пользователей на аукционе' },
    { id: 3, value: '343 000+', label: 'Записей в базе' },
    { id: 4, value: '16 000+', label: 'Художников в базе' },
  ]

  return (
    <div className={styles.wrapper}>

      <h2 className={styles.title}>ПРЕИМУЩЕСТВА БАЗЫ ARTInvestment</h2>
      <div className={styles.grid}>
        {benefits.map((item) => (
          <div key={item.id} className={styles.card}>
            <span className={styles.number}>{item.id}</span>
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </div>


      <div className={styles.plansWrapper}>
        {plans.map((plan) => (
          <div key={plan.id} className={styles.planCard}>
            <h2 className={styles.planNumber}>
              {plan.period.split(' ')[0]}
            </h2>
            <p className={styles.planPeriod}>{plan.period}</p>
            <hr className={styles.line} />
            <p className={styles.planDesc}>Безлимитный доступ</p>
            <p className={styles.planPrice}>{plan.price}</p>
            <button className={styles.planButton}>Оплатить</button>
          </div>
        ))}
      </div>


      <h2 className={styles.title}>| Услуги ARTinvestment |</h2>
      <div className={styles.servicesWrapper}>
        {services.map((service) => (
          <div key={service.id} className={styles.serviceCard}>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceDesc}>{service.desc}</p>
            <button className={styles.serviceButton}>Подробнее</button>
          </div>
        ))}
      </div>

      <div className={styles.statsWrapper}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.statCard}>
            <h2 className={styles.statValue}>{stat.value}</h2>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
