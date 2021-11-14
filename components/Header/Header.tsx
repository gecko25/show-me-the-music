import type { NextPage } from "next";
import Image from "next/image";

import styles from "./Header.module.scss";

const Header: NextPage = () => {
  return <header className={styles.header}></header>;
};

export default Header;
