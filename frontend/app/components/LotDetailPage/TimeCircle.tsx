import React from "react";
import styles from "./LotDetailPageSingleCard.module.css"

interface TimerCircleProps {
  timerPercent: number;
  currentPrice: number;
  formatPrice: (price: number) => string;
}

const TimerCircle: React.FC<TimerCircleProps> = ({ timerPercent, currentPrice, formatPrice }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      className={styles.timerCircle}
      width="100"
      height="100"
      viewBox="0 0 60 60"
    >
      <circle
        cx="30"
        cy="30"
        r={radius}
        stroke="#ddd"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="30"
        cy="30"
        r={radius}
        stroke="#4caf50"
        strokeWidth="4"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={(1 - timerPercent / 100) * circumference}
        style={{ transition: "stroke-dashoffset 50ms linear" }}
      />
      <text
        x="30"
        y="34"
        textAnchor="middle"
        fontSize="6"
        fill="#333"
        fontWeight="bold"
      >
        {formatPrice(currentPrice)} ₽
      </text>
    </svg>
  );
};

export default TimerCircle;
