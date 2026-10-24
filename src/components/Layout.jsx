import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
export default function Layout() {
  const { pathname } = useLocation();
  const focused = ["/results", "/code"].includes(pathname);
  return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to content</a>{!focused && <Header />}<main id="main-content" className={focused ? "focused-main" : "site-main"}><Outlet /></main>{!focused && <Footer />}</div>;
}