import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { dealershipInfo } from '../data/vehiclesData';
import { generateWhatsAppLink } from '../utils/formatters';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Dúvidas sobre o estoque',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `Olá AutoPrime! Mensagem enviada pelo site:\nNome: ${form.name}\nEmail: ${form.email}\nTelefone: ${form.phone}\nAssunto: ${form.subject}\nMensagem: ${form.message}`;
    const url = generateWhatsAppLink(dealershipInfo.whatsappNumber, msg);
    window.open(url, '_blank');
    setSent(true);
  };

  const whatsAppDirect = generateWhatsAppLink(
    dealershipInfo.whatsappNumber,
    "Olá! Gostaria de agendar uma visita ao showroom da AutoPrime Veículos."
  );

  return (
    <div className="contact-page fade-in" style={{ padding: '40px 0 90px 0' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <div className="section-tag">
            <MapPin size={15} />
            <span>Showroom & Atendimento</span>
          </div>
          <h1 className="section-title">
            Fale com a <span className="text-gold-gradient">AutoPrime Veículos</span>
          </h1>
          <p className="section-subtitle">
            Agende uma visita ao nosso showroom ou entre em contato com nossa equipe de consultores especializados. Estamos à disposição para atendê-lo.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Contact Details Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '24px', fontWeight: 800 }}>
              Canais Diretos
            </h2>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
              <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '4px' }}>Endereço do Showroom</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {dealershipInfo.address}<br />
                    Bairro nobre, próximo às principais concessionárias de importados.
                  </p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '4px' }}>Central Telefônica</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {dealershipInfo.phone}
                  </p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(37, 211, 102, 0.15)', color: 'var(--whatsapp)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '4px' }}>WhatsApp Comercial</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {dealershipInfo.whatsappFormatted} (Plantão 7 dias por semana)
                  </p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '4px' }}>Horário de Funcionamento</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {dealershipInfo.hours}
                  </p>
                </div>
              </li>
            </ul>

            <a 
              href={whatsAppDirect} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp" 
              style={{ width: '100%', padding: '14px' }}
            >
              <MessageCircle size={18} />
              <span>Agendar Visita com Consultor VIP</span>
            </a>
          </div>

          {/* Form */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px'
          }}>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '8px', fontWeight: 800 }}>
              Envie uma Mensagem
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Preencha o formulário abaixo e um especialista entrará em contato em menos de 30 minutos.
            </p>

            {sent ? (
              <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(37, 211, 102, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
                <CheckCircle2 size={40} color="var(--whatsapp)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '8px' }}>Mensagem Encaminhada!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nossa equipe de vendas já recebeu sua solicitação e iniciará seu atendimento.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Nome Completo *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      placeholder="Seu nome"
                      value={form.name} 
                      onChange={handleChange}
                      style={{ background: '#12141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', color: '#FFF' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Telefone / WhatsApp *</label>
                    <input 
                      type="text" 
                      name="phone" 
                      required 
                      placeholder="(11) 99999-9999"
                      value={form.phone} 
                      onChange={handleChange}
                      style={{ background: '#12141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', color: '#FFF' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>E-mail (Opcional)</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="seu.email@exemplo.com"
                      value={form.email} 
                      onChange={handleChange}
                      style={{ background: '#12141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', color: '#FFF' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Assunto</label>
                    <select 
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      style={{ background: '#12141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', color: '#FFF', cursor: 'pointer' }}
                    >
                      <option value="Dúvidas sobre o estoque">Dúvidas sobre o estoque</option>
                      <option value="Simulação de Financiamento">Simulação de Financiamento</option>
                      <option value="Avaliação de Usado na Troca">Avaliação de Usado na Troca</option>
                      <option value="Agendamento de Visita ao Showroom">Agendamento de Visita ao Showroom</option>
                      <option value="Outros Assuntos">Outros Assuntos</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Mensagem</label>
                  <textarea 
                    name="message" 
                    rows={4}
                    placeholder="Como podemos te ajudar hoje?"
                    value={form.message} 
                    onChange={handleChange}
                    style={{ background: '#12141C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', color: '#FFF', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '14px', marginTop: '6px' }}>
                  <Send size={18} />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
