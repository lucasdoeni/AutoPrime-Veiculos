import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Showroom360Viewer.css';

// Web Audio API tactile feedback
const playAudioFeedback = (type = 'click') => {
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
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch {
    // Ignore audio restriction errors
  }
};

const COLOR_PRESETS = [
  { id: 'original', name: 'Original do Modelo', hex: '#6B7280', filter: 'none' },
  { id: 'obsidian', name: 'Preto Obsidian Shadow', hex: '#111216', filter: 'brightness(0.78) contrast(1.22)' },
  { id: 'crayon', name: 'Cinza Nardo Crayon', hex: '#9CA3AF', filter: 'grayscale(0.6) brightness(1.08) contrast(1.1)' },
  { id: 'rosso', name: 'Rosso Corsa Especial', hex: '#DC2626', filter: 'sepia(0.55) hue-rotate(320deg) saturate(2.3)' },
  { id: 'sapphire', name: 'Azul Mônaco Deep', hex: '#1E40AF', filter: 'sepia(0.45) hue-rotate(190deg) saturate(2.1)' },
  { id: 'gold', name: 'Ouro Champagne AutoPrime', hex: '#D4AF37', filter: 'sepia(0.6) hue-rotate(15deg) saturate(1.8) brightness(1.02)' }
];

