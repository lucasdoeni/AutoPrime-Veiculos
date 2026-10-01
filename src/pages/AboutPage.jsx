import React from 'react';
import AboutSection from '../components/home/AboutSection';
import { Award, Shield, Users, Clock, MapPin, CheckCircle } from 'lucide-react';
import { dealershipInfo } from '../data/vehiclesData';

export default function AboutPage({ onNavigateContact }) {
  return (
    <div className="about-page fade-in" style={{ padding: '40px 0 90px 0' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <div className="section-tag">
            <Award size={15} />
            <span>Nossa Trajetória</span>
          </div>
          <h1 className="section-title">
            Conheça a História da <span className="text-gold-gradient">AutoPrime Veículos</span>
          </h1>
          <p className="section-subtitle">
            15 anos de dedicação exclusiva ao segmento premium, construindo relações duradouras pautadas em transparência, integridade e paixão por automóveis.
          </p>
        </div>

        {/* Embedded About Section */}
        <AboutSection onNavigateContact={onNavigateContact} />

        {/* Gallery of the Showroom */}
        <div style={{ marginTop: '70px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '28px' }}>
            <span className="section-tag">Infraestrutura</span>
            <h2 className="section-title">Nosso Showroom</h2>
            <p className="section-subtitle">
              Localizado estrategicamente no coração de São Paulo, projetado para proporcionar conforto, discrição e segurança aos nossos clientes e suas famílias.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" 
              alt="Showroom Lounge" 
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            />
            <img 
              src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80" 
              alt="Oficina de Detailing" 
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            />
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80" 
              alt="Espaço Exclusivo" 
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
