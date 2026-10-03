import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCw, 
  Moon, 
  Sun, 
  Lightbulb, 
  Play, 
  Pause, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Compass,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Gauge,
  Palette
} from 'lucide-react';
import './Showroom360Viewer.css';

// Web Audio API feedback for premium tactile feel
const playSound = (type = 'click') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'headlights') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Graceful fallback
  }
};

export default function Showroom360Viewer({ vehicle }) {
  const [angleIndex, setAngleIndex] = useState(0); // 0: Frente, 1: Diagonal, 2: Perfil, 3: Traseira, 4: Cockpit
  const [isNightMode, setIsNightMode] = useState(true);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const autoRotateIntervalRef = useRef(null);

  const rawImages = vehicle?.images?.length ? vehicle.images : [
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
  ];

  // 5 Perspectives with authentic photography
  const perspectives = [
    { id: 'front', label: 'Dianteira', angle: '0°', image: rawImages[0] || rawImages[0] },
    { id: 'diagonal', label: 'Diagonal 3/4', angle: '45°', image: rawImages[1] || rawImages[0] },
    { id: 'side', label: 'Perfil Lateral', angle: '90°', image: rawImages[2] || rawImages[1] || rawImages[0] },
    { id: 'rear', label: 'Traseira', angle: '180°', image: rawImages[3] || rawImages[2] || rawImages[0] },
    { id: 'interior', label: 'Cockpit VIP', angle: 'Interior', image: rawImages[4] || rawImages[3] || rawImages[0] }
  ];

  const currentPerspective = perspectives[angleIndex] || perspectives[0];

  // Hotspots for current perspective
  const getPerspectiveHotspots = () => {
    switch (angleIndex) {
      case 0: // Dianteira
        return [
          {
            id: 'optics',
            title: 'Faróis LED Matrix & Laserlight',
            posX: '32%',
            posY: '55%',
            desc: 'Sistema óptico adaptativo de alta definição com alcance de até 500m e assinatura DRL exclusiva.'
          },
          {
            id: 'engine-grille',
            title: 'Grade Ativa & Fluxo Aerodinâmico',
            posX: '50%',
            posY: '65%',
            desc: 'Aletas com abertura dinâmica para refrigeração sob demanda e menor arrasto aerodinâmico.'
          }
        ];
      case 1: // Diagonal 3/4
        return [
          {
            id: 'wheels',
            title: 'Rodas Esportivas Forjadas',
            posX: '68%',
            posY: '72%',
            desc: 'Rodas forjadas de liga leve de alta resistência com acabamento diamantado e pinças de freio esportivas.'
          },
          {
            id: 'paint',
            title: `Pintura Original: ${vehicle?.color || 'Exclusiva'}`,
            posX: '38%',
            posY: '44%',
            desc: `Pintura de fábrica ${vehicle?.color || ''} impecável, tratada com proteção cerâmica e PPF nas áreas de impacto.`
          }
        ];
      case 2: // Perfil Lateral
        return [
          {
            id: 'suspension',
            title: 'Suspensão Adaptativa Ativa',
            posX: '32%',
            posY: '75%',
            desc: 'Gerenciamento eletrônico contínuo de altura e amortecimento em milissegundos.'
          },
          {
            id: 'doors',
            title: 'Portas & Fechamento Suave (Soft Close)',
            posX: '52%',
            posY: '50%',
            desc: 'Estrutura de alta rigidez torcional com isolamento acústico reforçado e vidros térmicos.'
          }
        ];
      case 3: // Traseira
        return [
          {
            id: 'exhaust',
            title: 'Escapamento Esportivo Ativo',
            posX: '50%',
            posY: '80%',
            desc: 'Sistema de escape esportivo com abertura de válvulas para sonoridade pura e contrapressão otimizada.'
          },
          {
            id: 'taillights',
            title: 'Lanternas Traseiras em LED 3D',
            posX: '50%',
            posY: '48%',
            desc: 'Iluminação tridimensional em LED contínuo com acendimento dinâmico.'
          }
        ];
      case 4: // Cockpit
        return [
          {
            id: 'infotainment',
            title: 'Cockpit Digital & Conectividade',
            posX: '50%',
            posY: '42%',
            desc: 'Telas digitais configuráveis de alta resolução integradas ao sistema de som surround premium.'
          },
          {
            id: 'seats',
            title: 'Bancos Esportivos em Couro Nobre',
            posX: '30%',
            posY: '65%',
            desc: 'Ajustes elétricos com memórias de posição, ventilação e aquecimento nos assentos dianteiros.'
          }
        ];
      default:
        return [];
    }
  };

  const activeHotspots = getPerspectiveHotspots();

  // Auto rotation
  useEffect(() => {
    if (isAutoRotating) {
      autoRotateIntervalRef.current = setInterval(() => {
        setAngleIndex((prev) => (prev + 1) % perspectives.length);
      }, 4000);
    } else if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
    }
    return () => {
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
    };
  }, [isAutoRotating, perspectives.length]);

  // Handle Drag / Swipe
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    startXRef.current = clientX;
  };

  const handleDragEnd = (clientX) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = clientX - startXRef.current;
    if (Math.abs(diff) > 40) {
      if (soundEnabled) playSound('click');
      if (diff > 0) {
        setAngleIndex((prev) => (prev === 0 ? perspectives.length - 1 : prev - 1));
      } else {
        setAngleIndex((prev) => (prev === perspectives.length - 1 ? 0 : prev + 1));
      }
    }
  };

  const nextPerspective = () => {
    if (soundEnabled) playSound('click');
    setAngleIndex((prev) => (prev === perspectives.length - 1 ? 0 : prev + 1));
  };

  const prevPerspective = () => {
    if (soundEnabled) playSound('click');
    setAngleIndex((prev) => (prev === 0 ? perspectives.length - 1 : prev - 1));
  };

  const toggleNight = () => {
    if (soundEnabled) playSound('click');
    setIsNightMode(!isNightMode);
  };

  const toggleHeadlights = () => {
    if (soundEnabled) playSound('headlights');
    setHeadlightsOn(!headlightsOn);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`showroom-container ${isNightMode ? 'night-atmosphere' : 'day-atmosphere'} ${isFullscreen ? 'fullscreen-mode' : ''}`}
    >
      {/* Top Bar */}
      <div className="showroom-nav-bar">
        <div className="showroom-title-badge">
          <RotateCw size={14} className={isAutoRotating ? 'rotating-icon' : ''} />
          <span>SHOWROOM VIRTUAL INTERATIVO</span>
          <span className="live-pill">AO VIVO</span>
        </div>

        <div className="showroom-top-controls">
          <button 
            type="button"
            className={`showroom-action-btn ${showHotspots ? 'active' : ''}`}
            title={showHotspots ? 'Ocultar Pontos de Inspeção' : 'Exibir Pontos de Inspeção'}
            onClick={() => setShowHotspots(!showHotspots)}
          >
            <Sparkles size={16} />
          </button>

          <button 
            type="button"
            className="showroom-action-btn"
            title={soundEnabled ? 'Efeitos sonoros ativos' : 'Silenciar'}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button 
            type="button"
            className="showroom-action-btn"
            title="Tela Cheia"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div 
        className="showroom-viewport"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
      >
        {/* Softbox Ceiling Lighting */}
        <div className="ceiling-light"></div>
        {isNightMode && <div className="studio-rim-light"></div>}

        {/* Headlight Floor Illumination in Night Mode (Front and 3/4) */}
        {isNightMode && headlightsOn && (angleIndex === 0 || angleIndex === 1) && (
          <div className="floor-headlight-projection" aria-hidden="true"></div>
        )}

        {/* Taillight Red Floor Aura in Night Mode (Rear) */}
        {isNightMode && headlightsOn && angleIndex === 3 && (
          <div className="floor-taillight-projection" aria-hidden="true"></div>
        )}

        {/* Vehicle Showcase Image - Natural colors preserved */}
        <div className="showroom-stage-display">
          <img 
            key={`${currentPerspective.id}-${angleIndex}`}
            src={currentPerspective.image} 
            alt={`${vehicle?.brand || 'Veículo'} ${vehicle?.model || ''} - ${currentPerspective.label}`}
            className="showroom-hero-image fade-image"
            draggable={false}
          />

          {/* Luxury Turntable Floor Platform */}
          <div className="showroom-stage-turntable">
            <div className="turntable-rim"></div>
            <div className="turntable-glow"></div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          type="button" 
          className="stage-nav-arrow arrow-left" 
          onClick={prevPerspective}
          aria-label="Perspectiva anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          type="button" 
          className="stage-nav-arrow arrow-right" 
          onClick={nextPerspective}
          aria-label="Próxima perspectiva"
        >
          <ChevronRight size={24} />
        </button>

        {/* Contextual Hotspot Markers */}
        {showHotspots && activeHotspots.map((h) => (
          <div 
            key={h.id}
            className={`stage-hotspot-marker ${activeHotspot?.id === h.id ? 'active' : ''}`}
            style={{ left: h.posX, top: h.posY }}
            onClick={(e) => {
              e.stopPropagation();
              if (soundEnabled) playSound('click');
              setActiveHotspot(activeHotspot?.id === h.id ? null : h);
            }}
          >
            <div className="hotspot-halo"></div>
            <div className="hotspot-center">
              <Sparkles size={11} />
            </div>
          </div>
        ))}

        {/* Hotspot Card Popover */}
        {activeHotspot && (
          <div className="stage-hotspot-popover" onClick={(e) => e.stopPropagation()}>
            <div className="popover-header">
              <span className="popover-title">{activeHotspot.title}</span>
              <button 
                type="button" 
                className="popover-close-btn" 
                onClick={() => setActiveHotspot(null)}
              >
                ✕
              </button>
            </div>
            <p className="popover-desc">{activeHotspot.desc}</p>
          </div>
        )}

        {/* Perspective Badge */}
        <div className="stage-perspective-badge">
          <Compass size={14} color="var(--gold-primary)" />
          <span>{currentPerspective.label} ({currentPerspective.angle})</span>
        </div>

        {/* Color Badge - Real Factory Color */}
        <div className="stage-color-pill">
          <Palette size={13} color="var(--gold-primary)" />
          <span>Cor Oficial: <strong>{vehicle?.color || 'Configuração Especial'}</strong></span>
        </div>
      </div>

      {/* Control Console */}
      <div className="showroom-deck">
        {/* Perspectives Navigation Tabs */}
        <div className="showroom-perspectives-tabs">
          {perspectives.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`perspective-tab-btn ${angleIndex === idx ? 'selected' : ''}`}
              onClick={() => {
                if (soundEnabled) playSound('click');
                setAngleIndex(idx);
                setActiveHotspot(null);
              }}
            >
              <span className="tab-angle">{p.angle}</span>
              <span className="tab-name">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Action Controls & Real Vehicle Specs */}
        <div className="showroom-action-bar">
          <div className="action-buttons-group">
            {/* Day / Night Toggle */}
            <button 
              type="button"
              className={`deck-btn ${isNightMode ? 'active-night' : 'active-day'}`}
              onClick={toggleNight}
            >
              {isNightMode ? <Moon size={15} color="#D4AF37" /> : <Sun size={15} color="#FBBF24" />}
              <span>{isNightMode ? 'Modo Noturno (Showroom)' : 'Modo Diurno (Estúdio)'}</span>
            </button>

            {/* Headlights Toggle (Night Mode) */}
            {isNightMode && (
              <button 
                type="button"
                className={`deck-btn ${headlightsOn ? 'active-headlights' : ''}`}
                onClick={toggleHeadlights}
              >
                <Lightbulb size={15} color={headlightsOn ? '#38BDF8' : '#888'} />
                <span>Faróis: <strong>{headlightsOn ? 'ACESOS' : 'APAGADOS'}</strong></span>
              </button>
            )}

            {/* Auto-Rotation Toggle */}
            <button 
              type="button"
              className={`deck-btn ${isAutoRotating ? 'active-rotate' : ''}`}
              onClick={() => {
                if (soundEnabled) playSound('click');
                setIsAutoRotating(!isAutoRotating);
              }}
            >
              {isAutoRotating ? <Pause size={15} /> : <Play size={15} />}
              <span>{isAutoRotating ? 'Pausar Tour' : 'Giro Automático'}</span>
            </button>
          </div>

          {/* Genuine Vehicle Badges & Specs Bar */}
          <div className="showroom-vehicle-specs-bar">
            {vehicle?.engine && (
              <span className="specs-pill">
                <Zap size={13} color="var(--gold-primary)" />
                {vehicle.engine.split('-')[0].trim()}
              </span>
            )}
            {vehicle?.acceleration && (
              <span className="specs-pill">
                <Gauge size={13} color="var(--gold-primary)" />
                {vehicle.acceleration}
              </span>
            )}
            {vehicle?.badges?.[0] && (
              <span className="specs-pill highlight">
                <ShieldCheck size={13} color="var(--gold-primary)" />
                {vehicle.badges[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
