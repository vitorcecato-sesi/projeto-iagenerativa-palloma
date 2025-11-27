import React from 'react';
import './styles/SobreGrupo.css'; // Importando o arquivo CSS criado acima

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
    <div className="page-container">
      
      {/* Elementos Decorativos de Fundo */}
      <div className="circle top-yellow"></div>
      <div className="circle top-blue"></div>
      <div className="circle red-dot-left"></div>
      <div className="circle red-dot-right"></div>

    
      {/* Título Principal */}
      <header className="header">
        <h1 className="main-title">Sobre nós</h1>
      </header>

      {/* Seção de Conteúdo (Texto + Foto) */}
      <section className="content-section">
        <div className="blue-box">
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
        <div className="group-photo-container">
          <img 
            src="https://placehold.co/600x400/555/white?text=Foto+do+Grupo" 
            alt="Grupo 3" 
            className="group-photo" 
          />
        </div>
      </section>

      {/* Seção Integrantes */}
      <section className="members-section">
        <h2 className="members-title">Integrantes do grupo:</h2>

        <div className="grid-container">
          {integrantes.map((member, index) => (
            <div key={index} className="member-card">
              <div className="photo-placeholder">
                 {/* Substitua o src abaixo pelas fotos reais */}
                 <img 
                    src="https://placehold.co/200x250/d3d3d3/d3d3d3" 
                    alt={member.name}
                 />
              </div>
              <p className="member-name">{member.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rodapé */}
      <footer className="footer">
        <div className="footer-left">
          <div className="logo-placeholder">🥑</div> 
        </div>
        
        <div className="footer-center">
          <p style={{fontWeight: 'bold'}}>Grupo 3</p>
          <p style={{fontSize: '0.8rem'}}>Todos os Direitos Reservados</p>
        </div>

        <div className="footer-right">
           <span style={{fontWeight: 'bold'}}>2025</span>
           <div className="circle bottom-yellow"></div>
        </div>
      </footer>
    </div>
  );
};

export default SobreNos;