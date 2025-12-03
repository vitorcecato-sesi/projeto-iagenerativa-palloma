// ...existing code...
import "./styles/Home.css";
import quadradoHome from "../assets/quadradoHome.png";

export default function Home() {
  return (
    <>
    <section className="siteTodo">
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
  );
}