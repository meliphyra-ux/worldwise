import styles from './Button.module.css';

type ButtonProps = React.ComponentProps<'button'> & {
  variant: 'primary' | 'back' | 'position';
};

const Button = ({
  children,
  onClick,
  variant,
  ...buttonProps
}: ButtonProps) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
