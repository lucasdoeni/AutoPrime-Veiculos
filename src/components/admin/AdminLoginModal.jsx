import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, X, ShieldCheck } from 'lucide-react';
import './AdminLoginModal.css';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default master password for store manager
    if (password === 'admin123' || password === 'admin' || password === 'autoprime') {
      setError('');
      setPassword('');
      onLoginSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-login-box" onClick={(e) => e.stopPropagation()}>
        <button className="admin-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <div className="admin-login-header">
          <div className="admin-lock-icon">
            <Lock size={26} />
          </div>
          <h2 className="admin-login-title">Área do Lojista</h2>
          <p className="admin-login-subtitle">
            Acesso exclusivo para cadastro e gerenciamento de veículos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label>Senha de Acesso</label>
            <div className="admin-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Digite a senha do lojista"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="admin-input"
              />
              <button 
                type="button" 
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-error-msg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ padding: '14px' }}>
            <ShieldCheck size={18} />
            <span>Acessar Painel</span>
          </button>

          <p className="admin-hint">
            Senha padrão de demonstração: <strong>admin123</strong>
          </p>
        </form>
      </div>
    </div>
  );
}
