import React from 'react';
import './styles/SobreGrupo.css'; // Importando o arquivo CSS criado acima
import imgGrupo from "../assets/imgGrupo.png";

import FtLaura from "../assets/FtLaura.png";
import FtLucas from "../assets/FtLucas.png";
import FtMilena from "../assets/FtMilena.png";
import FtPietro from "../assets/FtPietro.png";
import FtPyetro from "../assets/FtPyetro.png";
import FtVitor from "../assets/FtVitor.png";



const SobreNos = () => {
  // Lista de integrantes
  const integrantes = [
    { name: "Laura Betti" },
    { name: "Lucas Casagrande" },
    { name: "Milena" },
    { name: "Pietro Melle" },
    { name: "Pyetro Joaquim" },
    { name: "Vitor Geraldo" },
  ];

  return (
    <div className="page-container-sobre">
      
      {/* Elementos Decorativos de Fundo */}
      <div className="circle-sobre top-yellow-sobre"></div>
      <div className="circle-sobre top-blue-sobre"></div>
      <div className="circle-sobre red-dot-left-sobre"></div>
      <div className="circle-sobre red-dot-right-sobre"></div>

    
      {/* Título Principal */}
      <header className="header-sobre">
        <h1 className="main-title-sobre">Sobre nós</h1>
      </header>

      {/* Seção de Conteúdo (Texto + Foto) */}
      <section className="content-section-sobre">
        <div className="blue-box-sobre">
          <p>
            O grupo 3 é formado por Laura Betti, Lucas Casagrande, Milena, Pietro Melle, 
            Pyetro Joaquim e Vitor Geraldo. Nosso grupo se destaca por valorizar três 
            princípios fundamentais: honestidade, comprometimento e união. Acreditamos 
            que a honestidade é essencial para manter a confiança e o respeito entre os 
            integrantes, o comprometimento demonstra nossa dedicação em cada atividade 
            e desejo de alcançar sempre o melhor resultado; já a união é o que fortalece 
            nossa equipe, tornando o trabalho mais leve, produtivo e harmonioso. Esses 
            valores guiam o grupo 3 mesmo diante de desafios, e é por isso que cada 
            conquista se torna ainda mais significativa.
          </p>
        </div>
        
        {/* Container da foto do grupo */}
        <div className="group-photo-container-sobre">
          <img 
            src={imgGrupo} 
            alt="Grupo 3" 
            className="group-photo-sobre" 
          />
        </div>
      </section>

      {/* Seção Integrantes */}
      <section className="members-section-sobre">
        <h2 className="members-title-sobre">Integrantes do grupo:</h2>

        <div className="grid-container-sobre">
          {integrantes.map((member, index) => (
            <div key={index} className="member-card-sobre">
              <div className="photo-placeholder-sobre">
                 {/* Substitua o src abaixo pelas fotos reais */}
                 <img 
                    src={
                      index === 0 ? FtLaura :
                      index === 1 ? FtLucas :
                      index === 2 ? FtMilena :
                      index === 3 ? FtPietro :
                      index === 4 ? FtPyetro :
                      FtVitor} 
                      alt={member.name}
                      className="member-photo-sobre"
                 />
              </div>
              <p className="member-name-sobre">{member.name}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default SobreNos;