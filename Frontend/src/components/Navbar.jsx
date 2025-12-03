import { Link } from "react-router-dom";
import "../components/styles/Navbar.css"

export default function Navbar() {
  return (
    <>
      <nav className="navbar">
        <Link className="blocoLoginNavbar" to="/home"> Home </Link>
        <Link className="blocoSobreNavbar" to="/sobre"> Sobre </Link>
      </nav>
    </>
  );
}