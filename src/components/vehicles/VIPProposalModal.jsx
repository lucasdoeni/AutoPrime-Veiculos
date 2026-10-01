import React, { useState } from 'react';
import { 
  Shield, 
  Printer, 
  X, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Award, 
  ShieldCheck 
} from 'lucide-react';
import { formatBRL, formatKm } from '../../utils/formatters.js';
import { dealershipInfo } from '../../data/vehiclesData.js';
import './VIPProposalModal.css';

export default function VIPProposalModal({ isOpen, onClose, vehicle }) {
  const [clientName, setClientName] = useState('Cliente VIP');

  if (!isOpen || !vehicle) return null;

  const {
    id,
    brand,
    model,
    version,
    year,
    mileage,
    price,
    color,
    transmission,
    fuel,
    engine,
    torque,
    acceleration,
    topSpeed,
    plateEnd,
    images = [],
    features = []
  } = vehicle;

  const photo = images && images.length > 0 ? images[0] : '';
  const proposalId = `AP-${year}-${id.slice(0, 5).toUpperCase()}`;

  const today = new Date().toLocaleDateString('pt-BR');
  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');

  // Down payment & installment simulation
  const downPayment = price * 0.3;
  const estimatedInstallment = Math.round(((price - downPayment) * 0.029));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="vip-proposal-wrapper">
        {/* Control Toolbar */}
        <div className="vip-proposal-toolbar">
          <div className="vip-client-name-input-group">
            <label>Personalizar Proposta Para:</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome do cliente"
              className="vip-client-input"
            />
          </div>

          <div className="vip-toolbar-actions">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ padding: '8px 18px', fontSize: '0.86rem' }}
            >
              <Printer size={16} />
              <span>Salvar em PDF / Imprimir</span>
            </button>

            <button 
              type="button" 
              className="btn btn-outline-white"
              onClick={onClose}
              style={{ padding: '8px 14px', fontSize: '0.86rem' }}
            >
              <X size={16} />
              <span>Fechar</span>
            </button>
          </div>
        </div>

        {/* Printable Document Viewport */}
        <div className="vip-doc-scroll-viewport">
          <div className="vip-document" id="vip-proposal-document">
            {/* Document Header */}
            <div className="vip-doc-header">
              <div className="vip-doc-brand">
                <div className="vip-doc-logo-box">
                  <Shield size={20} />
                </div>
                <div>
                  <div className="vip-doc-brand-title">
                    AUTOPRIME <span>VEÍCULOS</span>
                  </div>
                  <div className="vip-doc-brand-sub">Luxury & Performance</div>
                </div>
              </div>

              <div className="vip-doc-meta">
                <div className="vip-proposal-number">PROPOSTA {proposalId}</div>
                <div>Data de Emissão: {today}</div>
                <div>Validade: {validUntil} (7 dias)</div>
              </div>
            </div>

            {/* Target Client Banner */}
            <div className="vip-client-banner">
              <div>
                <span style={{ fontSize: '0.74rem', color: '#647087', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
                  Dossiê Comercial Elaborado Para:
                </span>
                <strong>{clientName || 'Cliente VIP'}</strong>
              </div>
              <div className="vip-validity-tag">
                Condições Exclusivas de Showroom
              </div>
            </div>

            {/* Car Presentation Hero */}
            <div className="vip-car-hero">
              <img src={photo} alt={`${brand} ${model}`} className="vip-car-photo" />

              <div className="vip-car-headline">
                <span style={{ color: '#8C6D14', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {brand}
                </span>
                <h2>{model}</h2>
                <p>{version} • Ano {year}</p>

                <div className="vip-price-callout">
                  <span className="vip-price-lbl">Valor Especial da Proposta</span>
                  <div className="vip-price-num">{formatBRL(price)}</div>
                  <span style={{ fontSize: '0.74rem', color: '#707585', marginTop: '2px', display: 'block' }}>
                    Entrada sugerida de 30% ({formatBRL(downPayment)}) + parcelas estimadas em 48x de {formatBRL(estimatedInstallment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Sheet Table */}
            <h3 className="vip-section-heading">
              <FileText size={15} color="#A8841B" />
              <span>Ficha Técnica & Desempenho</span>
            </h3>

            <table className="vip-specs-table">
              <tbody>
                <tr>
                  <td><span>Motorização:</span> <strong>{engine || 'Consulte'}</strong></td>
                  <td><span>Potência / Torque:</span> <strong>{torque || 'Consulte'}</strong></td>
                </tr>
                <tr>
                  <td><span>Aceleração (0-100 km/h):</span> <strong>{acceleration || 'Consulte'}</strong></td>
                  <td><span>Velocidade Máxima:</span> <strong>{topSpeed || 'Consulte'}</strong></td>
                </tr>
                <tr>
                  <td><span>Câmbio / Transmissão:</span> <strong>{transmission}</strong></td>
                  <td><span>Combustível:</span> <strong>{fuel}</strong></td>
                </tr>
                <tr>
                  <td><span>Quilometragem Atestada:</span> <strong>{formatKm(mileage)}</strong></td>
                  <td><span>Cor Exterior / Placa:</span> <strong>{color} (Final {plateEnd})</strong></td>
                </tr>
              </tbody>
            </table>

            {/* Main Options / Features */}
            {features.length > 0 && (
              <>
                <h3 className="vip-section-heading">
                  <Award size={15} color="#A8841B" />
                  <span>Opcionais e Itens de Série Incluídos</span>
                </h3>
                <div className="vip-features-grid">
                  {features.slice(0, 8).map((feat, idx) => (
                    <div key={idx} className="vip-feat-item">
                      <CheckCircle2 size={13} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Certifications & Guarantees */}
            <div className="vip-guarantees-bar">
              <div className="vip-guarantee-col">
                <CheckCircle2 size={14} />
                <span>Laudo Cautelar 100% Aprovado</span>
              </div>
              <div className="vip-guarantee-col">
                <ShieldCheck size={14} />
                <span>1 Ano de Garantia Motor e Câmbio</span>
              </div>
              <div className="vip-guarantee-col">
                <CheckCircle2 size={14} />
                <span>Manual & Chave Reserva</span>
              </div>
              <div className="vip-guarantee-col">
                <CheckCircle2 size={14} />
                <span>IPVA Quitado</span>
              </div>
            </div>

            {/* Footer Signatures & Contacts */}
            <div className="vip-doc-footer">
              <div>
                <p><strong>AutoPrime Veículos Ltda.</strong> — {dealershipInfo.address}</p>
                <p>Telefone: {dealershipInfo.phone} • WhatsApp: {dealershipInfo.whatsappFormatted}</p>
                <p>{dealershipInfo.email} • {dealershipInfo.hours}</p>
              </div>

              <div className="vip-signature-line">
                Consultor Responsável AutoPrime
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
