import { ButtonHTMLAttributes, CSSProperties, DetailedHTMLProps } from 'react';
import styles from './ButtonShort.module.css';

interface ButtonShortProps {
  label?: string;
  buttonStyle?: CSSProperties;
}

export function ButtonShort({label, buttonStyle, ...props} : ButtonShortProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return <button className={styles.short_button} style={buttonStyle} {...props}>{label}</button>
}