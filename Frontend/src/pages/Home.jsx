import { Link } from "react-router-dom";
import "./styles/Home.css";
import quadradoHome from "../assets/quadradoHome.png";

export default function Home() {
  return (
    <>
    <section className="siteTodo">

      {/* Bloco para ir para a página de Login */}
      <section className="blocosNavbarHome"> 
        <Link className="blocoLoginNavbarHome" to="/login"> Login </Link>
      </section>

      <section className="blocoPrincipalHome">
        <section>
          <h1 className="tituloHome">
            TEACHER <br /> UP & <br /> ASSISTENT
          </h1>
        </section>

        <section className="blocoTexto">
          <img className="quadradoHome" src={quadradoHome} alt="Enfeite" />
          <p className="textoHome">
            Nós somos uma página para <br /> ajudar você em seus <br />
            planejamentos de aulas.
          </p>
        </section>
      </section>

      {/* Sequencia de blocos azuis */}
      <section className="blocosHome">
        <span className="home-shape blocoAzulHome"></span>
        <span className="home-shape blocoAzulHome"></span>
        <span className="home-shape blocoAzulHome"></span>
        <span className="home-shape blocoAzulHome"></span>
        <span className="home-shape blocoAzulHome"></span>
        <span className="home-shape blocoAzulHome"></span>
        <span className="home-shape blocoAzulHome"></span>
        <span className="home-shape blocoAzulHome"></span>
        <span className="home-shape blocoAzulHome"></span>
    </section>
    
</section>
    </>
  )
}