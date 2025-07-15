import React, { ChangeEvent } from "react";
import styles from "./Search.module.css";

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Для поиска по аукциону введите номер лота",
}) => {
  return (
    <div className={styles.searchWrapper}>
      <img src="/SearchLupa.svg" alt="Поиск" className={styles.icon} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
};

export default SearchInput;
