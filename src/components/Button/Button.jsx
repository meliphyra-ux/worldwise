import styles from './Button.module.css';

const Button = ({ children, onClick, type, ...otherProps }) => {
  return (
    <button
      className={`${styles.btn} ${styles[type]}`}
      onClick={onClick}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
