import React, { useState } from 'react';
import { Calculator, MessageCircle, ShieldCheck, Check } from 'lucide-react';
import { formatBRL, generateWhatsAppLink } from '../../utils/formatters';
import { dealershipInfo } from '../../data/vehiclesData';
import './FinancingSection.css';

export default function FinancingSection({ defaultPrice = 500000, vehicleName = null }) {
  const [vehicleValue, setVehicleValue] = useState(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [months, setMonths] = useState(48);

  // Calculations
  const downPaymentAmount = (vehicleValue * downPaymentPercent) / 100;
  const financedAmount = vehicleValue - downPaymentAmount;

  // Realistic monthly installment with estimated coefficient for premium vehicle financing (~1.39% a.m.)
  const monthlyRate = 0.0139;
  const installmentValue = 
    financedAmount > 0 
      ? (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : 0;

  const totalFinancedWithInterest = installmentValue * months;

  const handleWhatsAppSimulation = () => {
    let msg = `Olá! Gostaria de uma simulação de financiamento na AutoPrime Veículos.\n`;
    if (vehicleName) {
      msg += `Veículo: ${vehicleName}\n`;
    }
    msg += `Valor Total: ${formatBRL(vehicleValue)}\n`;
    msg += `Entrada (${downPaymentPercent}%): ${formatBRL(downPaymentAmount)}\n`;
    msg += `Prazo: ${months}x de aproximadamente ${formatBRL(installmentValue)}`;

    const url = generateWhatsAppLink(dealershipInfo.whatsappNumber, msg);
    window.open(url, '_blank');
  };

  return (
    <section className="financing-section" id="financiamento">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Calculator size={15} />
            <span>Condições Exclusivas</span>
          </div>
          <h2 className="section-title">
            Simulador de <span className="text-gold-gradient">Financiamento Premium</span>
          </h2>
          <p className="section-subtitle">
            Trabalhamos com os principais bancos privados e taxas diferenciadas para o segmento de luxo. Simule agora e envie sua proposta para aprovação rápida.
          </p>
        </div>

        <div className="financing-card">
          {/* Controls Left */}
          <div className="financing-controls">
            {/* Vehicle Value Slider / Input */}
            <div className="simulator-field">
              <div className="simulator-label-row">
                <span className="sim-label">Valor do Veículo</span>
                <span className="sim-display-value">{formatBRL(vehicleValue)}</span>
              </div>
              <input 
                type="range" 
                min="100000" 
                max="1500000" 
                step="10000"
                value={vehicleValue}
                onChange={(e) => setVehicleValue(Number(e.target.value))}
                className="sim-range"
              />
            </div>

            {/* Down payment Percent */}
            <div className="simulator-field">
              <div className="simulator-label-row">
                <span className="sim-label">Entrada ({downPaymentPercent}%)</span>
                <span className="sim-display-value">{formatBRL(downPaymentAmount)}</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="80" 
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="sim-range"
              />
            </div>

            {/* Installments Selector */}
            <div className="simulator-field">
              <span className="sim-label">Prazo de Pagamento</span>
              <div className="installments-selector">
                {[24, 36, 48, 60].map((term) => (
                  <button
                    key={term}
                    type="button"
                    className={`installment-btn ${months === term ? 'active' : ''}`}
                    onClick={() => setMonths(term)}
                  >
                    {term} meses
                  </button>
                ))}
              </div>
            </div>

            {/* Trust bullet points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--gold-primary)" />
                <span>Aprovação de crédito em até 2 horas úteis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--gold-primary)" />
                <span>Possibilidade de incluir o seu usado na troca como entrada</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Check size={16} color="var(--gold-primary)" />
                <span>Parceria com Santander, Safra, BV, Itaú Personnalité e Bradesco Prime</span>
              </div>
            </div>
          </div>

          {/* Result Box Right */}
          <div className="financing-summary-box">
            <div>
              <div className="summary-header">
                <span className="summary-tag">Resultado da Simulação</span>
                <h3 className="summary-title">Parcela Estimada</h3>
              </div>

              <div className="installment-result">
                <p className="result-caption">Parcelas Mensais</p>
                <div className="result-amount text-gold-gradient">
                  {formatBRL(installmentValue)}
                </div>
                <p className="result-terms">Plano em {months} parcelas fixas</p>
              </div>

              <ul className="financing-details-list">
                <li className="financing-detail-row">
                  <span>Valor do Veículo:</span>
                  <strong>{formatBRL(vehicleValue)}</strong>
                </li>
                <li className="financing-detail-row">
                  <span>Valor da Entrada ({downPaymentPercent}%):</span>
                  <strong>{formatBRL(downPaymentAmount)}</strong>
                </li>
                <li className="financing-detail-row">
                  <span>Saldo a Financiar:</span>
                  <strong>{formatBRL(financedAmount)}</strong>
                </li>
              </ul>
            </div>

            <div>
              <button 
                type="button" 
                className="btn btn-whatsapp" 
                style={{ width: '100%', padding: '14px' }}
                onClick={handleWhatsAppSimulation}
              >
                <MessageCircle size={20} />
                <span>Enviar Simulação para Análise</span>
              </button>
              <p className="disclaimer-text">
                *Simulação ilustrativa sujeita à análise de crédito e tabela de pontuação dos agentes financeiros conveniados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
