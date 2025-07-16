import React, { ChangeEvent } from "react";
import styles from "./Inputs.module.css";

interface InputProps {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  type?: "text" | "password" | "email" | "tel";
  variant?: "default" | "blackBorder";
}

const Input: React.FC<InputProps> = ({
  value = "",
  onChange,
  placeholder = "",
  label = "",
  disabled = false,
  type = "text",
  variant = "default",
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <div
        className={`${styles.inputContainer} ${
          variant === "blackBorder" ? styles.blackBorder : ""
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.inputField} ${disabled ? styles.disabled : ""}`}
        />
      </div>
    </div>
  );
};

export default Input;
