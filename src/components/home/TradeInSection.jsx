import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import { dealershipInfo } from '../../data/vehiclesData';
import { generateWhatsAppLink } from '../../utils/formatters';
import './TradeInSection.css';

export default function TradeInSection() {
  const [formData, setFormData] = useState({
    carModel: '',
    carYear: '',
    carKm: '',
    condition: 'Excelente (Sem detalhes)',
    notes: '',
    clientName: '',
    clientPhone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.carModel) {
      alert('Por favor, informe ao menos a marca e o modelo do seu veículo.');
      return;
    }

    const message = 
      `Olá AutoPrime! Gostaria de solicitar a avaliação do meu veículo usado para troca/venda.\n\n` +
      `🚗 Veículo: ${formData.carModel}\n` +
      `📅 Ano/Modelo: ${formData.carYear || 'Não informado'}\n` +
      `⏱️ Quilometragem: ${formData.carKm ? formData.carKm + ' km' : 'Não informada'}\n` +
      `⭐ Estado de conservação: ${formData.condition}\n` +
      `📝 Detalhes/Opcionais: ${formData.notes || 'Nenhum'}\n` +
      `👤 Nome do cliente: ${formData.clientName || 'Cliente AutoPrime'}\n` +
      `📞 Telefone/WhatsApp: ${formData.clientPhone || 'Mesmo número do chat'}`;

    const url = generateWhatsAppLink(dealershipInfo.whatsappNumber, message);
    window.open(url, '_blank');
  };

  return (
    <section className="tradein-section" id="avaliar-usado">
      <div className="container">
        <div className="tradein-card">
          <div className="tradein-grid">
            {/* Left Info */}
            <div className="tradein-info">
              <div className="section-tag" style={{ width: 'fit-content' }}>
                <ArrowLeftRight size={14} />
                <span>Troca & Compra Direta</span>
              </div>

              <h2 className="tradein-title">
                Quer vender ou dar seu carro como <span className="text-gold-gradient">entrada?</span>
              </h2>

              <p className="tradein-desc">
                Na AutoPrime Veículos valorizamos o seu patrimônio. Realizamos avaliação justa, com pagamento à vista via TED/PIX imediato ou excelente bonificação na troca por qualquer unidade do nosso acervo.
              </p>

              <div className="tradein-perks">
                <div className="tradein-perk-item">
                  <div className="tradein-perk-icon">
                    <Zap size={16} />
                  </div>
                  <span>Avaliação preliminar pelo WhatsApp em poucos minutos</span>
                </div>
                <div className="tradein-perk-item">
                  <div className="tradein-perk-icon">
                    <ShieldCheck size={16} />
                  </div>
                  <span>Segurança jurídica total e quitação imediata de dívidas</span>
                </div>
                <div className="tradein-perk-item">
                  <div className="tradein-perk-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Pegamos seu veículo blindado ou importado na troca</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <form className="tradein-form" onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: '700' }}>
                Preencha os dados do seu veículo
              </h3>

              <div className="tradein-form-row">
                <div className="tradein-input-group">
                  <label>Marca & Modelo *</label>
                  <input 
                    type="text" 
                    name="carModel"
                    required
                    placeholder="Ex: BMW 320i M Sport"
                    value={formData.carModel}
                    onChange={handleChange}
                    className="tradein-input"
                  />
                </div>
                <div className="tradein-input-group">
                  <label>Ano de Fabricação / Modelo</label>
                  <input 
                    type="text" 
                    name="carYear"
                    placeholder="Ex: 2021/2022"
                    value={formData.carYear}
                    onChange={handleChange}
                    className="tradein-input"
                  />
                </div>
              </div>

              <div className="tradein-form-row">
                <div className="tradein-input-group">
                  <label>Quilometragem Aproximada</label>
                  <input 
                    type="text" 
                    name="carKm"
                    placeholder="Ex: 35.000"
                    value={formData.carKm}
                    onChange={handleChange}
                    className="tradein-input"
                  />
                </div>
                <div className="tradein-input-group">
                  <label>Estado Geral de Conservação</label>
                  <select 
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="tradein-input"
                  >
                    <option value="Excelente (Sem detalhes)">Excelente (Sem detalhes)</option>
                    <option value="Muito Bom (Pequenos desgastes)">Muito Bom (Pequenos desgastes)</option>
                    <option value="Regular (Necessita de revisão)">Regular (Necessita de revisão)</option>
                    <option value="Blindado com garantia">Blindado com garantia</option>
                  </select>
                </div>
              </div>

              <div className="tradein-form-row">
                <div className="tradein-input-group">
                  <label>Seu Nome</label>
                  <input 
                    type="text" 
                    name="clientName"
                    placeholder="Como podemos lhe chamar?"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="tradein-input"
                  />
                </div>
                <div className="tradein-input-group">
                  <label>Seu Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    name="clientPhone"
                    placeholder="(11) 99999-9999"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    className="tradein-input"
                  />
                </div>
              </div>

              <div className="tradein-input-group">
                <label>Observações ou Opcionais Importantes (Opcional)</label>
                <textarea 
                  name="notes"
                  placeholder="Ex: Único dono, todas revisões na concessionária, teto solar, pneu novos..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="tradein-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '14px', marginTop: '6px' }}>
                <MessageSquare size={18} />
                <span>Enviar para Avaliação Imediata</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
