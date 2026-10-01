import React from 'react';
import TradeInSection from '../components/home/TradeInSection';
import { ArrowLeftRight, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export default function TradeInPage({ onNavigateCatalog }) {
  return (
    <div className="trade-in-page fade-in" style={{ padding: '40px 0 90px 0' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <div className="section-tag">
            <ArrowLeftRight size={15} />
            <span>Avaliação Profissional</span>
          </div>
          <h1 className="section-title">
            Venda ou Troque seu <span className="text-gold-gradient">Seminovo</span>
          </h1>
          <p className="section-subtitle">
            Garantimos a melhor avaliação do seu seminovo com pagamento à vista ou utilizando o valor como entrada em qualquer carro do nosso estoque.
          </p>
        </div>

        {/* Benefits Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <DollarSign size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '8px' }}>Pagamento Instantâneo via PIX</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Após vistoria e conferência documental, os recursos caem na sua conta bancária na hora.</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '8px' }}>Sem Burocracia ou Riscos</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Evite encontros com estranhos na internet. Negociação 100% segura dentro do nosso showroom blindado.</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '8px' }}>Quitamos seu Financiamento</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Se o seu veículo ainda possui dívidas ou consórcio pendente, nós liquidamos junto à instituição bancária.</p>
          </div>
        </div>

        {/* Embedded Trade In Form */}
        <TradeInSection />
      </div>
    </div>
  );
}
