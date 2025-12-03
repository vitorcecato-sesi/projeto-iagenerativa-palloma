import React from "react";
import Navbar from "../components/Navbar.jsx"; // Assumindo que você tem um componente Navbar
import Footer from '../components/Footer.jsx'; // Assumindo que você tem um componente Footer

// O CSS desta página será adicionado no final do arquivo AssistenteIA.css
import "./styles/SobreNos.css";
// Você pode considerar criar um novo CSS, mas para manter a consistência, 
// vamos adicionar os novos estilos no seu arquivo existente.

// Array de dados dos integrantes para renderização dinâmica
const integrantes = [
    { nome: "Laura Betti", fotoUrl: "../src/assets/FtLaura.png" }, // Foto real do integrante
    { nome: "Lucas Casagrande", fotoUrl: "../src/assets/FtLucas.png" },
    { nome: "Milena", fotoUrl: "../src/assets/FtMilena.png" },
    { nome: "Pietro Melle", fotoUrl: "../src/assets/FtPietro.png" },
    { nome: "Pyetro Joaquim", fotoUrl: "../src/assets/FtPyetro.png" },
    { nome: "Vitor Geraldo", fotoUrl: "../src/assets/FtVitor.png" },
];

// Componente para um único card de integrante
const IntegranteCard = ({ nome, fotoUrl }) => (
    <section className="integrante-card">
        {/* Simula a área da foto. Você substituirá isso por uma tag <img> real. */}
        <section className="integrante-placeholder-image">
            <img src={fotoUrl} alt={`Foto de ${nome}`} className="integrante-photo" />
           </section>
        <p className="integrante-name">{nome}</p>
    </section>
);

export default function SobreNos() {
    return (
        <section className="page-container sobre-nos-page">

            <section className="shape sobre-nos-retangulo-verde"></section>
            <section className="shape sobre-nos-circle-red-small-top"></section>
            <section className="shape sobre-nos-circle-red-left"></section>
            <section className="shape sobre-nos-circle-yellow-top"></section>
            {/* O círculo azul claro do lado direito (atrás da foto) */}
            <section className="shape sobre-nos-circle-lightblue-right"></section>


            <section className="content-wrapper">
                <Navbar />

                <section className="sobre-nos-content">
                    {/* --- Seção de Título e Texto --- */}
                    <header className="sobre-nos-header">
                        <h1 className="sobre-nos-title">Sobre nós</h1>
                    </header>

                    <section className="about-us-hero-section">
                        {/* Coluna do Texto */}
                        <section className="about-text-column">
                            <p className="sobre-nos-paragraph">
                                O grupo 3 é formado por Laura Betti, Lucas Casagrande, Milena, Pietro Melle, Pyetro Joaquim e Vitor Geraldo. Nosso grupo se destaca por valorizar 
                                três princípios fundamentais: honestidade, comprometimento e união. Acreditamos que a honestidade é essencial para manter a confiança e o respeito 
                                entre os integrantes, o comprometimento demonstra nossa dedicação em cada atividade e desejo de alcançar sempre o melhor resultado; já a união é o 
                                que fortalece nossa equipe, tornando o trabalho mais leve, produtivo e harmonioso. Esses valores guiam o grupo 3 mesmo diante de desafios, e é por 
                                isso que cada conquista se torna ainda mais significativa.
                            </p>
                        </section>

                        {/* Coluna da Foto */}
                        <section className="about-image-column">
                            {/* Este é o espaço para a foto do grupo */}
                            {/* Idealmente você usaria a tag <img> com o source da imagem */}
                            <img
                                src="../src/assets/imgGrupo.png" // Substitua pelo caminho real da sua foto
                                alt="Foto do grupo 3, incluindo Laura Betti, Lucas Casagrande, Milena, Pietro Melle, Pyetro Joaquim e Vitor Geraldo."
                                className="group-photo"
                            />
                        </section>
                    </section>

                    {/* --- Seção de Integrantes --- */}
                    <section className="integrantes-section">
                        <h2 className="integrantes-title">Integrantes do grupo:</h2>
                        <section className="integrantes-grid">
                            {integrantes.map((integrante, index) => (
                                <IntegranteCard key={index} {...integrante} />
                            ))}
                        </section>
                    </section>
                </section>

                <Footer />
            </section>
        </section>
    );
}