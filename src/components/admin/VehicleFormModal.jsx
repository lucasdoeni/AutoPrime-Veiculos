import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Zap, 
  Car, 
  FileText, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Upload 
} from 'lucide-react';
import { uploadPhotosToAPI } from '../../services/api.js';
import './VehicleFormModal.css';

const DEFAULT_FEATURE_OPTIONS = [
  "Teto Solar Panorâmico Elétrico",
  "Sistema de Som Premium (Harman Kardon / Burmester / BOSE)",
  "Bancos Esportivos em Couro com Memória e Ajustes Elétricos",
  "Bancos Dianteiros com Ventilação e Aquecimento",
  "Faróis Full LED / Matrix com DRL",
  "Câmeras 360 Graus com Assistente de Estacionamento",
  "Piloto Automático Adaptativo (ACC) com Frenagem Autônoma",
  "Painel de Instrumentos 100% Digital Configurável",
  "Tração Integral Permanente (AWD / 4x4 / Quattro / xDrive)",
  "Suspensão Ativa Adaptativa Pneumática",
  "Apple CarPlay e Android Auto sem fio",
  "Carregador de Smartphone por Indução",
  "Blindagem Nível III-A com Vidros Sem Delaminação",
  "Chave Presencial com Partida por Botão Start/Stop"
];

const DEFAULT_BADGE_OPTIONS = [
  "Destaque",
  "Único Dono",
  "Blindado B33",
  "Garantia de Fábrica",
  "Laudo 100% Aprovado",
  "IPVA Pago",
  "Baixa Km",
  "Novo"
];

const COMMON_BRANDS = [
  "Porsche", "BMW", "Mercedes-Benz", "Audi", "Land Rover", "Ford", "Volvo", "Toyota", "Ram", "Ferrari", "Lamborghini", "Maserati", "Jaguar", "Jeep", "Chevrolet", "Volkswagen"
];

