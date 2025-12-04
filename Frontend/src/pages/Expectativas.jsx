import React, { useState, useEffect } from "react";
import "./styles/Expectativas.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Recebe um objeto `expectativa` e renderiza seus campos.
const CartaoExpectativa = ({ expectativa }) => (
  <section className="item-expectativa">
    <h4>
      <span className="codigo-bncc">{expectativa.codigo || "N/A"}</span>
      <span className="area-pratica"> - {expectativa.praticas || "Prática Indefinida"}</span>
    </h4>
    <p className="texto-habilidade">
      <strong>Habilidade:</strong> {expectativa.habilidades || "Sem descrição de habilidade."}
    </p>
    <p className="texto-objetivo">
      <strong>Objetivos:</strong> {Array.isArray(expectativa.objetivos) ? expectativa.objetivos.join(", ") : expectativa.objetivos || "N/A"}
    </p>
  </section>
);

// Componente de página: Expectativas
// Gerencia seleção de série, chama a API e renderiza os cartões.
export default function Expectativas() {

  // iniciar sem série selecionada para obrigar escolha do usuário
  const [serie, setSerie] = useState("");
  const [expectativasDaSerie, setExpectativasDaSerie] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Lista de séries/anos disponíveis para seleção.
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
    // Quando a série mudar, buscamos as expectativas correspondentes
    // via API generativa (Gemini). O fluxo é:
    // 1) Montar um prompt claro apontando para o PDF da BNCC
    // 2) Pedir que o modelo retorne SOMENTE um JSON (array de objetos)
    // 3) Extrair o primeiro bloco JSON recebido e tentar fazer JSON.parse
    // 4) Em caso de erro, registrar a mensagem em `apiError` para exibir ao usuário
    const fetchExpectativas = async (serieSelecionada) => {
      setLoadingApi(true);
      setApiError(null);
      setExpectativasDaSerie([]);

      const API_KEY = "AIzaSyCU8AHdMCQH0v6qV7CO0bMAL_M2WowH4wY";
      const MODEL = "gemini-2.5-flash";

      // Prompt: instruções claras para o modelo. IMPORTANTE: pedimos
      // explicitamente que retorne apenas um JSON válido. O link da
      // BNCC está incluído para referência.
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

        // Estratégia de parsing:
        // O modelo às vezes inclui texto explicativo antes ou depois do JSON.
        // Aqui tentamos localizar o primeiro bloco que pareça um array JSON
        // (inicia com '[' e termina com ']') e parseá-lo.
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
            console.error('Erro ao parsear JSON da resposta da IA:', err);
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
    <section className="container-pagina-expectativas">
      <Navbar />

      {/* Formas decorativas (floats atrás do conteúdo) */}
      <section className="forma-decorativa forma-circulo forma-amarela-topo" />
      <section className="forma-decorativa forma-circulo forma-azul-topo-direito" />
      <section className="forma-decorativa forma-verde-meio" />
      <section className="forma-decorativa forma-circulo forma-vermelha-pequena-meio" />
      <section className="forma-decorativa forma-circulo forma-amarela-grande-inferior" />

      <section className="conteudo-pagina-expectativas">
        <section className="cabecalho-expectativas">
          <h1 className="titulo-principal-expectativas">Veja a lista de<br/>expectativas</h1>
        </section>

        {/* Seletor de série/ano */}
        <section className="seletor-serie-expectativas">
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

        {/* Área principal onde os cartões aparecem */}
        <section className="area-cartoes-expectativas">
          <h2 className="titulo-cartao-expectativas">Expectativas - {serie || "(nenhuma selecionada)"}</h2>

          {serie === "" ? (
            <section className="area-vazia-expectativas">
              <section className="icone-placeholder-expectativas">
                <i className="fa-solid fa-hand-point-up" aria-hidden="true"></i>
              </section>
              <p className="texto-vazio-negrito-expectativas">Selecione uma Série / Ano acima para ver as expectativas.</p>
              <span className="texto-vazio-pequeno-expectativas">Escolha a Série e a lista aparecerá aqui.</span>
            </section>
          ) : loadingApi ? (
            <section className="area-vazia-expectativas">
              <section className="icone-placeholder-expectativas">
                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
              </section>
              <p className="texto-vazio-negrito-expectativas">Buscando expectativas para {serie}...</p>
              <span className="texto-vazio-pequeno-expectativas">Aguarde enquanto consultamos a fonte BNCC.</span>
            </section>
          ) : apiError ? (
            <section className="area-vazia-expectativas">
              <section className="icone-placeholder-expectativas">
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              </section>
              <p className="texto-vazio-negrito-expectativas">Erro: {apiError}</p>
              <span className="texto-vazio-pequeno-expectativas">Tente novamente ou verifique sua conexão/API.</span>
            </section>
          ) : expectativasDaSerie.length === 0 ? (
            <section className="area-vazia-expectativas">
              <section className="icone-placeholder-expectativas">
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
              </section>
              <p className="texto-vazio-negrito-expectativas">Não há expectativas cadastradas para o {serie}.</p>
              <span className="texto-vazio-pequeno-expectativas">Verifique o arquivo de dados ou selecione outra série.</span>
            </section>
          ) : (
            <section className="lista-expectativas">
              {expectativasDaSerie.map((exp, idx) => (
                <CartaoExpectativa key={idx} expectativa={exp} />
              ))}
            </section>
          )}
        </section>

        <Footer />
      </section>
    </section>
  );
}
