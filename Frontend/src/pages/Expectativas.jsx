import React, { useState, useEffect } from "react";
import "./styles/Expectativas.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Agora as expectativas serão carregadas via API generativa (Gemini)

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

  // iniciar sem série selecionada para obrigar escolha do usuário
  const [serie, setSerie] = useState("");
  const [expectativasDaSerie, setExpectativasDaSerie] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiError, setApiError] = useState(null);

  const seriesDisponiveis = [
    "6º ano",
    "7º ano",
    "8º ano",
    "9º ano",
    "1º ano Ensino Médio",
    "2º ano Ensino Médio",
    "3º ano Ensino Médio",
  ];

  useEffect(() => {
    if (!serie) {
      setExpectativasDaSerie([]);
      return;
    }

    // quando a série mudar, buscar via API
    const fetchExpectativas = async (serieSelecionada) => {
      setLoadingApi(true);
      setApiError(null);
      setExpectativasDaSerie([]);

      const API_KEY = import.meta.env.VITE_GEMINI_KEY;
      const MODEL = "gemini-2.5-flash";

      const prompt = `Você é um assistente que extrai, a partir do documento da BNCC (link abaixo), as EXPECTATIVAS/objetivos de aprendizagem correspondentes à série informada. Retorne SOMENTE um JSON válido — um array de objetos — onde cada objeto possui as chaves: "codigo", "praticas", "habilidades", "objetivos" (objetivos pode ser um array de strings ou uma string). NÃO inclua texto adicional fora do JSON. Use o link como fonte:
https://www.alex.pro.br/BNCC%20L%C3%ADngua%20Portuguesa.pdf

Série solicitada: ${serieSelecionada}

Exemplo de saída esperada (JSON):
[
  {"codigo":"EF06LP01","praticas":"Leitura","habilidades":"Ler...","objetivos":["Identificar..."]},
  ...
]
`;

      try {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": API_KEY,
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        const data = await resp.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // tentar extrair JSON do texto retornado
        const match = raw.match(/(\[([\s\S]*)\])/);
        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            if (Array.isArray(parsed)) {
              setExpectativasDaSerie(parsed);
            } else {
              setApiError("Resposta não é um array JSON válido.");
            }
          } catch (err) {
            console.error(err);
            setApiError("Falha ao parsear JSON retornado pela API.");
          }
        } else {
          setApiError("Não foi possível extrair JSON válido da resposta da API.");
        }
      } catch (e) {
        console.error(e);
        setApiError("Erro de conexão com a API.");
      } finally {
        setLoadingApi(false);
      }
    };

    fetchExpectativas(serie);
  }, [serie]);

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
          ) : loadingApi ? (
            <section className="empty-area-expectativas">
              <section className="icon-placeholder-expectativas">
                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
              </section>
              <p className="empty-text-bold-expectativas">Buscando expectativas para {serie}...</p>
              <span className="empty-text-small-expectativas">Aguarde enquanto consultamos a fonte BNCC.</span>
            </section>
          ) : apiError ? (
            <section className="empty-area-expectativas">
              <section className="icon-placeholder-expectativas">
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              </section>
              <p className="empty-text-bold-expectativas">Erro: {apiError}</p>
              <span className="empty-text-small-expectativas">Tente novamente ou verifique sua conexão/API.</span>
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
