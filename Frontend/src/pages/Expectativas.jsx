// ...existing code...
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Expectativas.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import { 
    expectativas6,
    expectativas7,
    expectativas8,
    expectativas9,
    expectativas1EM,
    expectativas2EM,
    expectativas3EM,
} from "../dadosExpectativas";

// Mapeamento local dos dados importados para a seleção
const dadosExpectativasMap = {
    "6º ano": expectativas6 || [],
    "7º ano": expectativas7 || [],
    "8º ano": expectativas8 || [],
    "9º ano": expectativas9 || [],
    "1º ano Ensino Médio": expectativas1EM || [],
    "2º ano Ensino Médio": expectativas2EM || [],
    "3º ano Ensino Médio": expectativas3EM || [],
};

// Card de expectativa
const ExpectativaCard = ({ expectativa }) => (
  <section className="expectativa-item-expectativas">
    <h4>
      <span className="codigo-bncc-expectativas">{expectativa.codigo || "N/A"}</span>
      <span className="pratica-area-expectativas"> - {expectativa.praticas || "Prática Indefinida"}</span>
    </h4>
    <p className="habilidade-text-expectativas">
      <strong>Habilidade:</strong> {expectativa.habilidades || "Sem descrição de habilidade."}
    </p>
    <p className="objetivo-text-expectativas">
      <strong>Objetivos:</strong> {Array.isArray(expectativa.objetivos) ? expectativa.objetivos.join(", ") : expectativa.objetivos || "N/A"}
    </p>
  </section>
);

export default function Expectativas() {
  const navigate = useNavigate();

  // iniciar sem série selecionada para obrigar escolha do usuário
  const [serie, setSerie] = useState("");
  const seriesDisponiveis = Object.keys(dadosExpectativasMap);
  const expectativasDaSerie = serie ? (dadosExpectativasMap[serie] || []) : [];

  useEffect(() => {
    console.log("Série selecionada:", serie);
    console.log("Expectativas carregadas:", expectativasDaSerie);
  }, [serie, expectativasDaSerie]);

  return (
    <section className="page-container-expectativas">
      <Navbar />

      {/* Shapes decorativas */}
      <section className="shape-expectativas circle-expectativas yellow-top-expectativas" />
      <section className="shape-expectativas circle-expectativas blue-top-right-expectativas" />
      <section className="shape-expectativas green-middle-expectativas" />
      <section className="shape-expectativas circle-expectativas small-red-middle-expectativas" />
      <section className="shape-expectativas circle-expectativas large-yellow-bottom-expectativas" />

      <section className="content-wrapper-expectativas">
        <section className="expectativas-header-expectativas">
          <h1 className="hero-title-expectativas">Veja a lista de<br/>expectativas</h1>
        </section>

        <section className="selector-section-expectativas">
          <label htmlFor="select-serie-expectativas">Selecione a Série / Ano:</label>
          <br />
          <select
            id="select-serie-expectativas"
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
          >
            <option value=""> Selecione</option>
            {seriesDisponiveis.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </section>

        <section className="expectativas-card-wrapper-expectativas">
          <h2 className="card-title-expectativas">Expectativas - {serie || "(nenhuma selecionada)"}</h2>

          {serie === "" ? (
            <section className="empty-area-expectativas">
              <section className="icon-placeholder-expectativas">
                <i className="fa-solid fa-hand-point-up" aria-hidden="true"></i>
              </section>
              <p className="empty-text-bold-expectativas">Selecione uma Série / Ano acima para ver as expectativas.</p>
              <span className="empty-text-small-expectativas">Escolha a Série e a lista aparecerá aqui.</span>
            </section>
          ) : expectativasDaSerie.length === 0 ? (
            <section className="empty-area-expectativas">
              <section className="icon-placeholder-expectativas">
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
              </section>
              <p className="empty-text-bold-expectativas">Não há expectativas cadastradas para o {serie}.</p>
              <span className="empty-text-small-expectativas">Verifique o arquivo de dados ou selecione outra série.</span>
            </section>
          ) : (
            <section className="expectativas-list-expectativas">
              {expectativasDaSerie.map((exp, idx) => (
                <ExpectativaCard key={idx} expectativa={exp} />
              ))}
            </section>
          )}
        </section>

        <Footer />
      </section>
    </section>
  );
}