export default function Showroom360Viewer({ vehicle }) {
  const [angleIndex, setAngleIndex] = useState(0); // 0: Frente, 1: Diagonal, 2: Perfil, 3: Traseira, 4: Cockpit
  const [isNightMode, setIsNightMode] = useState(true);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [selectedColor, setSelectedColor] = useState('original');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const autoRotateIntervalRef = useRef(null);

  // High quality images for each perspective
  const rawImages = vehicle?.images?.length ? vehicle.images : [
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
  ];

  // Perspectives definitions
  const perspectives = [
    { id: 'front', label: 'Frente', angle: '0°', image: rawImages[0] || rawImages[0] },
    { id: 'diagonal', label: 'Diagonal 3/4', angle: '45°', image: rawImages[1] || rawImages[0] },
    { id: 'side', label: 'Perfil Lateral', angle: '90°', image: rawImages[2] || rawImages[1] || rawImages[0] },
    { id: 'rear', label: 'Traseira', angle: '180°', image: rawImages[3] || rawImages[2] || rawImages[0] },
    { id: 'interior', label: 'Cockpit VIP', angle: 'Interior', image: rawImages[4] || rawImages[3] || rawImages[0] }
  ];

  const currentPerspective = perspectives[angleIndex] || perspectives[0];

  // Contextual hotspots for each perspective
  const getPerspectiveHotspots = () => {
    switch (angleIndex) {
      case 0: // Frente
        return [
          {
            id: 'optics',
            title: 'Faróis LED Matrix & Laserlight',
            posX: '30%',
            posY: '55%',
            desc: 'Tecnologia de iluminação adaptativa com faixo anti-ofuscante e alcance de até 500m.'
          },
          {
            id: 'grille',
            title: 'Grade Dianteira & Aerodinâmica Ativa',
            posX: '50%',
            posY: '65%',
            desc: 'Aletas com abertura dinâmica para resfriamento inteligente de freios e motor.'
          }
        ];
      case 1: // Diagonal 3/4
        return [
          {
            id: 'wheels',
            title: 'Rodas Forjadas Aro 21"',
            posX: '68%',
            posY: '72%',
            desc: 'Rodas de liga leve forjadas diamantadas com pinças de alto desempenho.'
          },
          {
            id: 'paint',
            title: 'Pintura & Tratamento Cerâmico',
            posX: '40%',
            posY: '42%',
            desc: 'Carroceria impecável com proteção PPF frontal e vitrificação de alto brilho.'
          }
        ];
      case 2: // Perfil Lateral
        return [
          {
            id: 'suspension',
            title: 'Suspensão Ativa Adaptativa',
            posX: '32%',
            posY: '75%',
            desc: 'Calibração dinâmica com ajuste contínuo de altura e rigidez esportiva.'
          },
          {
            id: 'bodyline',
            title: 'Linha de Cintura Esportiva',
            posX: '52%',
            posY: '48%',
            desc: 'Perfil aerodinâmico escultural com maçanetas embutidas e retrovisores esportivos.'
          }
        ];
      case 3: // Traseira
        return [
          {
            id: 'exhaust',
            title: 'Escapamento Esportivo com Válvulas',
            posX: '50%',
            posY: '80%',
            desc: 'Ponteiras esportivas ativas com contrapressão ajustável para acústica incomparável.'
          },
          {
            id: 'taillights',
            title: 'Assinatura LED Traseira Contínua',
            posX: '50%',
            posY: '48%',
            desc: 'Lente óptica 3D em LED contínuo com animação dinâmica de boas-vindas.'
          }
        ];
      case 4: // Cockpit
        return [
          {
            id: 'cluster',
            title: 'Cockpit Digital & Infotainment',
            posX: '48%',
            posY: '45%',
            desc: 'Painel curvo digital de alta definição integrado ao sistema de som premium.'
          },
          {
            id: 'leather',
            title: 'Acabamento em Couro Nobre e Carbono',
            posX: '25%',
            posY: '65%',
            desc: 'Bancos esportivos elétricos com memória, aquecimento, ventilação e costuras contrastantes.'
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
      }, 3500);
    } else if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
    }
    return () => {
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
    };
  }, [isAutoRotating, perspectives.length]);

  // Handle Drag / Swipe navigation
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
      if (soundEnabled) playAudioFeedback('click');
      if (diff > 0) {
        // Drag right -> previous
        setAngleIndex((prev) => (prev === 0 ? perspectives.length - 1 : prev - 1));
      } else {
        // Drag left -> next
        setAngleIndex((prev) => (prev === perspectives.length - 1 ? 0 : prev + 1));
      }
    }
  };

  const nextPerspective = () => {
    if (soundEnabled) playAudioFeedback('click');
    setAngleIndex((prev) => (prev === perspectives.length - 1 ? 0 : prev + 1));
  };

  const prevPerspective = () => {
    if (soundEnabled) playAudioFeedback('click');
    setAngleIndex((prev) => (prev === 0 ? perspectives.length - 1 : prev - 1));
  };

  const toggleNight = () => {
    if (soundEnabled) playAudioFeedback('click');
    setIsNightMode(!isNightMode);
  };

  const toggleHeadlights = () => {
    if (soundEnabled) playAudioFeedback('headlights');
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

  const activeColorFilter = COLOR_PRESETS.find(c => c.id === selectedColor)?.filter || 'none';

  return (
    <div 
      ref={containerRef}
      className={`showroom-container ${isNightMode ? 'night-atmosphere' : 'day-atmosphere'} ${isFullscreen ? 'fullscreen-mode' : ''}`}
    >
      {/* Header Bar */}
      <div className="showroom-nav-bar">
        <div className="showroom-title-badge">
          <RotateCw size={14} className={isAutoRotating ? 'rotating-icon' : ''} />
          <span>SHOWROOM VIRTUAL INTERATIVO</span>
          <span className="live-pill">AO VIVO</span>
        </div>

        <div className="showroom-top-controls">
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
            title="Alternar Tela Cheia"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Presentation Stage */}
      <div 
        className="showroom-viewport"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
      >
        {/* Overhead Spotlights */}
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

        {/* Vehicle Showcase Image with Smooth Transition */}
        <div className="showroom-stage-display">
          <img 
            key={`${currentPerspective.id}-${selectedColor}`}
            src={currentPerspective.image} 
            alt={`${vehicle?.brand || 'Veículo'} ${vehicle?.model || ''} - ${currentPerspective.label}`}
            className="showroom-hero-image fade-image"
            style={{ filter: activeColorFilter }}
            draggable={false}
          />

          {/* Luxury Polished Stage Platform Rim */}
          <div className="showroom-stage-turntable">
            <div className="turntable-rim"></div>
            <div className="turntable-glow"></div>
          </div>
        </div>

        {/* Directional Navigation Arrows */}
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

        {/* Contextual Hotspot Pins */}
        {activeHotspots.map((h) => (
          <div 
            key={h.id}
            className={`stage-hotspot-marker ${activeHotspot?.id === h.id ? 'active' : ''}`}
            style={{ left: h.posX, top: h.posY }}
            onClick={(e) => {
              e.stopPropagation();
              if (soundEnabled) playAudioFeedback('click');
              setActiveHotspot(activeHotspot?.id === h.id ? null : h);
            }}
          >
            <div className="hotspot-halo"></div>
            <div className="hotspot-center">
              <Sparkles size={11} />
            </div>
          </div>
        ))}

        {/* Hotspot Popover Card */}
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

        {/* Drag Helper Tip */}
        <div className="stage-swipe-hint">
          <span>Arraste para os lados ou use as setas</span>
        </div>
      </div>

      {/* Control Console */}
      <div className="showroom-deck">
        {/* Row 1: Perspective Tabs */}
        <div className="showroom-perspectives-tabs">
          {perspectives.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`perspective-tab-btn ${angleIndex === idx ? 'selected' : ''}`}
              onClick={() => {
                if (soundEnabled) playAudioFeedback('click');
                setAngleIndex(idx);
                setActiveHotspot(null);
              }}
            >
              <span className="tab-angle">{p.angle}</span>
              <span className="tab-name">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Row 2: Lighting & Studio Controls */}
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

            {/* Headlights Toggle (Active in Night Mode) */}
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
                if (soundEnabled) playAudioFeedback('click');
                setIsAutoRotating(!isAutoRotating);
              }}
            >
              {isAutoRotating ? <Pause size={15} /> : <Play size={15} />}
              <span>{isAutoRotating ? 'Pausar Tour' : 'Tour Automático'}</span>
            </button>
          </div>

          {/* Paint Swatches Selector */}
          <div className="deck-paint-selector">
            <span className="paint-label">Cor:</span>
            <div className="paint-swatches-list">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`paint-swatch ${selectedColor === color.id ? 'selected' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  onClick={() => {
                    setSelectedColor(color.id);
                    if (soundEnabled) playAudioFeedback('click');
                  }}
                >
                  {selectedColor === color.id && <Check size={11} color={color.id === 'white' ? '#000' : '#FFF'} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
