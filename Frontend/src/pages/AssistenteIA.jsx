import React, { useState, useRef, useEffect } from "react";
import "./styles/AssistenteIA.css";

// Componente de Ícone simples (SVG)
const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962l6.135-1.582A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0l1.582 6.135a2 2 0 0 0 1.437 1.437l6.135 1.582a.5.5 0 0 1 0 .962l-6.135 1.582a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>
  </svg>
);

export default function AssistenteIA() {
  const [tema, setTema] = useState("");
  const [serie, setSerie] = useState("");
  const [duracao, setDuracao] = useState("");
  const [obs, setObs] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const resultRef = useRef(null);

  const API_KEY = ""; 
  const MODEL = "gemini-2.5-flash";

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

  const duracoes = ["30 minutos","50 minutos (1 aula)", "1 hora e 40 minutos (2 aulas)", "2 horas"];

  // --- Lógica de Prompt ---
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

  const gerarPlano = async () => {
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
      
      // Scroll para o resultado
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);

    } catch (e) {
      setGeneratedContent("Erro de conexão com a IA.");
    } finally {
      setLoading(false);
    }
  };

  // --- FORMATADORES DE TEXTO (A MÁGICA ACONTECE AQUI) ---
  
  // Função auxiliar para transformar **texto** em negrito
  const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: '#2c3e50' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Função principal que lê o Markdown e transforma em HTML limpo
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

      // 1. Títulos (## Título ou TÍTULO:)
      if (trimmed.startsWith('##') || (trimmed === trimmed.toUpperCase() && trimmed.endsWith(':'))) {
        flushList();
        const titleText = trimmed.replace(/^#+\s*/, '').replace(/\*/g, '');
        elements.push(<h4 key={index} className="ia-subtitle">{titleText}</h4>);
      }
      // 2. Listas (* item ou - item)
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
        const itemText = trimmed.replace(/^[\*\-\d\.]+\s*/, '');
        listBuffer.push(<li key={`li-${index}`}>{parseBold(itemText)}</li>);
      }
      // 3. Parágrafos normais
      else {
        flushList();
        elements.push(<p key={index} className="ia-paragraph">{parseBold(trimmed)}</p>);
      }
    });

    flushList(); // Garante que a última lista seja renderizada
    return elements;
  };

  return (
    <section className="page-container">
      {/* Formas Geométricas */}
      <section className="shape circle-blue-top-left"></section>
      <section className="shape circle-yellow-bottom-left"></section>
      <section className="shape circle-green-bottom-right"></section>
      <section className="shape rect-green-top"></section>
      <section className="shape circle-red-top"></section>
      <section className="shape circle-red-middle"></section>
      <section className="shape rect-blue-bottom-left"></section>

      <section className="content-wrapper">

        {/* === IMPORTAÇÃO DO NOVO COMPONENTE NAVBAR === */}
        {/* ========================================= */}
        
        {/* Topo */}
        <section className="top-section">
          <section className="hero-column">
            <h1 className="hero-title">
              Crie seu <br /> plano <br /> de aula <br /> agora
            </h1>
            <section className="expectations-btn-wrapper">
                <button className="expectations-btn">
                    Ver expectativas de <br/> cada Série/Ano
                    <span className="icon-pointer">👆</span>
                </button>
            </section>
          </section>

          {/* Formulário */}
          <section className="form-section">
          <section className="form-card">
            <h2 className="form-title">Informações da Aula</h2>

            <section className="input-group">
                <label>Tema da Aula *</label>
                <input 
                    type="text" 
                    placeholder="Ex: Interpretação de Texto"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                />
            </section>

            <section className="suggestions-chips">
                <span className="suggestion-label">Sugestão</span>
                <section className="chips-container">
                    {sugestoes.map((s, i) => (
                        <button key={i} className="chip" onClick={() => setTema(s)}>{s}</button>
                    ))}
                </section>
            </section>

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

            <section className="input-group">
                <label>Observações</label>
                <textarea 
                    placeholder="Ex: Turma de 30 alunos, foco em atividades práticas, uso de recursos audiovisuais, alunos com dificuldades de leitura, alunos com deficiências..."
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                />
            </section>

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

        {/* Resultado */}
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
                <section className="ia-content">
                    {renderResponse(generatedContent)}
                </section>
            )}
          </section>
        </section>

      </section>
    </section>
  );
}