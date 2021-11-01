import type { NextPage } from "next";
import Link from "next/link";

import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";

import styles from "./Header.module.scss";

const Header: NextPage = () => {
  return (
    <header className={styles.header}>
      Header
    </header>
  );
};

export default Header;
