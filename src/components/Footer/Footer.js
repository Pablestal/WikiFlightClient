import React from "react";
import s from "./Footer.css";
import { Link } from "react-router-dom";

const FooterPage = () => {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <span className={s.text}>© Your Company</span>
        <span className={s.spacer}>·</span>
        <Link to="/">Home</Link>
        <span className={s.spacer}>·</span>
        <Link to="/about">About</Link>
        <span className={s.spacer}>·</span>
        <Link to="/privacy">Privacy</Link>
        <span className={s.spacer}>·</span>
        <Link to="/not-found">Not Found</Link>
      </div>
    </div>
  );
};

export default FooterPage;
