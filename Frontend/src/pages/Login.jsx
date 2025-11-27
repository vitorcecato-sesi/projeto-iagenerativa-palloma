import { useState } from "react";
import "./styles/Login.css";

const Login = () => {

    // Variáveis para armazenar os valores dos campos 
    const [user, setUser] = useState("")
    const [senha, setSenha] = useState("")

    // Variáveis de feedback
    const [status, setStatus] = useState("")
    const [validacao, setValidacao] = useState(false)

    // Função para validação de login
    const validarLogin = (e) => {
        e.preventDefault()
        
        // Controle do dev 
        console.log("Login:", { user, senha })

        setValidacao(false)

        // Verificar se os campos estão vazios
        if (user === "" || senha === "") {
            if (user === "" && senha === "") {
                setStatus("Por favor, preencha os campos de usuário e senha.")
                return
            }
            if (user === "") {
                setStatus("Por favor, preencha o campo de usuário.")
                return
            }
            if (senha === "") {
                setStatus("Por favor, preencha o campo de senha.")
                return
            }
        }

        setStatus("Usuário ou senha incorretos.")

        // Validação de dados
        if (user === "palloma" && senha === "1234") {
            setValidacao(true)
            setStatus("Login bem-sucedido! Redirecionando...")
        }
    }

  return (
    <section className="login-container">
      {/* Formas decorativas do fundo */}
      <span className="forma circulo-amarelo"></span>
      <span className="forma circulo-laranja"></span>
      <span className="forma circulo-azul"></span>
      <span className="forma circulo-vermelho"></span>
      <span className="forma circulo-verde"></span>
      <span className="forma circulo-amarelo"></span>
      <span className="forma retangulo-verde"></span>
      <span className="forma retangulo-azul"></span>
      <span className="forma quadrado-verde"></span>

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
            />
          </section>

          <section className="login-inputs">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </section>
            {status && (<p className={validacao ? "status-sucesso" : "status-erro"}>{status}</p>)}
          <button type="submit" className="login-botao">Entrar</button>
        </form>
      </section>
    </section>
  );
};

export default Login;
