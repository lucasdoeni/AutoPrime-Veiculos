import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import VehicleDetails from './pages/VehicleDetails';
import FinancingPage from './pages/FinancingPage';
import TradeInPage from './pages/TradeInPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminPanel from './components/admin/AdminPanel';
import AIConsultantModal from './components/chat/AIConsultantModal';

import { vehiclesData } from './data/vehiclesData';
import { 
  fetchVehiclesFromAPI, 
  saveVehicleToAPI, 
  updateVehicleInAPI, 
  deleteVehicleFromAPI, 
  toggleFeaturedInAPI 
} from './services/api';

const STORAGE_KEY = 'autoprime_vehicles';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterParams, setFilterParams] = useState({});

  // Dynamic Vehicles State with LocalStorage Persistence
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Erro ao ler veículos do localStorage:', err);
    }
    return vehiclesData;
  });

  // Admin authentication and modal state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Sync with localStorage on any vehicle change
  const updateAndSaveVehicles = (newVehicles) => {
    setVehicles(newVehicles);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVehicles));
    } catch (e) {
      console.error('Erro ao salvar veículos no localStorage:', e);
    }
  };

  // Scroll to top whenever activePage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedVehicle]);

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setActivePage('vehicle-details');
  };

  const handleBackToCatalog = () => {
    setActivePage('catalog');
  };

  const handleNavigateCatalog = (filters = {}) => {
    setFilterParams(filters);
    setActivePage('catalog');
  };

  // Fetch vehicles from MySQL on mount
  useEffect(() => {
    async function loadMySQLVehicles() {
      try {
        const data = await fetchVehiclesFromAPI();
        if (Array.isArray(data) && data.length > 0) {
          setVehicles(data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.warn('MySQL backend não alcançado. Usando dados locais:', err);
      }
    }
    loadMySQLVehicles();
  }, []);

  // Admin Actions
  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsLoginModalOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminPanelOpen(false);
  };

  const handleSaveVehicle = async (vehicleData) => {
    const exists = vehicles.some(v => v.id === vehicleData.id);
    let updated;
    if (exists) {
      updated = vehicles.map(v => v.id === vehicleData.id ? vehicleData : v);
    } else {
      updated = [vehicleData, ...vehicles];
    }
    updateAndSaveVehicles(updated);

    // If currently viewing this vehicle, update view too
    if (selectedVehicle && selectedVehicle.id === vehicleData.id) {
      setSelectedVehicle(vehicleData);
    }

    // Sync to MySQL
    try {
      if (exists) {
        await updateVehicleInAPI(vehicleData.id, vehicleData);
      } else {
        await saveVehicleToAPI(vehicleData);
      }
    } catch (e) {
      console.error('Erro ao sincronizar com MySQL:', e);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    const updated = vehicles.filter(v => v.id !== vehicleId);
    updateAndSaveVehicles(updated);
    if (selectedVehicle && selectedVehicle.id === vehicleId) {
      setSelectedVehicle(null);
      setActivePage('catalog');
    }

    // Sync to MySQL
    try {
      await deleteVehicleFromAPI(vehicleId);
    } catch (e) {
      console.error('Erro ao deletar no MySQL:', e);
    }
  };

  const handleToggleFeatured = async (vehicleId) => {
    const updated = vehicles.map(v => 
      v.id === vehicleId ? { ...v, featured: !v.featured } : v
    );
    updateAndSaveVehicles(updated);

    // Sync to MySQL
    try {
      await toggleFeaturedInAPI(vehicleId);
    } catch (e) {
      console.error('Erro ao alterar destaque no MySQL:', e);
    }
  };

  const handleResetToDefault = () => {
    updateAndSaveVehicles(vehiclesData);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      {/* Global Navigation Header with Admin Button */}
      <Navbar 
        activePage={activePage} 
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'vehicle-details') {
            setSelectedVehicle(null);
          }
        }} 
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Router */}
      <main style={{ flexGrow: 1 }}>
        {activePage === 'home' && (
          <Home 
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
            onNavigateCatalog={() => handleNavigateCatalog({})}
            onNavigateContact={() => setActivePage('contact')}
            setFilterParams={setFilterParams}
          />
        )}

        {activePage === 'catalog' && (
          <Catalog 
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
            initialFilters={filterParams}
            onNavigateHome={() => setActivePage('home')}
          />
        )}

        {activePage === 'vehicle-details' && (
          <VehicleDetails 
            vehicle={selectedVehicle || vehicles[0]}
            vehicles={vehicles}
            onBack={handleBackToCatalog}
            onSelectVehicle={handleSelectVehicle}
            onNavigateHome={() => setActivePage('home')}
            onNavigateCatalog={handleBackToCatalog}
          />
        )}

        {activePage === 'financing' && (
          <FinancingPage 
            onNavigateCatalog={() => handleNavigateCatalog({})}
          />
        )}

        {activePage === 'trade-in' && (
          <TradeInPage 
            onNavigateCatalog={() => handleNavigateCatalog({})}
          />
        )}

        {activePage === 'about' && (
          <AboutPage 
            onNavigateContact={() => setActivePage('contact')}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Admin Modals */}
      <AdminLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminPanel 
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        vehicles={vehicles}
        onSaveVehicle={handleSaveVehicle}
        onDeleteVehicle={handleDeleteVehicle}
        onToggleFeatured={handleToggleFeatured}
        onResetToDefault={handleResetToDefault}
        onViewVehicleDetails={handleSelectVehicle}
        onLogout={handleLogout}
      />

      {/* AI Virtual Consultant Widget */}
      <AIConsultantModal 
        vehicles={vehicles}
        onSelectVehicle={handleSelectVehicle}
      />

      {/* Global Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Global Footer */}
      <Footer 
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'vehicle-details') {
            setSelectedVehicle(null);
          }
        }} 
      />
    </div>
  );
}
