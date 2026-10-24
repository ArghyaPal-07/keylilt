import { Link } from "react-router-dom";
export default function Footer() {
  return <footer className="site-footer"><span>Find your rhythm.</span><div><Link to="/about">About</Link><a href="https://github.com/ArghyaPal-07/keylilt">Source on GitHub ↗</a><span>Keylilt © {new Date().getFullYear()}</span></div></footer>;
}