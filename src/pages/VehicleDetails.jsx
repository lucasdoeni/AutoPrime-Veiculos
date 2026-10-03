import React, { useState, useRef } from 'react';
import { 
  Home as HomeIcon, 
  ChevronRight, 
  MessageCircle, 
  PhoneCall, 
  ShieldCheck, 
  Calendar, 
  Gauge, 
  FileText, 
  Calculator, 
  Share2, 
  Check, 
  ArrowLeft,
  FileDown,
  Camera,
  RotateCw,
  Sparkles
} from 'lucide-react';
import VehicleGallery from '../components/vehicles/VehicleGallery';
import VehicleSpecs from '../components/vehicles/VehicleSpecs';
import VehicleCard from '../components/vehicles/VehicleCard';
import FinancingSection from '../components/home/FinancingSection';
import VIPProposalModal from '../components/vehicles/VIPProposalModal';
import Showroom360Viewer from '../components/vehicles/Showroom360Viewer';
import { formatBRL, formatKm, generateWhatsAppLink } from '../utils/formatters';
import { dealershipInfo, vehiclesData } from '../data/vehiclesData';

export default function VehicleDetails({ 
  vehicle, 
  vehicles = vehiclesData,
  onBack, 
  onSelectVehicle, 
  onNavigateHome, 
  onNavigateCatalog 
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [mediaMode, setMediaMode] = useState('showroom360');
  const proposalRef = useRef(null);

  if (!vehicle) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Nenhum veículo selecionado.</h2>
        <button className="btn btn-primary" onClick={onNavigateCatalog} style={{ marginTop: '20px' }}>
          Voltar ao Estoque
        </button>
      </div>
    );
  }

  const {
    id,
    brand,
    model,
    version,
    year,
    mileage,
    price,
    category,
    transmission,
    fuel,
    color,
    plateEnd,
    badges = [],
    images = []
  } = vehicle;

  const whatsAppMessage = `Olá! Tenho muito interesse no ${brand} ${model} (${year}), anunciado no site da AutoPrime Veículos pelo valor de ${formatBRL(price)}. Gostaria de verificar a disponibilidade e condições de pagamento.`;
  const whatsAppUrl = generateWhatsAppLink(dealershipInfo.whatsappNumber, whatsAppMessage);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Find related vehicles (same category or same brand, excluding current vehicle)
  const relatedVehicles = vehicles
    .filter(v => v.id !== id && (v.category === category || v.brand === brand))
    .slice(0, 3);

  return (
    <div className="vehicle-details-page fade-in" style={{ padding: '36px 0 90px 0' }}>
      <div className="container">
        {/* Breadcrumbs & Back Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <button 
              onClick={onNavigateHome}
              style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <HomeIcon size={14} /> Início
            </button>
            <ChevronRight size={14} />
            <button 
              onClick={onNavigateCatalog}
              style={{ color: 'var(--text-secondary)' }}
            >
              Estoque
            </button>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{brand} {model}</span>
          </div>

          <button 
            onClick={onBack}
            className="btn btn-outline-white"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Estoque</span>
          </button>
        </div>

        {/* Top Title Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
              {brand}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{category}</span>
            {badges.map((b, i) => (
              <span key={i} className="badge-gold" style={{ marginLeft: '6px' }}>{b}</span>
            ))}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>
            {model}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            {version}
          </p>
        </div>

        {/* 2-Columns Main Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Gallery & Technical Specs */}
          <div>
            {/* Media View Mode Switcher: Galeria vs Showroom 360° */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '6px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              width: 'fit-content',
              flexWrap: 'wrap'
            }}>
              <button
                type="button"
                onClick={() => setMediaMode('showroom360')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: mediaMode === 'showroom360' ? '1px solid var(--gold-primary)' : '1px solid transparent',
                  cursor: 'pointer',
                  background: mediaMode === 'showroom360' 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.08) 100%)' 
                    : 'transparent',
                  color: mediaMode === 'showroom360' ? 'var(--gold-primary)' : '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: mediaMode === 'showroom360' ? '0 0 15px rgba(212, 175, 55, 0.2)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <RotateCw size={15} color={mediaMode === 'showroom360' ? 'var(--gold-primary)' : '#94A3B8'} />
                <span>Showroom 360° & Modo Noturno</span>
                <span style={{ 
                  background: 'var(--gold-primary)', 
                  color: '#0B0C10', 
                  fontSize: '0.65rem', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  letterSpacing: '0.05em'
                }}>EXCLUSIVO</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaMode('gallery')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: mediaMode === 'gallery' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  background: mediaMode === 'gallery' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: mediaMode === 'gallery' ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.25s ease'
                }}
              >
                <Camera size={15} />
                <span>Galeria de Fotos ({images.length})</span>
              </button>
            </div>

            {/* Media Area: Showroom 360 or Traditional Gallery */}
            <div style={{ marginBottom: '40px' }}>
              {mediaMode === 'showroom360' ? (
                <Showroom360Viewer vehicle={vehicle} />
              ) : (
                <VehicleGallery images={images} altText={`${brand} ${model}`} />
              )}
            </div>

            {/* Technical Sheet & Equipments */}
            <VehicleSpecs vehicle={vehicle} />
          </div>

          {/* Right Column: Sticky Commercial Panel */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              {/* Quick Specs Chips */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} color="var(--gold-primary)" />
                  <span>Ano: <strong style={{ color: '#FFF' }}>{year}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <Gauge size={16} color="var(--gold-primary)" />
                  <span>Km: <strong style={{ color: '#FFF' }}>{formatKm(mileage)}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <FileText size={16} color="var(--gold-primary)" />
                  <span>Câmbio: <strong style={{ color: '#FFF' }}>{transmission.split(' ')[0]}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={16} color="var(--gold-primary)" />
                  <span>Placa: <strong style={{ color: '#FFF' }}>Final {plateEnd}</strong></span>
                </div>
              </div>

              {/* Price Row */}
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Preço Especial à Vista
                </span>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.2rem, 3vw, 2.75rem)',
                  fontWeight: 900,
                  marginTop: '4px'
                }} className="text-gold-gradient">
                  {formatBRL(price)}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Aceitamos seu veículo seminovo na troca com avaliação imediata.
                </p>
              </div>

              {/* Conversion CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <a 
                  href={whatsAppUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-whatsapp"
                  style={{ padding: '16px', fontSize: '1rem', width: '100%' }}
                >
                  <MessageCircle size={22} />
                  <span>Falar com Vendedor no WhatsApp</span>
                </a>

                <button 
                  type="button" 
                  className="btn btn-outline-gold"
                  style={{ width: '100%', padding: '14px' }}
                  onClick={() => setShowFinancingModal(!showFinancingModal)}
                >
                  <Calculator size={18} />
                  <span>{showFinancingModal ? 'Ocultar Simulador' : 'Simular Financiamento Deste Veículo'}</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-outline-gold"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    background: showProposalModal ? 'rgba(212, 175, 55, 0.18)' : 'rgba(212, 175, 55, 0.08)',
                    borderColor: 'var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onClick={() => {
                    const next = !showProposalModal;
                    setShowProposalModal(next);
                    if (next) {
                      setTimeout(() => {
                        proposalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }, 100);
                    }
                  }}
                >
                  <FileDown size={19} color="var(--gold-primary)" />
                  <span style={{ fontWeight: 600 }}>
                    {showProposalModal ? 'Ocultar Proposta VIP' : 'Gerar Proposta VIP / Ficha PDF'}
                  </span>
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <a 
                    href={`tel:${dealershipInfo.phone.replace(/\D/g, '')}`}
                    className="btn btn-outline-white"
                    style={{ fontSize: '0.85rem', padding: '10px' }}
                  >
                    <PhoneCall size={16} />
                    <span>Ligar para Loja</span>
                  </a>

                  <button 
                    type="button" 
                    className="btn btn-outline-white"
                    onClick={handleShare}
                    style={{ fontSize: '0.85rem', padding: '10px' }}
                  >
                    {copiedLink ? <Check size={16} color="var(--whatsapp)" /> : <Share2 size={16} />}
                    <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
                  </button>
                </div>
              </div>

              {/* Certifications and Guarantees Box */}
              <div style={{
                background: 'rgba(11, 12, 16, 0.6)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '12px', fontWeight: 700 }}>
                  Garantias AutoPrime:
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--gold-primary)" />
                    <span>Laudo Cautelar 100% aprovado sem restrições</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--gold-primary)" />
                    <span>1 Ano de Garantia Nacional de Motor e Câmbio</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--gold-primary)" />
                    <span>Manual do proprietário e chave reserva presencial</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--gold-primary)" />
                    <span>Documentação e IPVA 100% quitados e regularizados</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded VIP Proposal Dossier */}
        {showProposalModal && (
          <div ref={proposalRef} style={{ marginTop: '16px', marginBottom: '20px' }}>
            <VIPProposalModal 
              isOpen={showProposalModal} 
              onClose={() => setShowProposalModal(false)} 
              vehicle={vehicle} 
            />
          </div>
        )}

        {/* Embedded Financing Simulator if clicked */}
        {showFinancingModal && (
          <div style={{ marginTop: '16px', marginBottom: '20px' }}>
            <FinancingSection defaultPrice={price} vehicleName={`${brand} ${model} (${year})`} />
          </div>
        )}

        {/* Related Vehicles Section */}
        {relatedVehicles.length > 0 && (
          <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
              <span className="section-tag">Sugestões Selecionadas</span>
              <h2 className="section-title">
                Veículos Relacionados
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px'
            }}>
              {relatedVehicles.map(rel => (
                <VehicleCard 
                  key={rel.id} 
                  vehicle={rel} 
                  onSelectVehicle={(selected) => {
                    onSelectVehicle(selected);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