export default function VehicleFormModal({ 
  isOpen, 
  onClose, 
  onSaveVehicle, 
  vehicleToEdit = null 
}) {
  const [formData, setFormData] = useState({
    brand: 'Porsche',
    customBrand: '',
    model: '',
    version: '',
    category: 'SUV',
    year: 2023,
    mileage: 15000,
    price: 450000,
    color: 'Preto Metálico',
    plateEnd: '5',
    doors: 4,
    featured: true,
    badges: ['Destaque', 'Único Dono'],
    transmission: 'Automático',
    fuel: 'Gasolina',
    engine: '3.0 Turbo - 340 cv',
    torque: '45 kgfm',
    acceleration: '0 a 100 km/h em 5.2s',
    topSpeed: '250 km/h',
    consumption: 'Urbano: 8.5 km/l | Estrada: 11.2 km/l',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      "Teto Solar Panorâmico Elétrico",
      "Bancos Esportivos em Couro com Memória e Ajustes Elétricos",
      "Faróis Full LED / Matrix com DRL",
      "Apple CarPlay e Android Auto sem fio"
    ],
    description: ''
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [customFeatureInput, setCustomFeatureInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Populate data when editing
  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        ...vehicleToEdit,
        brand: COMMON_BRANDS.includes(vehicleToEdit.brand) ? vehicleToEdit.brand : 'Outra',
        customBrand: COMMON_BRANDS.includes(vehicleToEdit.brand) ? '' : vehicleToEdit.brand,
        badges: vehicleToEdit.badges || [],
        features: vehicleToEdit.features || [],
        images: vehicleToEdit.images || []
      });
    } else {
      // Reset to defaults
      setFormData({
        brand: 'Porsche',
        customBrand: '',
        model: '',
        version: '',
        category: 'SUV',
        year: 2024,
        mileage: 0,
        price: 350000,
        color: 'Preto Obsidian',
        plateEnd: '1',
        doors: 4,
        featured: true,
        badges: ['Destaque', 'Novo'],
        transmission: 'Automático',
        fuel: 'Gasolina',
        engine: '2.0 Turbo - 250 cv',
        torque: '35 kgfm',
        acceleration: '0 a 100 km/h em 6.0s',
        topSpeed: '240 km/h',
        consumption: 'Urbano: 9.0 km/l | Estrada: 13.0 km/l',
        images: [
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
        ],
        features: [
          "Teto Solar Panorâmico Elétrico",
          "Bancos Esportivos em Couro com Memória e Ajustes Elétricos",
          "Faróis Full LED / Matrix com DRL",
          "Apple CarPlay e Android Auto sem fio"
        ],
        description: 'Veículo em estado impecável, com laudo cautelar aprovado e garantia de procedência AutoPrime.'
      });
    }
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleSetCoverImage = (index) => {
    setFormData(prev => {
      const img = prev.images[index];
      const remaining = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: [img, ...remaining]
      };
    });
  };

  const handleSamplePhotos = () => {
    const sampleSet = [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
    ];
    setFormData(prev => ({ ...prev, images: sampleSet }));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const urls = await uploadPhotosToAPI(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
    } catch (err) {
      alert('Erro no upload das fotos para o MySQL: ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const toggleBadge = (badge) => {
    setFormData(prev => {
      const exists = prev.badges.includes(badge);
      return {
        ...prev,
        badges: exists ? prev.badges.filter(b => b !== badge) : [...prev.badges, badge]
      };
    });
  };

  const toggleFeature = (feature) => {
    setFormData(prev => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists ? prev.features.filter(f => f !== feature) : [...prev.features, feature]
      };
    });
  };

  const handleAddCustomFeature = () => {
    if (!customFeatureInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, customFeatureInput.trim()]
    }));
    setCustomFeatureInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.model.trim()) {
      alert('Por favor, informe o modelo do veículo.');
      return;
    }

    const finalBrand = formData.brand === 'Outra' ? (formData.customBrand || 'Outra') : formData.brand;
    const finalId = vehicleToEdit?.id || `${finalBrand.toLowerCase()}-${formData.model.toLowerCase().replace(/\s+/g, '-')}-${formData.year}-${Date.now()}`;

    const newVehicle = {
      ...formData,
      id: finalId,
      brand: finalBrand,
      price: Number(formData.price),
      mileage: Number(formData.mileage),
      year: Number(formData.year),
      doors: Number(formData.doors),
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80']
    };

    onSaveVehicle(newVehicle);
    onClose();
  };

  return (
    <div className="vehicle-form-overlay" onClick={onClose}>
      <div className="vehicle-form-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vehicle-form-header">
          <div className="vehicle-form-header-title">
            <Car size={26} />
            <h2>{vehicleToEdit ? 'Editar Veículo do Estoque' : 'Cadastrar Novo Veículo'}</h2>
          </div>
          <button className="admin-close-btn" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div className="vehicle-form-body">
            {/* 1. Basic Info */}
            <div className="form-section-block">
              <h3 className="form-section-title">
                <Car size={18} />
                <span>1. Dados Principais do Veículo</span>
              </h3>

              <div className="form-row-grid-3">
                <div className="form-field">
                  <label>Marca *</label>
                  <select 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleChange}
                    className="form-select"
                  >
                    {COMMON_BRANDS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="Outra">Outra Marca...</option>
                  </select>
                </div>

                {formData.brand === 'Outra' && (
                  <div className="form-field">
                    <label>Nome da Marca</label>
                    <input 
                      type="text" 
                      name="customBrand" 
                      placeholder="Ex: Aston Martin"
                      value={formData.customBrand} 
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-field">
                  <label>Modelo *</label>
                  <input 
                    type="text" 
                    name="model" 
                    required 
                    placeholder="Ex: 911 Carrera S, X6 M, C300..."
                    value={formData.model} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Versão / Acabamento</label>
                  <input 
                    type="text" 
                    name="version" 
                    placeholder="Ex: 3.0 Bi-Turbo PDK, M Sport..."
                    value={formData.version} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-grid-3">
                <div className="form-field">
                  <label>Categoria / Carroceria</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedã">Sedã</option>
                    <option value="Esportivo">Esportivo / Cupê</option>
                    <option value="Picape">Picape</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Ano de Fabricação / Modelo</label>
                  <input 
                    type="number" 
                    name="year" 
                    min="2000" 
                    max="2030"
                    value={formData.year} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Cor Exterior</label>
                  <input 
                    type="text" 
                    name="color" 
                    placeholder="Ex: Preto Obsidian, Cinza Nardo..."
                    value={formData.color} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-grid-3">
                <div className="form-field">
                  <label>Final da Placa</label>
                  <input 
                    type="text" 
                    name="plateEnd" 
                    maxLength={1}
                    placeholder="Ex: 8"
                    value={formData.plateEnd} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Número de Portas</label>
                  <select 
                    name="doors" 
                    value={formData.doors} 
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value={2}>2 Portas</option>
                    <option value={4}>4 Portas</option>
                    <option value={5}>5 Portas</option>
                  </select>
                </div>

                <div className="form-field" style={{ justifyContent: 'center' }}>
                  <label className="checkbox-pill-label" style={{ marginTop: '16px' }}>
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={formData.featured} 
                      onChange={handleChange}
                    />
                    <span>Destacar na Página Inicial</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Commercial / Values */}
            <div className="form-section-block">
              <h3 className="form-section-title">
                <Sparkles size={18} />
                <span>2. Preço, Quilometragem e Selos</span>
              </h3>

              <div className="form-row-grid-2">
                <div className="form-field">
                  <label>Preço à Vista (R$) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    step="1000"
                    required
                    value={formData.price} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Quilometragem (km) * (0 para zero km)</label>
                  <input 
                    type="number" 
                    name="mileage" 
                    step="100"
                    required
                    value={formData.mileage} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Badges toggles */}
              <div className="form-field">
                <label>Selos Promocionais no Card:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {DEFAULT_BADGE_OPTIONS.map(badge => {
                    const active = formData.badges.includes(badge);
                    return (
                      <button
                        type="button"
                        key={badge}
                        className={`pill-btn ${active ? 'active' : ''}`}
                        onClick={() => toggleBadge(badge)}
                        style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                      >
                        {badge}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Mechanics & Specs */}
            <div className="form-section-block">
              <h3 className="form-section-title">
                <Zap size={18} />
                <span>3. Ficha Técnica & Mecânica</span>
              </h3>

              <div className="form-row-grid-3">
                <div className="form-field">
                  <label>Motorização e Potência</label>
                  <input 
                    type="text" 
                    name="engine" 
                    placeholder="Ex: 3.0 V6 Bi-Turbo - 450 cv"
                    value={formData.engine} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Câmbio</label>
                  <input 
                    type="text" 
                    name="transmission" 
                    placeholder="Ex: Automático 8 Marchas"
                    value={formData.transmission} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Combustível</label>
                  <select 
                    name="fuel" 
                    value={formData.fuel} 
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Gasolina">Gasolina</option>
                    <option value="Híbrido">Híbrido / Plug-in</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Flex">Flex (Gasolina/Etanol)</option>
                    <option value="Elétrico">100% Elétrico</option>
                  </select>
                </div>
              </div>

              <div className="form-row-grid-3">
                <div className="form-field">
                  <label>Torque Máximo</label>
                  <input 
                    type="text" 
                    name="torque" 
                    placeholder="Ex: 54 kgfm"
                    value={formData.torque} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Aceleração 0 a 100 km/h</label>
                  <input 
                    type="text" 
                    name="acceleration" 
                    placeholder="Ex: 3.5s"
                    value={formData.acceleration} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Velocidade Máxima</label>
                  <input 
                    type="text" 
                    name="topSpeed" 
                    placeholder="Ex: 308 km/h"
                    value={formData.topSpeed} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* 4. Photos Gallery */}
            <div className="form-section-block">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <h3 className="form-section-title" style={{ border: 'none', padding: 0, margin: 0 }}>
                  <ImageIcon size={18} />
                  <span>4. Fotos do Veículo ({formData.images.length})</span>
                </h3>
                <button 
                  type="button" 
                  className="btn btn-outline-white" 
                  onClick={handleSamplePhotos}
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  <RefreshCw size={13} />
                  <span>Usar Fotos de Alta Resolução</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '14px 0 10px 0' }}>
                <label 
                  className="btn btn-outline-gold" 
                  style={{ 
                    cursor: isUploading ? 'not-allowed' : 'pointer', 
                    fontSize: '0.84rem', 
                    padding: '9px 16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Upload size={16} />
                  <span>{isUploading ? 'Enviando Fotos...' : 'Fazer Upload de Fotos do Computador / Celular'}</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    disabled={isUploading}
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              <div className="photo-inputs-row">
                <input 
                  type="url" 
                  placeholder="Ou cole a URL da foto (https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="form-input"
                  style={{ flexGrow: 1 }}
                />
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleAddImage}
                  style={{ padding: '10px 18px' }}
                >
                  <Plus size={16} />
                  <span>Adicionar Foto por URL</span>
                </button>
              </div>

              {/* Photos Preview Grid */}
              <div className="photo-preview-grid">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="photo-preview-item">
                    <img src={img} alt={`Foto ${idx + 1}`} />
                    <button 
                      type="button" 
                      className="photo-delete-btn" 
                      onClick={() => handleRemoveImage(idx)}
                      title="Remover foto"
                    >
                      <Trash2 size={13} />
                    </button>
                    {idx === 0 ? (
                      <span className="photo-cover-badge">Capa</span>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => handleSetCoverImage(idx)}
                        style={{
                          position: 'absolute',
                          bottom: '6px',
                          left: '6px',
                          background: 'rgba(0,0,0,0.7)',
                          color: '#FFF',
                          fontSize: '0.65rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Tornar Capa
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Features & Description */}
            <div className="form-section-block">
              <h3 className="form-section-title">
                <CheckCircle2 size={18} />
                <span>5. Opcionais & Descrição Comercial</span>
              </h3>

              <div className="features-checkboxes-grid">
                {DEFAULT_FEATURE_OPTIONS.map((feat, idx) => {
                  const isChecked = formData.features.includes(feat);
                  return (
                    <label 
                      key={idx} 
                      className={`checkbox-pill-label ${isChecked ? 'checked' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => toggleFeature(feat)}
                      />
                      <span>{feat}</span>
                    </label>
                  );
                })}
              </div>

              {/* Add Custom Feature */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Adicionar outro opcional exclusivo..."
                  value={customFeatureInput}
                  onChange={(e) => setCustomFeatureInput(e.target.value)}
                  className="form-input"
                  style={{ flexGrow: 1 }}
                />
                <button 
                  type="button" 
                  className="btn btn-outline-gold"
                  onClick={handleAddCustomFeature}
                  style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Incluir Opcional</span>
                </button>
              </div>

              {/* Description */}
              <div className="form-field" style={{ marginTop: '14px' }}>
                <label>Descrição do Veículo (Observações do Lojista)</label>
                <textarea 
                  name="description" 
                  rows={4}
                  placeholder="Descreva os diferenciais, histórico de manutenção, conservação de pneus, PPF, procedência..."
                  value={formData.description} 
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>
            </div>
          </div>

          {/* Footer Save Actions */}
          <div className="vehicle-form-footer">
            <button 
              type="button" 
              className="btn btn-outline-white" 
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <Save size={18} />
              <span>{vehicleToEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
