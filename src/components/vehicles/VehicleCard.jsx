import React from 'react';
import { Calendar, Gauge, Fuel, Cog, MessageCircle, ArrowRight } from 'lucide-react';
import { formatBRL, formatKm, generateWhatsAppLink } from '../../utils/formatters';
import { dealershipInfo } from '../../data/vehiclesData';
import './VehicleCard.css';

export default function VehicleCard({ vehicle, onSelectVehicle }) {
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
    badges = [],
    images
  } = vehicle;

  const thumbnail = images && images.length > 0 
    ? images[0] 
    : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  const waMessage = `Olá! Gostaria de mais informações sobre o ${brand} ${model} (${year}) anunciado por ${formatBRL(price)} na AutoPrime Veículos.`;
  const waUrl = generateWhatsAppLink(dealershipInfo.whatsappNumber, waMessage);

  return (
    <div className="vehicle-card fade-in">
      {/* Media Wrapper */}
      <div className="card-media-wrapper" onClick={() => onSelectVehicle(vehicle)}>
        <img 
          src={thumbnail} 
          alt={`${brand} ${model}`} 
          className="card-img" 
          loading="lazy"
        />
        <div className="card-gradient-overlay" />

        {/* Badges */}
        <div className="card-badges">
          {badges.map((badge, idx) => (
            <span 
              key={idx} 
              className={badge.includes('Destaque') ? 'badge-gold' : 'badge-dark'}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Category Pill */}
        <div className="card-category-badge">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="card-body">
        <span className="card-brand">{brand}</span>
        <h3 className="card-title" onClick={() => onSelectVehicle(vehicle)} title={`${brand} ${model}`}>
          {model}
        </h3>
        <p className="card-version" title={version}>
          {version}
        </p>

        {/* Specs Highlights */}
        <div className="card-specs-grid">
          <div className="card-spec-item" title="Ano de Fabricação / Modelo">
            <Calendar size={15} />
            <span>{year}</span>
          </div>
          <div className="card-spec-item" title="Quilometragem">
            <Gauge size={15} />
            <span>{formatKm(mileage)}</span>
          </div>
          <div className="card-spec-item" title="Transmissão">
            <Cog size={15} />
            <span>{transmission.split(' ')[0]}</span>
          </div>
          <div className="card-spec-item" title="Combustível">
            <Fuel size={15} />
            <span>{fuel.split('/')[0]}</span>
          </div>
        </div>

        {/* Footer / Price */}
        <div className="card-footer">
          <div className="card-price-row">
            <span className="price-label">Valor à vista</span>
            <span className="price-value text-gold-gradient">{formatBRL(price)}</span>
          </div>

          <div className="card-actions">
            <button 
              className="btn btn-details" 
              onClick={() => onSelectVehicle(vehicle)}
            >
              <span>Ver Detalhes</span>
              <ArrowRight size={15} />
            </button>

            <a 
              href={waUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-card-wa"
              title="Negociar este veículo no WhatsApp"
              aria-label="Negociar este veículo no WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
