import "./styles/Home.css";
import quadradoHome from "../assets/quadradoHome.png";
import Navbar from "../components/Navbar"

export default function Home() {
  return (
    <>
    <Navbar/>

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

      <section className="blocosHome">
        <span className="forma blocoAzulHome"></span>
        <span className="forma blocoAzulHome"></span>
        <span className="forma blocoAzulHome"></span>
        <span className="forma blocoAzulHome"></span>
        <span className="forma blocoAzulHome"></span>
        <span className="forma blocoAzulHome"></span>
        <span className="forma blocoAzulHome"></span>
        <span className="forma blocoAzulHome"></span>
        <span className="forma blocoAzulHome"></span>
    </section>

    </>
  );
}
