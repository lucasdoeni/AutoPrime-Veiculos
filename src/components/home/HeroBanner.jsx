import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, MessageCircle, Search, Award } from 'lucide-react';
import { dealershipInfo } from '../../data/vehiclesData';
import { generateWhatsAppLink } from '../../utils/formatters';
import './HeroBanner.css';

export default function HeroBanner({ onSearchSubmit, onNavigateCatalog, onNavigateContact }) {
  const [searchBrand, setSearchBrand] = useState('Todas');
  const [searchCategory, setSearchCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const brands = ['Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Land Rover', 'Ford', 'Volvo', 'Toyota', 'Ram'];
  const categories = ['SUV', 'Sedã', 'Esportivo', 'Picape'];

  const handleQuickSearch = (e) => {
    e.preventDefault();
    onSearchSubmit({
      brand: searchBrand,
      category: searchCategory,
      query: searchQuery
    });
  };

  const whatsAppHeroUrl = generateWhatsAppLink(
    dealershipInfo.whatsappNumber,
    "Olá! Gostaria de falar com um consultor da AutoPrime Veículos para conhecer as opções disponíveis."
  );

  return (
    <section className="hero-banner">
      <div className="container">
        <div className="hero-content">
          {/* Pill Badge */}
          <div className="hero-badge-pill">
            <Award size={16} />
            <span>Referência Nacional em Veículos Premium</span>
          </div>

          {/* Heading */}
          <h1 className="hero-title">
            O Luxo e a Performance que você merece na <span className="text-gold-gradient">AutoPrime Veículos</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-desc">
            Acervo exclusivo de veículos esportivos e utilitários seminovos com laudo cautelar 100% aprovado, procedência meticulosamente revisada e garantia total de tranquilidade.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions">
            <button 
              className="btn btn-primary"
              onClick={onNavigateCatalog}
            >
              <span>Ver Estoque Completo</span>
              <ArrowRight size={18} />
            </button>

            <a 
              href={whatsAppHeroUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp"
            >
              <MessageCircle size={18} />
              <span>Consultoria via WhatsApp</span>
            </a>

            <button 
              className="btn btn-outline-white"
              onClick={onNavigateContact}
            >
              <span>Conhecer a Loja</span>
            </button>
          </div>

          {/* Integrated Quick Search */}
          <div className="hero-quick-search">
            <form onSubmit={handleQuickSearch} className="quick-search-grid">
              <div className="quick-field">
                <label>O que você procura?</label>
                <input 
                  type="text" 
                  placeholder="Modelo ou palavra-chave..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="quick-input"
                />
              </div>

              <div className="quick-field">
                <label>Marca</label>
                <select 
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  className="quick-select"
                >
                  <option value="Todas">Todas as Marcas</option>
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="quick-field">
                <label>Carroceria</label>
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="quick-select"
                >
                  <option value="Todas">Todas as Categorias</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '46px' }}>
                <Search size={18} />
                <span>Buscar</span>
              </button>
            </form>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-row">
            {dealershipInfo.stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <span className="stat-value text-gold-gradient">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
