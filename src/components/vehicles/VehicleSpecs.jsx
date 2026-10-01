import React from 'react';
import { 
  Zap, 
  Activity, 
  Compass, 
  Fuel, 
  Cog, 
  Calendar, 
  Gauge, 
  Paintbrush, 
  FileText, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { formatKm } from '../../utils/formatters';
import './VehicleSpecs.css';

export default function VehicleSpecs({ vehicle }) {
  const {
    brand,
    model,
    version,
    year,
    mileage,
    engine,
    torque,
    acceleration,
    topSpeed,
    consumption,
    transmission,
    fuel,
    color,
    doors,
    plateEnd,
    description,
    features = []
  } = vehicle;

  const techItems = [
    { label: 'Motorização', value: engine || 'Consulte', icon: Zap },
    { label: 'Torque Máximo', value: torque || 'Consulte', icon: Activity },
    { label: 'Aceleração 0-100', value: acceleration || 'Consulte', icon: Compass },
    { label: 'Velocidade Máxima', value: topSpeed || 'Consulte', icon: Gauge },
    { label: 'Consumo Médio', value: consumption || 'Consulte', icon: Fuel },
    { label: 'Câmbio / Marchas', value: transmission, icon: Cog },
    { label: 'Ano de Fabricação', value: year, icon: Calendar },
    { label: 'Quilometragem', value: formatKm(mileage), icon: Gauge },
    { label: 'Cor Exterior', value: color, icon: Paintbrush },
    { label: 'Final da Placa', value: plateEnd ? `Final ${plateEnd}` : 'Consulte', icon: FileText }
  ];

  return (
    <div className="specs-container">
      {/* Description Block */}
      {description && (
        <div className="specs-block">
          <h3 className="specs-block-title">
            <FileText size={20} />
            Descrição do Especialista
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.96rem' }}>
            {description}
          </p>
        </div>
      )}

      {/* Technical Grid Block */}
      <div className="specs-block">
        <h3 className="specs-block-title">
          <Zap size={20} />
          Ficha Técnica & Desempenho
        </h3>
        <div className="technical-grid">
          {techItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="tech-spec-item">
                <div className="tech-icon-wrap">
                  <Icon size={18} />
                </div>
                <div className="tech-meta">
                  <span className="tech-label">{item.label}</span>
                  <span className="tech-value">{item.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment and Features */}
      {features.length > 0 && (
        <div className="specs-block">
          <h3 className="specs-block-title">
            <ShieldCheck size={20} />
            Itens de Série & Opcionais Exclusivos
          </h3>
          <div className="features-list-grid">
            {features.map((feat, idx) => (
              <div key={idx} className="feature-check-item">
                <CheckCircle2 size={16} />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
