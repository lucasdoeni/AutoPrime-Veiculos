import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import './VehicleFilters.css';

export default function VehicleFilters({
  filters,
  setFilters,
  brands,
  categories,
  totalResults,
  onReset
}) {
  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="filters-container">
      {/* Top Header */}
      <div className="filters-header">
        <div className="filters-title-group">
          <SlidersHorizontal className="filters-icon" size={20} />
          <h2 className="filters-title">Filtrar Veículos</h2>
        </div>
        <button 
          className="filters-reset-btn" 
          onClick={onReset}
          type="button"
        >
          <RotateCcw size={14} />
          Limpar Filtros
        </button>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`pill-btn ${filters.category === cat ? 'active' : ''}`}
            onClick={() => handleInputChange('category', cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Inputs Grid */}
      <div className="filters-grid">
        {/* Keyword Search */}
        <div className="filter-field">
          <label className="filter-label">Buscar Modelo ou Versão</label>
          <div className="input-with-icon">
            <Search className="input-icon" size={18} />
            <input 
              type="text" 
              placeholder="Ex: 911, X6, C63, Defender..."
              value={filters.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Brand */}
        <div className="filter-field">
          <label className="filter-label">Marca</label>
          <select 
            value={filters.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            className="filter-select"
          >
            <option value="Todas">Todas as Marcas</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-field">
          <label className="filter-label">Faixa de Preço</label>
          <select 
            value={filters.priceRange}
            onChange={(e) => handleInputChange('priceRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">Qualquer Valor</option>
            <option value="up-to-400k">Até R$ 400.000</option>
            <option value="400k-to-700k">R$ 400.000 a R$ 700.000</option>
            <option value="above-700k">Acima de R$ 700.000</option>
          </select>
        </div>

        {/* Year */}
        <div className="filter-field">
          <label className="filter-label">Ano Mínimo</label>
          <select 
            value={filters.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os Anos</option>
            <option value="2024">2024 ou mais novo</option>
            <option value="2023">2023 ou mais novo</option>
            <option value="2022">2022 ou mais novo</option>
          </select>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="filters-summary-bar">
        <span className="results-count">
          Mostrando <strong>{totalResults}</strong> {totalResults === 1 ? 'veículo disponível' : 'veículos disponíveis'}
        </span>
      </div>
    </div>
  );
}
