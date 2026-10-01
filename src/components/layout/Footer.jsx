import React from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  ChevronRight, 
  CheckCircle2
} from 'lucide-react';
import { dealershipInfo } from '../../data/vehiclesData';
import './Footer.css';

export default function Footer({ setActivePage }) {
  const handleNav = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="footer-logo-title">
              <div className="brand-icon-wrapper">
                <Shield className="brand-icon" />
              </div>
              <div className="brand-text">
                <span className="brand-name">AUTOPRIME <span>VEÍCULOS</span></span>
                <span className="brand-sub">Luxury & Performance</span>
              </div>
            </div>
            <p className="footer-desc">
              Concessionária boutique especializada em veículos esportivos, utilitários premium e seminovos de altíssimo padrão. Cada unidade passa por rigorosa perícia técnica cautelar de mais de 250 itens.
            </p>
            <div className="footer-badges">
              <span className="footer-cert-badge">
                <CheckCircle2 size={14} /> Laudo Cautelar 100%
              </span>
              <span className="footer-cert-badge">
                <CheckCircle2 size={14} /> 1 Ano de Garantia
              </span>
              <span className="footer-cert-badge">
                <CheckCircle2 size={14} /> Procedência Registrada
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Navegação Rápida</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => handleNav('home')}>
                  <ChevronRight size={14} /> Início
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('catalog')}>
                  <ChevronRight size={14} /> Estoque de Veículos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('financing')}>
                  <ChevronRight size={14} /> Simular Financiamento
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('trade-in')}>
                  <ChevronRight size={14} /> Avaliação de Seminovos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')}>
                  <ChevronRight size={14} /> Sobre a Concessionária
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')}>
                  <ChevronRight size={14} /> Fale com a Diretoria
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="footer-title">Horário & Serviços</h4>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <Clock size={18} />
                <span>
                  <strong>Atendimento Showroom</strong>
                  Segunda a Sexta: 08:30 às 19:00<br />
                  Sábados: 09:00 às 16:00
                </span>
              </li>
              <li className="contact-item">
                <Shield size={18} />
                <span>
                  <strong>Consultoria Personalizada</strong>
                  Atendimento VIP com hora marcada e entrega em domicílio para todo o Brasil.
                </span>
              </li>
            </ul>
          </div>

          {/* Location & Direct Contact */}
          <div>
            <h4 className="footer-title">Localização & Contato</h4>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <MapPin size={18} />
                <span>
                  <strong>Endereço Showroom</strong>
                  {dealershipInfo.address}<br />
                  CEP: {dealershipInfo.zipCode}
                </span>
              </li>
              <li className="contact-item">
                <Phone size={18} />
                <span>
                  <strong>Telefone Central</strong>
                  {dealershipInfo.phone}
                </span>
              </li>
              <li className="contact-item">
                <Mail size={18} />
                <span>
                  <strong>E-mail Comercial</strong>
                  {dealershipInfo.email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AutoPrime Veículos Ltda. CNPJ: 12.345.678/0001-90. Todos os direitos reservados.</p>
          <div className="social-links">
            {/* Instagram SVG */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            {/* Facebook SVG */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* YouTube SVG */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="YouTube">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
              </svg>
            </a>
            {/* LinkedIn SVG */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
