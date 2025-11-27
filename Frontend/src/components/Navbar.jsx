import { Link } from "react-router-dom";
import "../components/styles/Navbar.css"

export default function Navbar() {
  return (
    <>
      <nav className="navbar">
        <Link className="blocoLoginNavbar" to="/Login"> Login </Link>
        <Link className="blocoSobreNavbar" to="/Sobre"> Sobre </Link>
      </nav>
    </>
  );
}