import React, { useState } from 'react';
import { Shield, Menu, X, PhoneCall, Lock } from 'lucide-react';
import { dealershipInfo } from '../../data/vehiclesData';
import './Navbar.css';

export default function Navbar({ activePage, setActivePage, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('home')}>
          <div className="brand-icon-wrapper">
            <Shield className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">AUTOPRIME <span>VEÍCULOS</span></span>
            <span className="brand-sub">Luxury & Performance</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav>
          <ul className="navbar-nav">
            <li>
              <button 
                className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Início
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'catalog' ? 'active' : ''}`}
                onClick={() => handleNavClick('catalog')}
              >
                Estoque Completo
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'financing' ? 'active' : ''}`}
                onClick={() => handleNavClick('financing')}
              >
                Financiamento
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'trade-in' ? 'active' : ''}`}
                onClick={() => handleNavClick('trade-in')}
              >
                Avaliar Usado
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick('about')}
              >
                Sobre a Loja
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavClick('contact')}
              >
                Contato
              </button>
            </li>
          </ul>
        </nav>

        {/* Right Actions: Lojista / Admin & Mobile Toggle */}
        <div className="navbar-actions">
          <button 
            type="button"
            className="navbar-admin-btn"
            onClick={onOpenAdmin}
            title="Acessar Área do Lojista (Cadastro e Gestão de Veículos)"
          >
            <Lock size={15} />
            <span>Área do Lojista</span>
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-list">
          <li>
            <button 
              className={`mobile-menu-link ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Início
            </button>
          </li>
          <li>
            <button 
              className={`mobile-menu-link ${activePage === 'catalog' ? 'active' : ''}`}
              onClick={() => handleNavClick('catalog')}
            >
              Estoque Completo
            </button>
          </li>
          <li>
            <button 
              className={`mobile-menu-link ${activePage === 'financing' ? 'active' : ''}`}
              onClick={() => handleNavClick('financing')}
            >
              Simulador de Financiamento
            </button>
          </li>
          <li>
            <button 
              className={`mobile-menu-link ${activePage === 'trade-in' ? 'active' : ''}`}
              onClick={() => handleNavClick('trade-in')}
            >
              Avaliar Meu Usado
            </button>
          </li>
          <li>
            <button 
              className={`mobile-menu-link ${activePage === 'about' ? 'active' : ''}`}
              onClick={() => handleNavClick('about')}
            >
              Sobre a AutoPrime
            </button>
          </li>
          <li>
            <button 
              className={`mobile-menu-link ${activePage === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
            >
              Fale Conosco
            </button>
          </li>
          <li>
            <button 
              className="mobile-menu-link"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Lock size={18} />
              <span>Área do Lojista (Cadastrar Veículos)</span>
            </button>
          </li>
        </ul>

        <div className="mobile-cta-wrapper">
          <a 
            href={`tel:${dealershipInfo.phone.replace(/\D/g, '')}`}
            className="btn btn-outline-white"
            style={{ width: '100%' }}
          >
            <PhoneCall size={18} />
            Ligar para Loja: {dealershipInfo.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
