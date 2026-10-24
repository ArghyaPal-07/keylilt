import { Link } from "react-router-dom";
export default function Brand() {
  return <Link to="/" className="brand" aria-label="Keylilt home"><img src="/brand/icon.svg" width="28" height="28" alt="" /><span>keylilt</span></Link>;
}
