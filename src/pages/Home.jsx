import React from 'react';
import { ArrowRight, Sparkles, Shield, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import VehicleCard from '../components/vehicles/VehicleCard';
import FinancingSection from '../components/home/FinancingSection';
import TradeInSection from '../components/home/TradeInSection';
import AboutSection from '../components/home/AboutSection';
import { vehiclesData } from '../data/vehiclesData';

export default function Home({ 
  vehicles = vehiclesData,
  onSelectVehicle, 
  onNavigateCatalog, 
  onNavigateContact, 
  setFilterParams 
}) {
  // Filter only vehicles marked as featured or top 6 for the home showcase
  const featuredCars = vehicles.filter(car => car.featured).slice(0, 6);

  const handleHeroSearch = (searchData) => {
    if (setFilterParams) {
      setFilterParams(searchData);
    }
    onNavigateCatalog();
  };

  const partnerBrands = [
    'Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Land Rover', 'Volvo', 'Ford Performance', 'Toyota GR', 'Ram'
  ];

  return (
    <div className="home-page fade-in">
      {/* 1. Hero Banner with Quick Search */}
      <HeroBanner 
        onSearchSubmit={handleHeroSearch}
        onNavigateCatalog={onNavigateCatalog}
        onNavigateContact={onNavigateContact}
      />

      {/* Brand Logos Bar */}
      <div style={{ backgroundColor: '#090A0D', borderBottom: '1px solid var(--border-subtle)', padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Marcas Selecionadas:
            </span>
            {partnerBrands.map((brand, i) => (
              <span 
                key={i} 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 700, 
                  fontSize: '0.95rem', 
                  color: 'rgba(255, 255, 255, 0.45)', 
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--gold-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.45)'}
                onClick={() => {
                  if (setFilterParams) setFilterParams({ brand });
                  onNavigateCatalog();
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Featured Vehicles Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Sparkles size={14} />
              <span>Destaques da Concessionária</span>
            </div>
            <h2 className="section-title">
              Veículos em <span className="text-gold-gradient">Evidência</span>
            </h2>
            <p className="section-subtitle">
              Modelos selecionados a dedo pela nossa equipe de especialistas, com histórico impecável e prontos para entrega imediata.
            </p>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '28px',
            marginBottom: '48px'
          }}>
            {featuredCars.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onSelectVehicle={onSelectVehicle} 
              />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button 
              className="btn btn-outline-gold" 
              onClick={onNavigateCatalog}
              style={{ padding: '14px 36px', fontSize: '1rem' }}
            >
              <span>Ver Todo o Estoque ({vehicles.length} Veículos)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Financing Simulator Section */}
      <FinancingSection />

      {/* 4. Trade-in Section */}
      <TradeInSection />

      {/* 5. Institutional / About Section */}
      <AboutSection onNavigateContact={onNavigateContact} />

      {/* 6. Why Choose AutoPrime Banner */}
      <section style={{ padding: '60px 0', backgroundColor: '#0B0C10', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}>
            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '8px' }}>Laudo Cautelar 100%</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sem histórico de colisão ou leilão. Procedência estritamente verificada.</p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '8px' }}>Garantia Nacional</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1 ano de garantia mecânica com assistência 24h e socorro em todo o Brasil.</p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '8px' }}>Melhores Taxas</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Condições especiais de financiamento com os maiores bancos privados do país.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
