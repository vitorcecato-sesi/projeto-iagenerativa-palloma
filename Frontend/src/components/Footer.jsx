import "./styles/Footer.css";

export default function Footer() {
  return (
    <footer className="simple-footer">
      <section className="logo-placeholder">
        <img src="/logoGrupo3.png" alt="Logo Grupo 3" />
      </section>
      <section className="rights">
        <strong>Grupo 3</strong>
        <br />
        Todos os Direitos Reservados
      </section>
      <section className="year">2025</section>
    </footer>
  );
}