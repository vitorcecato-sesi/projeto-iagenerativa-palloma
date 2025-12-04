import React, { useState, useEffect } from "react";
// 1. Importar useNavigate para manipular o redirecionamento
import { useNavigate } from "react-router-dom";

import "./styles/Login.css";

const Login = () => {
    // Inicializa o hook de navegação
    const navigate = useNavigate();

    // Variáveis para armazenar os valores dos campos
    const [user, setUser] = useState("");
    const [senha, setSenha] = useState("");

    // Variáveis de feedback
    const [status, setStatus] = useState("");
    const [validacao, setValidacao] = useState(false);

    // Variável de controle: se o login foi validado e precisa redirecionar
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // 2. Hook useEffect para lidar com o redirecionamento após a validação
    useEffect(() => {
        if (shouldRedirect) {
            // Define o tempo de espera (ex: 2000 milissegundos = 2 segundos)
            const timer = setTimeout(() => {
                // Redireciona o usuário para a página do Assistente de IA
                navigate("/assistente");
            }, 2000); // 2 segundos

            // Função de limpeza: limpa o timer se o componente for desmontado
            return () => clearTimeout(timer);
        }
    }, [shouldRedirect, navigate]);
    // O hook roda sempre que shouldRedirect muda para true

    // Função para validação de login
    const validarLogin = (e) => {
        e.preventDefault();
       
        // Limpa status e validação antes de começar
        setValidacao(false);
        setShouldRedirect(false); // Garante que não redireciona antes da hora

        // --- Verificações de campo vazio ---
        if (user === "" || senha === "") {
            if (user === "" && senha === "") {
                setStatus("Por favor, preencha os campos de usuário e senha.");
            } else if (user === "") {
                setStatus("Por favor, preencha o campo de usuário.");
            } else { // senha === ""
                setStatus("Por favor, preencha o campo de senha.");
            }
            return;
        }

        // --- Validação de dados (Lógica de Login) ---
        if (user === "palloma" && senha === "1234") {
            // 3. Define o status de sucesso
            setValidacao(true);
            setStatus("Login bem-sucedido! Redirecionando...");
           
            // 4. Ativa o redirecionamento (o useEffect fará o trabalho)
            setShouldRedirect(true);

        } else {
            // Caso de credenciais incorretas
            setStatus("Usuário ou senha incorretos.");
            setValidacao(false);
        }
    };

    return (
        <section className="login-container">
        {/* Formas decorativas do fundo */}
        <span className="forma circulo-amarelo"></span>
        <span className="forma circulo-amarelo-g"></span>
        <span className="forma circulo-laranja"></span>
        <span className="forma circulo-azul"></span>
        <span className="forma circulo-vermelho"></span>
        <span className="forma circulo-vermelho-g"></span>
        <span className="forma circulo-verde"></span>
        <span className="forma circulo-amarelo"></span>
        <span className="forma retangulo-verde"></span>
        <span className="forma retangulo-azul"></span>
        <span className="forma retangulo-verde-h"></span>

        {/* Bloco Login */}
        <section className="login-box">
            <h1 className="login-titulo">
                Comece agora <br />
                mesmo, faça o <br />
                login
            </h1>

            <form onSubmit={validarLogin}>
                <section className="login-inputs">
                    <label htmlFor="user">Usuário</label>
                    <input
                        type="text"
                        id="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        // Desabilita o input durante o redirecionamento
                        disabled={shouldRedirect}
                    />
                </section>

                <section className="login-inputs">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        // Desabilita o input durante o redirecionamento
                        disabled={shouldRedirect}
                    />
                </section>
               
                {/* Exibe a mensagem de status */}
                {status && (<p className={validacao ? "status-sucesso" : "status-erro"}>{status}</p>)}
               
                <button
                    type="submit"
                    className="login-botao"
                    // Desabilita o botão se estiver carregando ou redirecionando
                    disabled={shouldRedirect}
                >
                    {shouldRedirect ? "Acessando..." : "Entrar"}
                </button>
            </form>
        </section>
        </section>
    );
};

export default Login;