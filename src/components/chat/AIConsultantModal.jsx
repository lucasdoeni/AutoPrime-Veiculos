import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  RotateCcw, 
  MessageCircle, 
  ArrowRight, 
  Check 
} from 'lucide-react';
import CallbotIcon from './CallbotIcon';
import { analyzeUserQuery, generateAdvisorResponse } from '../../utils/aiConsultant.js';
import { formatBRL, formatKm, generateWhatsAppLink } from '../../utils/formatters.js';
import { dealershipInfo } from '../../data/vehiclesData.js';
import './AIConsultantModal.css';

const QUICK_PROMPTS = [
  "Procuro um SUV de luxo para a família",
  "Quais são os modelos blindados disponíveis?",
  "Quero um esportivo V8 potente",
  "Carros híbridos ou elétricos",
  "Opções até R$ 500 mil",
  "Sedã premium confortável"
];

export default function AIConsultantModal({ vehicles = [], onSelectVehicle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Olá! Sou seu **Consultor Virtual Inteligente da AutoPrime**. Diga-me o que você procura (categoria, valor, se precisa de blindado ou para família) e recomendarei as opções exatas do nosso acervo.",
      vehicles: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend = null) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // AI thinking delay
    setTimeout(() => {
      const analysis = analyzeUserQuery(query, vehicles);
      const botResponse = generateAdvisorResponse(query, analysis, vehicles);

      const aiMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        vehicles: botResponse.vehicles,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        text: "Conversa reiniciada. Como posso te auxiliar a encontrar seu próximo veículo de luxo?",
        vehicles: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCarDetailsClick = (vehicle) => {
    onSelectVehicle(vehicle);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Callbot Icon Button */}
      {!isOpen && (
        <button 
          type="button"
          className="ai-callbot-floating-btn" 
          onClick={() => setIsOpen(true)}
          title="Falar com o Consultor Virtual IA"
          aria-label="Abrir Consultor Virtual IA"
        >
          <span className="ai-callbot-pulse"></span>
          <CallbotIcon size={26} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-profile">
              <div className="ai-avatar">
                <CallbotIcon size={24} />
              </div>
              <div className="ai-header-text">
                <h3>AutoPrime AI</h3>
                <div className="ai-status-indicator">
                  <span className="ai-status-dot"></span>
                  <span>Consultor Virtual • Estoque ao Vivo</span>
                </div>
              </div>
            </div>

            <div className="ai-header-actions">
              <button 
                type="button"
                className="ai-action-btn" 
                onClick={handleResetChat}
                title="Reiniciar conversa"
              >
                <RotateCcw size={15} />
              </button>
              <button 
                type="button"
                className="ai-action-btn" 
                onClick={() => setIsOpen(false)}
                title="Fechar chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="ai-messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-msg-row ${msg.sender}`}>
                <div className="ai-bubble">
                  {/* Text formatted with linebreaks */}
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </div>

                  {/* Render Recommended Vehicle Cards if present */}
                  {msg.vehicles && msg.vehicles.length > 0 && (
                    <div className="ai-car-cards-list">
                      {msg.vehicles.map((car) => {
                        const thumb = car.images && car.images[0] ? car.images[0] : '';
                        const waMsg = `Olá! O Consultor Virtual de IA me recomendou o ${car.brand} ${car.model} (${car.year}) anunciado por ${formatBRL(car.price)} na AutoPrime. Gostaria de saber mais!`;
                        const waLink = generateWhatsAppLink(dealershipInfo.whatsappNumber, waMsg);

                        return (
                          <div key={car.id} className="ai-car-card">
                            <div className="ai-car-header">
                              <img src={thumb} alt={car.model} className="ai-car-thumb" />
                              <div className="ai-car-info">
                                <span className="ai-car-title">{car.brand} {car.model}</span>
                                <span className="ai-car-meta">{car.year} • {formatKm(car.mileage)} • {car.category}</span>
                                <span className="ai-car-price">{formatBRL(car.price)}</span>
                              </div>
                            </div>

                            <div className="ai-car-actions">
                              <button 
                                type="button"
                                className="ai-car-btn-details"
                                onClick={() => handleCarDetailsClick(car)}
                              >
                                Ver Ficha Completa
                              </button>
                              <a 
                                href={waLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="ai-car-btn-wa"
                                title="Negociar este carro no WhatsApp"
                              >
                                <MessageCircle size={15} />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <span className="ai-msg-time">{msg.timestamp}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="ai-msg-row bot">
                <div className="ai-typing-indicator">
                  <span className="ai-typing-dot"></span>
                  <span className="ai-typing-dot"></span>
                  <span className="ai-typing-dot"></span>
                </div>
              </div>
            )}

            {/* Quick Prompts below first message */}
            {messages.length === 1 && !isTyping && (
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Perguntas Sugeridas:
                </span>
                <div className="ai-quick-chips">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button 
                      key={idx} 
                      type="button"
                      className="ai-chip-btn"
                      onClick={() => handleSendMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form 
            className="ai-chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input 
              type="text" 
              placeholder="Digite o que procura no estoque..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="ai-input-field"
              autoFocus
            />
            <button 
              type="submit" 
              className="ai-send-btn"
              disabled={!inputText.trim() || isTyping}
              aria-label="Enviar mensagem"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
