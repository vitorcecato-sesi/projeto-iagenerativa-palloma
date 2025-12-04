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

// Ícone para o botão de Copiar
const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

// Ícone para o botão de Download PDF
const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export default function AssistenteIA() {
  // Estados (useState) para armazenar os valores dos campos do formulário.
  const [tema, setTema] = useState(""); 
  const [serie, setSerie] = useState(""); 
  const [duracao, setDuracao] = useState(""); 
  const [obs, setObs] = useState(""); 
  const [generatedContent, setGeneratedContent] = useState(null); 
  const [loading, setLoading] = useState(false); 
  
  // useRef para criar uma referência ao elemento do resultado, permitindo rolar a página até lá após gerar o plano.
  const resultRef = useRef(null);
  // NOVO: useRef para criar uma referência ao elemento HTML do plano gerado para cópia/download.
  const contentToPrintRef = useRef(null); 

  // Constantes para a API do Gemini: chave da API (de variáveis de ambiente) e modelo usado.
  const API_KEY = import.meta.env.VITE_GEMINI_KEY; // Chave da API, armazenada em variáveis de ambiente para segurança.
  const MODEL = "gemini-2.5-flash"; // Modelo de IA usado para gerar o conteúdo.

  // Arrays de opções pré-definidas para os selects e chips de sugestão.
  const sugestoes = [ 
    "Vocabulário",
    "Figuras de Linguagem",
    "Redação ENEM",
    "Gêneros textuais",
    "Sinais de pontuação",
  ];

  const seriesFundamentalMedio = [ 
    "6º ano", "7º ano", "8º ano", "9º ano",
    "1º ano Ensino Médio", "2º ano Ensino Médio", "3º ano Ensino Médio",
  ];

  const duracoes = ["30 minutos","50 minutos (1 aula)", "1 hora e 40 minutos (2 aulas)", "2 horas"]; // Opções de duração da aula.

  // Função que constrói o prompt (instrução) enviado para a IA.
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
    Divida o tempo total (${duracao}) em três momentos, descrevendo a ação do professor e do aluno:
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
  const gerarPlano = async () => {
    // ... (restante da função gerarPlano é o mesmo)
    if (!tema || !serie || !duracao) {
      alert("Por favor, preencha os campos obrigatórios (*)");
      return;
    }

    setLoading(true);
    setGeneratedContent(null);

    const prompt = buildPrompt(tema, serie, duracao, obs);

    try {
      const response = await fetch(
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

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar conteúdo.";
      setGeneratedContent(reply);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);

    } catch (e) {
      setGeneratedContent("Erro de conexão com a IA.");
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Função para copiar o conteúdo para a área de transferência.
  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent)
        .then(() => {
          alert('Plano de aula copiado para a área de transferência!');
        })
        .catch(err => {
          console.error('Erro ao copiar o texto: ', err);
          alert('Erro ao copiar o plano de aula.');
        });
    }
  };

  // NOVO: Função para baixar o PDF (usa a funcionalidade de impressão do navegador).
  const handleDownloadPDF = () => {
    // O ideal seria usar html2pdf/jspdf para preservar a formatação
    // Mas para uma solução rápida, usaremos a impressão de uma nova janela
    if (contentToPrintRef.current) {
      // Cria uma nova janela e adiciona o conteúdo HTML formatado
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Plano de Aula</title>');
      // Opcional: Adicionar estilos básicos para impressão
      printWindow.document.write('<style>body{font-family: Arial, sans-serif; padding: 20px;} h4{color: #2c3e50; border-bottom: 2px solid #74c686;} strong{font-weight: bold;} ul{padding-left: 20px;}</style>');
      printWindow.document.write('</head><body>');
      
      // Captura o HTML formatado do componente e o injeta na nova janela
      printWindow.document.write(contentToPrintRef.current.innerHTML); 
      
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // Chama a função de impressão
      printWindow.print(); 
    }
  };


  // --- FORMATADORES DE TEXTO ---
  
  // Função auxiliar que transforma texto entre ** (negrito) em elementos <strong> com cor específica.
  const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); 
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: '#2c3e50' }}>{part.slice(2, -2)}</strong>;
      }
      return part; 
    });
  };

  // Função principal que converte o texto Markdown da IA em elementos HTML/React.
  const renderResponse = (text) => {
    if (!text) return null; 
    const lines = text.split('\n'); 
    const elements = []; 
    let listBuffer = []; 

    const flushList = () => {
      if (listBuffer.length > 0) {
        elements.push(<ul key={`list-${elements.length}`} className="ia-list">{[...listBuffer]}</ul>);
        listBuffer = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim(); 
      if (!trimmed) return; 

      if (trimmed.startsWith('##') || (trimmed === trimmed.toUpperCase() && trimmed.endsWith(':'))) {
        flushList(); 
        const titleText = trimmed.replace(/^#+\s*/, '').replace(/\*/g, ''); 
        elements.push(<h4 key={index} className="ia-subtitle">{titleText}</h4>); 
      }
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
        const itemText = trimmed.replace(/^[\*\-\d\.]+\s*/, ''); 
        listBuffer.push(<li key={`li-${index}`}>{parseBold(itemText)}</li>); 
      }
      else {
        flushList(); 
        elements.push(<p key={index} className="ia-paragraph">{parseBold(trimmed)}</p>); 
      }
    });

    flushList(); 
    return elements; 
  };

  return (
    <section className="containerTotalPagina"> 

      {/* Formas Geométricas: Elementos decorativos para o fundo. */}
      <section className="shape circle-blue-top-left"></section>
      <section className="shape circle-yellow-bottom-left"></section>
      <section className="shape circle-green-bottom-right"></section>
      <section className="shape rect-green-top"></section>
      <section className="shape circle-red-top"></section>
      <section className="shape circle-red-middle"></section>
      <section className="shape rect-blue-bottom-left"></section>

      <section className="content-wrapper"> 

        {/* === IMPORTAÇÃO DO NOVO COMPONENTE NAVBAR === */}
        <Navbar />
        {/* ========================================= */}
        
        {/* Topo: Seção com título e botão para expectativas. */}
        <section className="top-section">
          <section className="hero-column">
            <h1 className="hero-title">
              Crie seu <br /> plano <br /> de aula <br /> agora 
            </h1>
            <section className="expectations-btn-wrapper">
              <Link to="/expectativas" className="expectations-btn"> 
                      Ver expectativas de<br/>cada Série/Ano
                      <span className="icon-pointer">👆</span>
                  </Link>
              </section>
            </section>

            {/* Formulário: Seção com campos para inserir dados da aula. */}
            <section className="form-section">
            <section className="form-card">
              <h2 className="form-title">Informações da Aula</h2> 

              {/* Campo para tema, com sugestões em chips. */}
              <section className="input-group">
                  <label>Tema da Aula *</label> 
                  <input 
                      type="text" 
                      placeholder="Ex: Interpretação de Texto" 
                      value={tema} 
                      onChange={(e) => setTema(e.target.value)} 
                  />
              </section>

              {/* Chips de sugestões: Botões para preencher o tema rapidamente. */}
              <section className="suggestions-chips">
                  <span className="suggestion-label">Sugestão</span>
                  <section className="chips-container">
                      {sugestoes.map((s, i) => ( 
                          <button key={i} className="chip" onClick={() => setTema(s)}>{s}</button> 
                      ))}
                  </section>
              </section>

              {/* Campos em linha: Série e Duração. */}
              <section className="row-inputs">
                  <section className="input-group half">
                      <label>Série / Ano *</label>
                      <select value={serie} onChange={(e) => setSerie(e.target.value)}> 
                          <option value="">Selecione</option> 
                          {seriesFundamentalMedio.map((s, i) => <option key={i} value={s}>{s}</option>)} 
                      </select>
                  </section>
                  <section className="input-group half">
                      <label>Duração *</label>
                      <select value={duracao} onChange={(e) => setDuracao(e.target.value)}> 
                          <option value="">Selecione</option>
                          {duracoes.map((d, i) => <option key={i} value={d}>{d}</option>)} 
                      </select>
                  </section>
              </section>

              {/* Campo para observações. */}
              <section className="input-group">
                  <label>Observações</label>
                  <textarea 
                      placeholder="Ex: Turma de 30 alunos, foco em atividades práticas, uso de recursos audiovisuais, alunos com dificuldades de leitura, alunos com deficiências..." 
                      value={obs}
                      onChange={(e) => setObs(e.target.value)} 
                  />
              </section>

              {/* Botão para gerar o plano: Desabilitado durante loading, mostra ícone e texto. */}
              <button className="generate-btn" onClick={gerarPlano} disabled={loading}>
                  {loading ? "Gerando..." : ( 
                      <>
                      <SparkleIcon /> Gerar Plano de Aula  
                      </>
                  )}
              </button>
            </section>
          </section>
        </section>

        {/* Resultado: Seção onde o plano gerado é exibido. */}
        <section className="result-section" ref={resultRef}> 
          <h3 className="result-title">Plano Gerado</h3> 
          
          <section className="result-paper"> 
            {!generatedContent && !loading && ( 
              <section className="empty-state"> 
                <section className="empty-icon">✨</section> 
                <p className="empty-text-bold">Seu plano aparecerá aqui</p> 
                <p className="empty-text-small">Preencha as informações e clique em "Gerar"</p> 
              </section>
            )}

            {loading && ( 
              <section className="loading-state"> 
                <section className="spinner"></section> 
                <p>Criando seu plano mágico...</p> 
              </section>
            )}

            {generatedContent && ( 
              <section className="ia-content-wrapper"> {/* NOVO WRAPPER para os botões */}
                
                {/* NOVO: Botões de Ação (Copiar e Download) */}
                <section className="action-buttons-container">
                    <button className="action-btn copy-btn" onClick={handleCopy}>
                        <CopyIcon /> Copiar Plano
                    </button>
                    <button className="action-btn pdf-btn" onClick={handleDownloadPDF}>
                        <DownloadIcon /> Baixar PDF
                    </button>
                </section>

                <section className="ia-content" ref={contentToPrintRef}> {/* Adiciona o ref aqui! */}
                    {renderResponse(generatedContent)} 
                </section>
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