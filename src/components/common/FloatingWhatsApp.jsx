import React from 'react';
import { MessageCircle } from 'lucide-react';
import { dealershipInfo } from '../../data/vehiclesData';
import { generateWhatsAppLink } from '../../utils/formatters.js';
import './FloatingWhatsApp.css';

export default function FloatingWhatsApp() {
  const whatsAppUrl = generateWhatsAppLink(
    dealershipInfo.whatsappNumber,
    "Olá! Estou navegando no site da AutoPrime Veículos e gostaria de falar com um consultor comercial."
  );

  return (
    <div className="floating-whatsapp-container">
      <a 
        href={whatsAppUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-whatsapp-btn"
        aria-label="Falar no WhatsApp com a AutoPrime"
        title="Falar no WhatsApp"
      >
        <span className="floating-whatsapp-pulse"></span>
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
