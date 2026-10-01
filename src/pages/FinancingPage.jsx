import React from 'react';
import { Calculator, CheckCircle2, Shield, CreditCard, Clock, FileCheck } from 'lucide-react';
import FinancingSection from '../components/home/FinancingSection';

export default function FinancingPage({ onNavigateCatalog }) {
  return (
    <div className="financing-page fade-in" style={{ padding: '40px 0 90px 0' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <div className="section-tag">
            <CreditCard size={15} />
            <span>Condições Facilitadas</span>
          </div>
          <h1 className="section-title">
            Financiamento de <span className="text-gold-gradient">Veículos de Luxo</span>
          </h1>
          <p className="section-subtitle">
            A AutoPrime Veículos possui correspondentes bancários credenciados nas principais instituições financeiras, assegurando taxas competitivas e agilidade na aprovação de crédito.
          </p>
        </div>

        {/* 4 Steps Process */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '56px'
        }}>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Calculator size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '8px' }}>1. Simulação Online</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ajuste a entrada e o número de parcelas desejado de acordo com seu orçamento.</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <FileCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '8px' }}>2. Envio de Documentos</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Envio digital de CNH e comprovante de residência diretamente para nossa mesa de crédito.</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Clock size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '8px' }}>3. Aprovação Express</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Retorno em até 2 horas úteis com a confirmação do limite e melhores taxas do mercado.</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Shield size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '8px' }}>4. Retirada do Veículo</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Contrato assinado digitalmente e seu novo veículo liberado imediatamente.</p>
          </div>
        </div>

        {/* Embedded Simulator */}
        <FinancingSection />

        <div style={{ marginTop: '56px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Prefere escolher primeiro o veículo do estoque antes de financiar?
          </p>
          <button className="btn btn-outline-gold" onClick={onNavigateCatalog}>
            Explorar Estoque Completo
          </button>
        </div>
      </div>
    </div>
  );
}
