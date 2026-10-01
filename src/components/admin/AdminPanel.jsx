import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  RotateCcw, 
  Eye, 
  DollarSign, 
  Sparkles, 
  X, 
  LogOut, 
  Check 
} from 'lucide-react';
import VehicleFormModal from './VehicleFormModal';
import { formatBRL, formatKm } from '../../utils/formatters';
import './AdminPanel.css';

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  vehicles, 
  onSaveVehicle, 
  onDeleteVehicle, 
  onToggleFeatured,
  onResetToDefault,
  onViewVehicleDetails,
  onLogout 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filter vehicles for search
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    if (!searchQuery.trim()) return vehicles;
    const q = searchQuery.toLowerCase().trim();
    return vehicles.filter(v => 
      (v.brand && v.brand.toLowerCase().includes(q)) ||
      (v.model && v.model.toLowerCase().includes(q)) ||
      (v.category && v.category.toLowerCase().includes(q)) ||
      (v.year && v.year.toString().includes(q))
    );
  }, [vehicles, searchQuery]);

  // Stats calculation
  const totalStockValue = useMemo(() => {
    if (!vehicles) return 0;
    return vehicles.reduce((sum, v) => sum + (v.price || 0), 0);
  }, [vehicles]);

  const featuredCount = useMemo(() => {
    if (!vehicles) return 0;
    return vehicles.filter(v => v.featured).length;
  }, [vehicles]);

  if (!isOpen) return null;

  const handleOpenNewForm = () => {
    setVehicleToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsFormModalOpen(true);
  };

  const handleDelete = (vehicle) => {
    const confirm = window.confirm(`Tem certeza que deseja remover o veículo "${vehicle.brand} ${vehicle.model} (${vehicle.year})" do estoque?`);
    if (confirm) {
      onDeleteVehicle(vehicle.id);
      showFeedback(`Veículo "${vehicle.model}" removido com sucesso.`);
    }
  };

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vehicles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `estoque-autoprime-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showFeedback("Arquivo JSON de backup baixado com sucesso!");
  };

  const handleReset = () => {
    const confirm = window.confirm("Deseja restaurar o estoque original de fábrica da AutoPrime? Quaisquer veículos adicionados manualmente serão redefinidos.");
    if (confirm) {
      onResetToDefault();
      showFeedback("Estoque padrão restaurado com sucesso!");
    }
  };

  return (
    <div className="admin-panel-overlay" onClick={onClose}>
      <div className="admin-panel-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-panel-header">
          <div className="admin-header-title-wrap">
            <div className="admin-badge-icon">
              <Car size={24} />
            </div>
            <div>
              <h1 className="admin-panel-h1">Painel do Lojista • Gestão de Estoque</h1>
              <p className="admin-panel-sub">Cadastre novos carros, ajuste preços e controle os destaques</p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button 
              className="btn btn-outline-white"
              onClick={onLogout}
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
              title="Sair da Área Administrativa"
            >
              <LogOut size={15} />
              <span>Sair</span>
            </button>
            <button className="admin-close-btn" onClick={onClose} aria-label="Fechar Painel">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="admin-stats-strip">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Car size={20} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{vehicles.length}</span>
              <span className="admin-stat-lbl">Veículos no Estoque</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Sparkles size={20} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{featuredCount}</span>
              <span className="admin-stat-lbl">Em Destaque na Home</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <DollarSign size={20} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value text-gold-gradient">{formatBRL(totalStockValue)}</span>
              <span className="admin-stat-lbl">Valor Total do Estoque</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <RotateCcw size={20} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{formatBRL(Math.round(totalStockValue / (vehicles.length || 1)))}</span>
              <span className="admin-stat-lbl">Ticket Médio</span>
            </div>
          </div>
        </div>

        {/* Feedback alert */}
        {feedbackMsg && (
          <div style={{
            background: 'rgba(37, 211, 102, 0.15)',
            borderBottom: '1px solid rgba(37, 211, 102, 0.3)',
            color: '#A7F3D0',
            padding: '10px 28px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={16} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrapper">
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por marca, modelo, ano..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-toolbar-buttons">
            <button 
              className="btn btn-outline-white"
              onClick={handleExportJSON}
              style={{ fontSize: '0.82rem', padding: '9px 14px' }}
              title="Baixar lista completa em formato JSON"
            >
              <Download size={15} />
              <span>Exportar Backup</span>
            </button>

            <button 
              className="btn btn-outline-white"
              onClick={handleReset}
              style={{ fontSize: '0.82rem', padding: '9px 14px' }}
              title="Restaurar lista original de veículos"
            >
              <RotateCcw size={15} />
              <span>Restaurar Padrão</span>
            </button>

            <button 
              className="btn btn-primary"
              onClick={handleOpenNewForm}
              style={{ fontSize: '0.88rem', padding: '9px 18px' }}
            >
              <Plus size={16} />
              <span>Cadastrar Novo Veículo</span>
            </button>
          </div>
        </div>

        {/* Table of Vehicles */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Foto</th>
                <th>Marca & Modelo</th>
                <th>Ano</th>
                <th>Categoria</th>
                <th>Quilometragem</th>
                <th>Preço</th>
                <th>Destaque</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => {
                const thumb = vehicle.images && vehicle.images[0] ? vehicle.images[0] : '';
                return (
                  <tr key={vehicle.id}>
                    <td>
                      <img src={thumb} alt={vehicle.model} className="table-car-thumb" />
                    </td>
                    <td>
                      <div className="table-car-name">{vehicle.brand} {vehicle.model}</div>
                      <div className="table-car-version">{vehicle.version}</div>
                    </td>
                    <td>{vehicle.year}</td>
                    <td>
                      <span className="badge-dark">{vehicle.category}</span>
                    </td>
                    <td>{formatKm(vehicle.mileage)}</td>
                    <td>
                      <strong className="text-gold-gradient">{formatBRL(vehicle.price)}</strong>
                    </td>
                    <td>
                      <button 
                        type="button"
                        className={`badge-featured-toggle ${vehicle.featured ? 'active' : 'inactive'}`}
                        onClick={() => {
                          onToggleFeatured(vehicle.id);
                          showFeedback(`Destaque de "${vehicle.model}" ${vehicle.featured ? 'desativado' : 'ativado'}.`);
                        }}
                        title="Clique para alternar se este carro aparece no topo da Home"
                      >
                        {vehicle.featured ? '★ Em Destaque' : '☆ Comum'}
                      </button>
                    </td>
                    <td>
                      <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="table-btn-icon" 
                          onClick={() => {
                            onViewVehicleDetails(vehicle);
                            onClose();
                          }}
                          title="Visualizar página deste veículo no site"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          className="table-btn-icon" 
                          onClick={() => handleOpenEdit(vehicle)}
                          title="Editar informações do veículo"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          className="table-btn-icon table-btn-delete" 
                          onClick={() => handleDelete(vehicle)}
                          title="Excluir veículo do estoque"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredVehicles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              Nenhum veículo encontrado correspondente à pesquisa "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* Form Modal for Creating/Editing */}
      <VehicleFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        vehicleToEdit={vehicleToEdit}
        onSaveVehicle={(savedVehicle) => {
          onSaveVehicle(savedVehicle);
          setIsFormModalOpen(false);
          showFeedback(vehicleToEdit ? `Veículo "${savedVehicle.model}" atualizado!` : `Novo veículo "${savedVehicle.model}" cadastrado com sucesso!`);
        }}
      />
    </div>
  );
}
