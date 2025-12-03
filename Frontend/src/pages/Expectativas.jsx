import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Expectativas.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// IMPORTAÇÃO DOS DADOS REAIS
import { 
    expectativas6,
    expectativas7,
    expectativas8,
    expectativas9,
    expectativas1EM,
    expectativas2EM,
    expectativas3EM,
} from '../dadosExpectativas'; 

// Mapeamento local dos dados importados para a seleção
const dadosExpectativasMap = {
    "6º Ano": expectativas6 || [],
    "7º Ano": expectativas7 || [],
    "8º Ano": expectativas8 || [],
    "9º Ano": expectativas9 || [],
    "1º Ano EM": expectativas1EM || [],
    "2º Ano EM": expectativas2EM || [],
    "3º Ano EM": expectativas3EM || [],
};

// Componente para exibir o card de uma única expectativa
const ExpectativaCard = ({ expectativa }) => (
    <div className="expectativa-item-expectativas">
        <h4>
            <span className="codigo-bncc-expectativas">
                {expectativa.codigo || "N/A"}
            </span>
            <span className="pratica-area-expectativas">
                - {expectativa.praticas || "Prática Indefinida"}
            </span>
        </h4>
        <p className="habilidade-text-expectativas">
            <strong>Habilidade:</strong> {expectativa.habilidades || "Sem descrição de habilidade."}
        </p>
        <p className="objetivo-text-expectativas">
            <strong>Objetivos:</strong> {Array.isArray(expectativa.objetivos) ? expectativa.objetivos.join(', ') : expectativa.objetivos || 'N/A'}
        </p>
    </div>
);

export default function Expectativas() {
  const navigate = useNavigate();
  const [serie, setSerie] = useState("6º Ano"); // Pré-seleciona 6º Ano
  
  // Acessa os dados importados baseado na série selecionada
  const expectativasDaSerie = dadosExpectativasMap[serie] || []; 
  
  const seriesDisponiveis = Object.keys(dadosExpectativasMap);

  // Debug: logue os dados carregados
  React.useEffect(() => {
    console.log("Série selecionada:", serie);
    console.log("Expectativas carregadas:", expectativasDaSerie);
  }, [serie, expectativasDaSerie]);

  return (
    <div className="page-container-expectativas">
      {/* NAVBAR */}
      <Navbar />

      {/* SHAPES DECORATIVAS */}
      <div className="shape-expectativas circle-expectativas yellow-top-expectativas"></div>
      <div className="shape-expectativas circle-expectativas blue-top-right-expectativas"></div>
      <div className="shape-expectativas square-expectativas green-middle-expectativas"></div>
      <div className="shape-expectativas circle-expectativas small-red-middle-expectativas"></div>
      <div className="shape-expectativas circle-expectativas large-yellow-bottom-expectativas"></div>

      {/* Wrapper para conteúdo (Centraliza e limita largura) */}
      <div className="content-wrapper-expectativas">

          {/* HEADER */}
          <div className="expectativas-header-expectativas">
              <h1 className="hero-title-expectativas">
                  Veja a lista de <br /> expectativas
              </h1>
          </div>

          {/* SEÇÃO DE SELEÇÃO */}
          <section className="selector-section-expectativas">
              <label htmlFor="select-serie-expectativas">Selecione a série/ano: </label>
              <select
                  id="select-serie"
                  value={serie}
                  onChange={(e) => setSerie(e.target.value)}
              >
                  {seriesDisponiveis.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
          </section>

          {/* CARD DE EXPECTATIVAS */}
          <section className="expectativas-card-wrapper-expectativas">
              <h2 className="card-title-expectativas">Expectativas - {serie}</h2>

              {!expectativasDaSerie || expectativasDaSerie.length === 0 ? (
                  // Estado Vazio (ou série sem dados)
                  <div className="empty-area-expectativas">
                      <div className="icon-placeholder-expectativas">
                         <i className="fa-solid fa-wand-magic-sparkles"></i>
                      </div>
                      <p className="empty-text-bold-expectativas">
                          Não há expectativas cadastradas para o {serie}.
                      </p>
                      <span className="empty-text-small-expectativas">
                          Verifique o arquivo de dados ou selecione outra série.
                      </span>
                  </div>
              ) : (
                  // Lista de Expectativas (Dados carregados)
                  <div className="expectativas-list-expectativas">
                      {expectativasDaSerie.map((exp, index) => (
                          <ExpectativaCard key={index} expectativa={exp} />
                      ))}
                  </div>
              )}
          </section>

          {/* Botão Voltar */}
          <button className="voltar-btn-expectativas" onClick={() => navigate("/assistente")}>
              ← Voltar ao Assistente
          </button>

          {/* FOOTER */}
          <Footer />
      </div>
    </div>
  );
}