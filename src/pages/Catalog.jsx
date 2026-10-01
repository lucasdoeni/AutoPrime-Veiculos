import React, { useState, useMemo } from 'react';
import { ArrowUpDown, AlertCircle, RotateCcw, Home as HomeIcon } from 'lucide-react';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleFilters from '../components/vehicles/VehicleFilters';
import { vehiclesData } from '../data/vehiclesData';

export default function Catalog({ 
  vehicles = vehiclesData,
  onSelectVehicle, 
  initialFilters = {}, 
  onNavigateHome 
}) {
  const [filters, setFilters] = useState({
    query: initialFilters.query || '',
    category: initialFilters.category || 'Todas',
    brand: initialFilters.brand || 'Todas',
    priceRange: initialFilters.priceRange || 'all',
    year: initialFilters.year || 'all'
  });

  const [sortBy, setSortBy] = useState('featured');

  const categories = ['Todas', 'SUV', 'Sedã', 'Esportivo', 'Picape'];
  const brands = useMemo(() => {
    const unique = Array.from(new Set(vehicles.map(v => v.brand)));
    return unique.sort();
  }, [vehicles]);

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'Todas',
      brand: 'Todas',
      priceRange: 'all',
      year: 'all'
    });
  };

  // Filter logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      // 1. Text Query (model, brand, version)
      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        const matchesQuery = 
          vehicle.model.toLowerCase().includes(q) ||
          vehicle.brand.toLowerCase().includes(q) ||
          vehicle.version.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Category
      if (filters.category !== 'Todas') {
        if (vehicle.category !== filters.category) return false;
      }

      // 3. Brand
      if (filters.brand !== 'Todas') {
        if (vehicle.brand !== filters.brand) return false;
      }

      // 4. Year
      if (filters.year !== 'all') {
        const minYear = parseInt(filters.year, 10);
        if (vehicle.year < minYear) return false;
      }

      // 5. Price Range
      if (filters.priceRange === 'up-to-400k') {
        if (vehicle.price > 400000) return false;
      } else if (filters.priceRange === '400k-to-700k') {
        if (vehicle.price < 400000 || vehicle.price > 700000) return false;
      } else if (filters.priceRange === 'above-700k') {
        if (vehicle.price < 700000) return false;
      }

      return true;
    });
  }, [filters]);

  // Sort logic
  const sortedVehicles = useMemo(() => {
    const list = [...filteredVehicles];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'year-desc') {
      return list.sort((a, b) => b.year - a.year);
    }
    if (sortBy === 'km-asc') {
      return list.sort((a, b) => a.mileage - b.mileage);
    }
    // Default: featured first
    return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [filteredVehicles, sortBy]);

  return (
    <div className="catalog-page fade-in" style={{ padding: '40px 0 90px 0' }}>
      <div className="container">
        {/* Breadcrumb Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          <button 
            onClick={onNavigateHome}
            style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <HomeIcon size={14} /> Início
          </button>
          <span>/</span>
          <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>Estoque de Veículos</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            Nosso <span className="text-gold-gradient">Estoque Exclusivo</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '700px' }}>
            Explore nossos veículos seminovos e zero quilômetro de marcas consagradas mundialmente. Todos revisados, com laudo aprovado e entrega para todo o Brasil.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <VehicleFilters 
          filters={filters}
          setFilters={setFilters}
          brands={brands}
          categories={categories}
          totalResults={sortedVehicles.length}
          onReset={handleResetFilters}
        />

        {/* Toolbar: Sort + Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Exibindo <strong>{sortedVehicles.length}</strong> de {vehicles.length} modelos disponíveis
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={15} /> Ordenar por:
            </span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-card)',
                color: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 14px',
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Destaques da Loja</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="year-desc">Mais Recentes (Ano)</option>
              <option value="km-asc">Menor Quilometragem</option>
            </select>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        {sortedVehicles.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '28px'
          }}>
            {sortedVehicles.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onSelectVehicle={onSelectVehicle} 
              />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700 }}>
              Nenhum veículo encontrado
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem' }}>
              Não encontramos nenhum carro correspondente aos filtros selecionados. Tente ajustar os critérios de busca ou redefinir os filtros.
            </p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleResetFilters}
              style={{ marginTop: '8px' }}
            >
              <RotateCcw size={16} />
              <span>Ver Todos os Veículos</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
