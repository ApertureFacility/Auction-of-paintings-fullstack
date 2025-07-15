"use client";
import React, { ChangeEvent } from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  label: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  variant?: "square" | "round";
  checked?: boolean;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  onChange,
  variant = "square",
  checked,
  disabled = false,
}) => {
  return (
    <label
      className={`${styles.checkboxContainer} ${
        disabled ? styles.disabled : ""
      }`}
    >
      <input
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        className={styles.hiddenInput}
      />
      <span className={`${styles.customCheckbox} ${styles[variant]}`}>
        {variant === "round" && (
          <span
            className={`${styles.roundCheckmark} ${
              checked ? styles.visible : ""
            }`}
          />
        )}
      </span>
      <span className={styles.labelText}>{label}</span>
    </label>
  );
};

export default Checkbox;
