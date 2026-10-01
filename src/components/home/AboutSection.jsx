import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Truck, Building2, Star } from 'lucide-react';
import './AboutSection.css';

export default function AboutSection({ onNavigateContact }) {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Perícia Cautelar 100%",
      desc: "Nenhum veículo entra em nosso acervo sem vistoria de mais de 250 itens estruturais, mecânicos e documentais."
    },
    {
      icon: Award,
      title: "Garantia Estendida de 1 Ano",
      desc: "Segurança absoluta para motor e câmbio em todo o Brasil com assistência 24 horas credenciada."
    },
    {
      icon: Truck,
      title: "Entrega VIP em Todo o Brasil",
      desc: "Transporte em caminhão prancha fechado exclusivo até a garagem da sua residência com seguro integral."
    },
    {
      icon: HeartHandshake,
      title: "Curadoria & Pós-Venda Ativo",
      desc: "Consultores especializados no mercado automotivo de luxo prontos para atender você a qualquer momento."
    }
  ];

  return (
    <section className="about-section" id="sobre-nos">
      <div className="container">
        <div className="about-grid">
          {/* Left Media Block */}
          <div className="about-media-block">
            <img 
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80" 
              alt="Showroom AutoPrime Veículos" 
              className="about-main-image"
            />
            <div className="about-floating-card">
              <div className="floating-icon">
                <Star size={24} fill="#0B0C10" />
              </div>
              <div>
                <h4 className="floating-title">4.9 / 5.0 Estrelas</h4>
                <p className="floating-subtitle">Avaliação comprovada por mais de 1.800 clientes Google</p>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="about-text-content">
            <div className="section-tag" style={{ width: 'fit-content' }}>
              <Building2 size={14} />
              <span>Conheça a AutoPrime</span>
            </div>

            <h2 className="about-title">
              Mais do que uma concessionária, uma <span className="text-gold-gradient">curadoria automotiva</span>
            </h2>

            <p className="about-p">
              Fundada há 15 anos no coração do polo automotivo nobre de São Paulo, a <strong>AutoPrime Veículos</strong> nasceu da paixão visceral por esportivos, modelos de alto desempenho e utilitários de luxo.
            </p>

            <p className="about-p">
              Acreditamos que comprar um veículo premium deve ser uma experiência memorável, transparente e sem qualquer surpresa desagradável. Nossa equipe cuida de toda a burocracia, transferência, blindagem e personalização para você apenas desfrutar do volante.
            </p>

            {/* Pillars */}
            <div className="about-pillars">
              {pillars.map((pil, idx) => {
                const Icon = pil.icon;
                return (
                  <div key={idx} className="pillar-card">
                    <div className="pillar-icon-wrap">
                      <Icon size={20} />
                    </div>
                    <h3 className="pillar-title">{pil.title}</h3>
                    <p className="pillar-desc">{pil.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
