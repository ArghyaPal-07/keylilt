import { NavLink } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import Brand from "../Brand";
export default function Header() {
  const { user } = useAuth();
  return <header className="site-header"><Brand /><nav aria-label="Main navigation"><NavLink to="/" end>Practice</NavLink><NavLink to="/leaderboard">Leaderboard</NavLink><NavLink to="/about">About</NavLink><NavLink to={user ? "/settings" : "/login"}>{user ? "Account" : "Log in"}</NavLink></nav></header>;
}