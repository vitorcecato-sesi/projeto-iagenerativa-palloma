import { useState, useRef } from "react"; 
// Importa hooks do React: useState para estados, useRef para referências a elementos DOM

import { Link } from "react-router-dom"; // Importa Link para navegação entre páginas no React Router.

import "./styles/AssistenteIA.css"; // Importa o arquivo CSS para estilizar a página.

import Navbar from "../components/Navbar.jsx"; // Importa o componente Navbar (barra de navegação).
import Footer from '../components/Footer.jsx'; // Importa o componente Footer (rodapé).

// Componente simples que renderiza um ícone de estrela (sparkle) usando SVG.
// É usado no botão de gerar plano para adicionar um visual atrativo.
const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962l6.135-1.582A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0l1.582 6.135a2 2 0 0 0 1.437 1.437l6.135 1.582a.5.5 0 0 1 0 .962l-6.135 1.582a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>
  </svg>
);

export default function AssistenteIA() {
  // Estados (useState) para armazenar os valores dos campos do formulário.
  // Cada estado controla uma parte do input do usuário.
  const [tema, setTema] = useState(""); // Tema da aula (ex: "Vocabulário").
  const [serie, setSerie] = useState(""); // Série ou ano escolar (ex: "6º ano").
  const [duracao, setDuracao] = useState(""); // Duração da aula (ex: "50 minutos").
  const [obs, setObs] = useState(""); // Observações adicionais (ex: contexto da turma).
  const [generatedContent, setGeneratedContent] = useState(null); // Conteúdo gerado pela IA (o plano de aula).
  const [loading, setLoading] = useState(false); // Estado para indicar se a geração está em andamento (mostra spinner).
  
  // useRef para criar uma referência ao elemento do resultado, permitindo rolar a página até lá após gerar o plano.
  const resultRef = useRef(null);

  // Constantes para a API do Gemini: chave da API (de variáveis de ambiente) e modelo usado.
  const API_KEY = import.meta.env.VITE_GEMINI_KEY; // Chave da API, armazenada em variáveis de ambiente para segurança.
  const MODEL = "gemini-2.5-flash"; // Modelo de IA usado para gerar o conteúdo.

  // Arrays de opções pré-definidas para os selects e chips de sugestão.
  // Facilita o preenchimento rápido pelo usuário.
  const sugestoes = [ // Sugestões de temas populares para aulas de Língua Portuguesa.
    "Vocabulário",
    "Figuras de Linguagem",
    "Redação ENEM",
    "Gêneros textuais",
    "Sinais de pontuação",
  ];

  const seriesFundamentalMedio = [ // Séries do Ensino Fundamental e Médio.
    "6º ano", "7º ano", "8º ano", "9º ano",
    "1º ano Ensino Médio", "2º ano Ensino Médio", "3º ano Ensino Médio",
  ];

  const duracoes = ["30 minutos","50 minutos (1 aula)", "1 hora e 40 minutos (2 aulas)", "2 horas"]; // Opções de duração da aula.

  // Função que constrói o prompt (instrução) enviado para a IA.
  // Passa via props os dados do formulário para personalizar o plano de aula.
  const buildPrompt = (tema, serie, duracao, obs) => `
    Atue como um Especialista Pedagógico em Língua Portuguesa com foco na BNCC (Base Nacional Comum Curricular).
    Sua tarefa é criar um **Plano de Aula de Excelência**, detalhado e pronto para aplicação imediata.

    DADOS DA AULA:
    - Tema: ${tema}
    - Público-Alvo: ${serie}
    - Tempo Disponível: ${duracao}
    - Contexto/Observações: ${obs || "Padrao"}

    ESTRUTURA OBRIGATÓRIA DA RESPOSTA (Siga estritamente esta ordem e formatação):

    ## 1. OBJETIVOS E BNCC
    * Liste de 2 a 4 Habilidades da BNCC (Código alfanumérico + descrição breve) pertinentes a este tema e série.
    * Defina 1 Objetivo Geral e 2 Objetivos Específicos claros.

    ## 2. ESTRATÉGIA E RECURSOS
    * Metodologia: Cite qual metodologia ativa será usada (Ex: Sala de Aula Invertida, Gamificação, Rotação por Estações, Aula Expositiva Dialogada).
    * Recursos Necessários: O que o professor precisa (datashow, folhas impressas, quadro, caixa de som, etc).

    ## 3. CRONOGRAMA DA AULA (Timeboxing)
    sectionida o tempo total (${duracao}) em três momentos, descrevendo a ação do professor e do aluno:
    * **Introdução/Acolhida (aprox. 15% do tempo):** Como despertar o interesse inicial?
    * **Desenvolvimento (aprox. 60% do tempo):** A explicação do conteúdo e a atividade principal.
    * **Conclusão/Fechamento (aprox. 25% do tempo):** Sistematização do conhecimento e verificação de aprendizagem.

    ## 4. SUGESTÕES CRIATIVAS
    * Forneça 3 ideias de dinâmicas ou abordagens diferenciadas para este tema (algo que fuja do tradicional "quadro e giz").

    ## 5. ATIVIDADE PRÁTICA (Exercícios)
    * Crie 3 a 5 questões ou propostas de exercícios práticos para fixação.
    * **Inclua o Gabarito/Respostas Esperadas** logo abaixo de cada questão.

    ## 6. AVALIAÇÃO E ADAPTAÇÃO
    * Como avaliar se os alunos aprenderam?
    * **Dica de Inclusão:** Uma sugestão rápida para adaptar esta aula para alunos com dificuldades de aprendizagem ou NEE (Necessidades Educativas Especiais).

    REGRAS DE FORMATAÇÃO (IMPORTANTE):
    - Use "## " para Títulos das seções.
    - Use "* " para listas.
    - Use "**" para destacar termos chave.
    - Não use tabelas Markdown (o sistema não renderiza). Use listas.
    - Linguagem: Profissional, acolhedora e direta.
  `;

  // Função assíncrona que gera o plano de aula chamando a API do Gemini.
  // Primeiro valida os campos obrigatórios, depois faz a requisição e processa a resposta.
  const gerarPlano = async () => {
    // Verifica se os campos obrigatórios estão preenchidos; se não, mostra um alerta.
    if (!tema || !serie || !duracao) {
      alert("Por favor, preencha os campos obrigatórios (*)");
      return;
    }

    // Define loading como true para mostrar o spinner e limpa o conteúdo anterior.
    setLoading(true);
    setGeneratedContent(null);

    // Constrói o prompt com os dados do usuário.
    const prompt = buildPrompt(tema, serie, duracao, obs);

    try {
      // Faz uma requisição POST para a API do Gemini com o prompt.
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Tipo de conteúdo da requisição.
            "x-goog-api-key": API_KEY, // Chave da API para autenticação.
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }], // Corpo da requisição com o prompt.
          }),
        }
      );

      // Converte a resposta em JSON.
      const data = await response.json();
      // Extrai o texto gerado pela IA da resposta.
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar conteúdo.";
      // Define o conteúdo gerado no estado.
      setGeneratedContent(reply);
      
      // Após um pequeno delay, rola a página suavemente até o resultado.
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);

    } catch (e) {
      // Se houver erro na requisição, define uma mensagem de erro.
      setGeneratedContent("Erro de conexão com a IA.");
    } finally {
      // Sempre define loading como false ao final.
      setLoading(false);
    }
  };

  // --- FORMATADORES DE TEXTO  ---
  
  // Função auxiliar que transforma texto entre ** (negrito) em elementos <strong> com cor específica.
  // Divide o texto e aplica negrito onde necessário.
  const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Divide o texto preservando as partes em negrito.
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Se for negrito, renderiza como <strong> com cor azul escuro.
        return <strong key={i} style={{ color: '#2c3e50' }}>{part.slice(2, -2)}</strong>;
      }
      return part; // Caso contrário, retorna o texto normal.
    });
  };

  // Função principal que converte o texto Markdown da IA em elementos HTML/React.
  // Processa linhas do texto, identificando títulos, listas e parágrafos, e os transforma em JSX.
  const renderResponse = (text) => {
    if (!text) return null; // Se não houver texto, retorna null.
    const lines = text.split('\n'); // Divide o texto em linhas.
    const elements = []; // Array para armazenar os elementos JSX.
    let listBuffer = []; // Buffer temporário para itens de lista.

    // Função auxiliar para "esvaziar" o buffer de listas, renderizando-as como <ul>.
    const flushList = () => {
      if (listBuffer.length > 0) {
        elements.push(<ul key={`list-${elements.length}`} className="ia-list">{[...listBuffer]}</ul>);
        listBuffer = [];
      }
    };

    // Processa cada linha do texto.
    lines.forEach((line, index) => {
      const trimmed = line.trim(); // Remove espaços em branco.
      if (!trimmed) return; // Ignora linhas vazias.

      // 1. Títulos: Linhas que começam com ## ou são todas maiúsculas e terminam com :.
      if (trimmed.startsWith('##') || (trimmed === trimmed.toUpperCase() && trimmed.endsWith(':'))) {
        flushList(); // Renderiza listas pendentes.
        const titleText = trimmed.replace(/^#+\s*/, '').replace(/\*/g, ''); // Limpa marcadores.
        elements.push(<h4 key={index} className="ia-subtitle">{titleText}</h4>); // Adiciona como <h4>.
      }
      // 2. Listas: Linhas que começam com * , - ou números.
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
        const itemText = trimmed.replace(/^[\*\-\d\.]+\s*/, ''); // Remove marcadores.
        listBuffer.push(<li key={`li-${index}`}>{parseBold(itemText)}</li>); // Adiciona ao buffer como <li>, aplicando negrito se necessário.
      }
      // 3. Parágrafos normais: Qualquer outra linha.
      else {
        flushList(); // Renderiza listas pendentes.
        elements.push(<p key={index} className="ia-paragraph">{parseBold(trimmed)}</p>); // Adiciona como <p>, aplicando negrito.
      }
    });

    flushList(); // Garante que a última lista seja renderizada.
    return elements; // Retorna o array de elementos JSX.
  };

  return (
    <section className="containerTotalPagina"> {/* Container principal da página. */}

      {/* Formas Geométricas: Elementos decorativos para o fundo. */}
      <section className="shape circle-blue-top-left"></section>
      <section className="shape circle-yellow-bottom-left"></section>
      <section className="shape circle-green-bottom-right"></section>
      <section className="shape rect-green-top"></section>
      <section className="shape circle-red-top"></section>
      <section className="shape circle-red-middle"></section>
      <section className="shape rect-blue-bottom-left"></section>

      <section className="content-wrapper"> {/* Wrapper para o conteúdo principal. */}

        {/* === IMPORTAÇÃO DO NOVO COMPONENTE NAVBAR === */}
        <Navbar />
        {/* ========================================= */}
        
        {/* Topo: Seção com título e botão para expectativas. */}
        <section className="top-section">
          <section className="hero-column">
            <h1 className="hero-title">
              Crie seu <br /> plano <br /> de aula <br /> agora {/* Título principal da página. */}
            </h1>
            <section className="expectations-btn-wrapper">
              <Link to="/expectativas" className="expectations-btn"> {/* Link para página de expectativas. */}
                    Ver expectativas de<br/>cada Série/Ano
                    <span className="icon-pointer">👆</span>
                </Link>
            </section>
          </section>

          {/* Formulário: Seção com campos para inserir dados da aula. */}
          <section className="form-section">
          <section className="form-card">
            <h2 className="form-title">Informações da Aula</h2> {/* Título do formulário. */}

            {/* Campo para tema, com sugestões em chips. */}
            <section className="input-group">
                <label>Tema da Aula *</label> {/* Rótulo obrigatório. */}
                <input 
                    type="text" 
                    placeholder="Ex: Interpretação de Texto" // Placeholder de exemplo.
                    value={tema} // Valor ligado ao estado.
                    onChange={(e) => setTema(e.target.value)} // Atualiza estado ao digitar.
                />
            </section>

            {/* Chips de sugestões: Botões para preencher o tema rapidamente. */}
            <section className="suggestions-chips">
                <span className="suggestion-label">Sugestão</span>
                <section className="chips-container">
                    {sugestoes.map((s, i) => ( // Mapeia cada sugestão em um botão.
                        <button key={i} className="chip" onClick={() => setTema(s)}>{s}</button> // Clicar define o tema.
                    ))}
                </section>
            </section>

            {/* Campos em linha: Série e Duração. */}
            <section className="row-inputs">
                <section className="input-group half">
                    <label>Série / Ano *</label>
                    <select value={serie} onChange={(e) => setSerie(e.target.value)}> {/* Select para série. */}
                        <option value="">Selecione</option> {/* Opção padrão. */}
                        {seriesFundamentalMedio.map((s, i) => <option key={i} value={s}>{s}</option>)} {/* Opções de séries. */}
                    </select>
                </section>
                <section className="input-group half">
                    <label>Duração *</label>
                    <select value={duracao} onChange={(e) => setDuracao(e.target.value)}> {/* Select para duração. */}
                        <option value="">Selecione</option>
                        {duracoes.map((d, i) => <option key={i} value={d}>{d}</option>)} {/* Opções de durações. */}
                    </select>
                </section>
            </section>

            {/* Campo para observações. */}
            <section className="input-group">
                <label>Observações</label>
                <textarea 
                    placeholder="Ex: Turma de 30 alunos, foco em atividades práticas, uso de recursos audiovisuais, alunos com dificuldades de leitura, alunos com deficiências..." // Placeholder com exemplos.
                    value={obs}
                    onChange={(e) => setObs(e.target.value)} // Atualiza estado ao digitar.
                />
            </section>

            {/* Botão para gerar o plano: Desabilitado durante loading, mostra ícone e texto. */}
            <button className="generate-btn" onClick={gerarPlano} disabled={loading}>
                {loading ? "Gerando..." : ( // Texto muda durante loading.
                    <>
                     <SparkleIcon /> Gerar Plano de Aula  {/* Ícone e texto normal. */}
                    </>
                )}
            </button>
          </section>
        </section>
        </section>

        {/* Resultado: Seção onde o plano gerado é exibido. */}
        <section className="result-section" ref={resultRef}> {/* Ref para rolagem: Permite que a página role suavemente até aqui após gerar o plano. */}
          <h3 className="result-title">Plano Gerado</h3> {/* Título da seção, indicando que o plano de aula aparecerá abaixo. */}
          
          <section className="result-paper"> {/* Container estilizado como um "papel" para o resultado, simulando uma folha de aula. */}
            {!generatedContent && !loading && ( /* Condicional: Verifica se não há conteúdo gerado E não está carregando. Se verdadeiro, mostra o estado vazio. */
                <section className="empty-state"> {/* Seção para quando nada foi gerado ainda. */}
                    <section className="empty-icon">✨</section> {/* Ícone decorativo (estrela) para tornar o estado vazio mais amigável. */}
                    <p className="empty-text-bold">Seu plano aparecerá aqui</p> {/* Texto em negrito incentivando o usuário a gerar o plano. */}
                    <p className="empty-text-small">Preencha as informações e clique em "Gerar"</p> {/* Texto menor com instruções simples. */}
                </section>
            )}

            {loading && ( /* Condicional: Se está carregando (loading é true), mostra o estado de carregamento. */
                <section className="loading-state"> {/* Seção para indicar que a geração está em andamento. */}
                    <section className="spinner"></section> {/* Elemento visual (provavelmente um CSS spinner) que gira para mostrar progresso. */}
                    <p>Criando seu plano mágico...</p> {/* Texto amigável para manter o usuário engajado durante a espera. */}
                </section>
            )}

            {generatedContent && ( /* Condicional: Se há conteúdo gerado (não é null), renderiza o plano. */
                <section className="ia-content"> {/* Container para o conteúdo da IA, estilizado para parecer um documento. */}
                    {renderResponse(generatedContent)} {/* Chama a função renderResponse para transformar o texto Markdown da IA em elementos HTML/React visuais. */}
                </section>
            )}
          </section>
        </section>

        {/* === IMPORTAÇÃO DO NOVO COMPONENTE FOOTER === */}
        <Footer />
        {/* ========================================= */}

      </section> 
    </section> 
  );
}