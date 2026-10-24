import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TypingBox from "./components/TypingBox";
import Landing from "./components/Landing";
import Layout from "./components/Layout";
import About from "./components/About";
import Leaderboard from "./components/Leaderboard";
import Results from "./components/Results";
import PrivateRoutes from "./utils/PrivateRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./utils/AuthContext";
import NotFound from "./components/NotFound";
import Setting from "./utils/Settings/Setting";
import CodeType from "./components/CodeType";
export default function App() {
  return <Router><AuthProvider><Routes><Route path="/" element={<Layout />}>
    <Route index element={<Landing />} />
    <Route path="typing" element={<TypingBox />} />
    <Route path="results" element={<Results />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="about" element={<About />} />
    <Route path="layout" element={<Layout />} />
    <Route path="code" element={<CodeType />} />
    <Route element={<PrivateRoutes />}><Route path="settings" element={<Setting />} /></Route>
    <Route path="leaderboard" element={<Leaderboard />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes></AuthProvider></Router>;
}
