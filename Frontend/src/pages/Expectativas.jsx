import React, { useState } from "react";
import "./styles/Expectativas.css";

export default function Expectativas() {
  const [serie, setSerie] = useState("");

  return (
    <div className="page-container">

      {/* SHAPES DECORATIVAS */}
      <div className="shape circle yellow"></div>
      <div className="shape circle blue"></div>
      <div className="shape square green"></div>
      <div className="shape circle small-red"></div>

      {/* HEADER */}
        <h1 className="title">
          Veja a lista de <br /> expectativas
        </h1>

      {/* SEÇÃO DE SELEÇÃO */}
      <section className="selector-section">
        <label>Selecione a série/ano: </label>
        <br/>
        <br/>
        <select
          value={serie}
          onChange={(e) => setSerie(e.target.value)}
        >
          <option value="">Selecione</option>
          <option>6º Ano</option>
          <option>1º Ano EM</option>
          <option>2º Ano EM</option>
          <option>3º Ano EM</option>
        </select>
      </section>

      {/* CARD DE EXPECTATIVAS */}
      <section className="card">
        <h2>Expectativas</h2>

        {serie === "" ? (
          <div className="empty-area">
            <div className="icon-placeholder">✨</div>
            <p>Suas expectativas apareceram aqui</p>
            <span>Selecione a série</span>
          </div>
        ) : (
          <div className="list">
            <p>✔ Expectativas da série selecionada</p>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <img className="footer-icon" src="https://i.imgur.com/4AiXzf8.png" alt="icone" />
        <p>Grupo 3<br />Todos os Direitos Reservados</p>
        <span>2025</span>
      </footer>
    </div>
  );
}
