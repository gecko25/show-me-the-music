/* Styles */
import styles from "./icons.module.scss";

const ArrowLeftCircle = () => (
  <svg
    className={styles.ArrowLeftCircle}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 8 8 12 12 16" />
    <line x1="16" y1="12" x2="8" y2="12" />
  </svg>
);

export default ArrowLeftCircle;
