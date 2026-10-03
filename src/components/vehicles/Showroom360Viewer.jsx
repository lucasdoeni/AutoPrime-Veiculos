import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RotateCw, 
  Moon, 
  Sun, 
  Lightbulb, 
  Eye, 
  Play, 
  Pause, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Info, 
  Check, 
  Flame,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import './Showroom360Viewer.css';

// Sound synthesis using Web Audio API for luxury tactile feedback without external audio files
const playHapticSound = (type = 'click') => {
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
      // Futuristic relay click + gentle electric hum
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'switch') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Graceful fallback if audio is blocked by browser policy
  }
};

const COLOR_PRESETS = [
  { id: 'original', name: 'Original de Fábrica', hex: '#888888', filter: 'none' },
  { id: 'obsidian', name: 'Preto Obsidian Metálico', hex: '#111215', filter: 'brightness(0.72) contrast(1.25) saturate(0.8)' },
  { id: 'crayon', name: 'Cinza Nardo Crayon', hex: '#A3A6A8', filter: 'grayscale(0.65) brightness(1.05) contrast(1.1)' },
  { id: 'white', name: 'Branco Carrara Perlizado', hex: '#F0F2F5', filter: 'brightness(1.22) contrast(1.15) saturate(0.85)' },
  { id: 'rosso', name: 'Vermelho Rosso Corsa', hex: '#B81414', filter: 'sepia(0.65) hue-rotate(320deg) saturate(2.4) brightness(0.88)' },
  { id: 'sapphire', name: 'Azul Mônaco Metálico', hex: '#153E75', filter: 'sepia(0.55) hue-rotate(185deg) saturate(2.2) brightness(0.82)' },
  { id: 'gold', name: 'Ouro Champagne AutoPrime', hex: '#C5A046', filter: 'sepia(0.7) hue-rotate(15deg) saturate(1.8) brightness(0.95)' }
];

export default function Showroom360Viewer({ vehicle, isStandalone = false }) {
  const [angle, setAngle] = useState(30); // 0 to 359 degrees
  const [isNightMode, setIsNightMode] = useState(true);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState('original');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const autoRotateIntervalRef = useRef(null);

  const images = vehicle?.images?.length ? vehicle.images : [
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  ];

  // Hotspots definition according to vehicle details
  const hotspots = [
    {
      id: 'optics',
      title: 'Faróis LED Matrix & Laserlight',
      angleRange: [320, 50],
      posX: '32%',
      posY: '58%',
      description: 'Iluminação adaptativa ultra-precisa com alcance estendido de até 500 metros e assinatura DRL exclusiva AutoPrime.'
    },
    {
      id: 'wheels',
      title: 'Rodas Forjadas & Pinças de Alta Performance',
      angleRange: [40, 140],
      posX: '72%',
      posY: '70%',
      description: 'Rodas forjadas aro 21 polegadas com acabamento diamantado e pinças de freio cerâmicas de altíssima dissipação térmica.'
    },
    {
      id: 'exhaust',
      title: 'Escapamento Esportivo Ativo',
      angleRange: [140, 230],
      posX: '28%',
      posY: '72%',
      description: 'Sistema de escape com ponteiras quádruplas e válvulas ativas de contrapressão para uma acústica visceral inconfundível.'
    },
    {
      id: 'cockpit',
      title: 'Cockpit & Acabamento Interior VIP',
      angleRange: [230, 320],
      posX: '52%',
      posY: '45%',
      description: 'Revestimento em couro integral nobre, apliques em fibra de carbono fosca e iluminação ambiente multicromática.'
    }
  ];

  // Determine current image frame based on angle
  // 0° -> Dianteira (images[0])
  // 90° -> Lateral / 3/4 Dianteira (images[1])
  // 180° -> Traseira / 3/4 Traseira (images[2] or images[0])
  // 270° -> Lateral Oposta / Interior (images[3] or images[1])
  const getFrameIndex = useCallback(() => {
    const normAngle = ((angle % 360) + 360) % 360;
    if (images.length === 1) return 0;
    if (images.length === 2) return normAngle < 180 ? 0 : 1;
    if (images.length === 3) {
      if (normAngle < 120) return 0;
      if (normAngle < 240) return 1;
      return 2;
    }
    // 4 or more images:
    if (normAngle >= 315 || normAngle < 45) return 0; // Front
    if (normAngle >= 45 && normAngle < 135) return 1; // Side / 3/4 Front
    if (normAngle >= 135 && normAngle < 225) return 2; // Rear / 3/4 Rear
    return 3; // Side / Cockpit
  }, [angle, images.length]);

  const currentFrame = images[getFrameIndex()] || images[0];

  // Auto-rotation handler
  useEffect(() => {
    if (isAutoRotating) {
      autoRotateIntervalRef.current = setInterval(() => {
        setAngle((prev) => (prev + 1) % 360);
      }, 50);
    } else if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
    }
    return () => {
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
    };
  }, [isAutoRotating]);

  // Mouse & Touch Dragging logic
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    startXRef.current = e.clientX;
    startAngleRef.current = angle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    // 1 pixel = approx 0.65 degree of rotation
    const newAngle = Math.round((startAngleRef.current + deltaX * 0.65) % 360);
    setAngle(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoRotating(false);
      startXRef.current = e.touches[0].clientX;
      startAngleRef.current = angle;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const newAngle = Math.round((startAngleRef.current + deltaX * 0.75) % 360);
    setAngle(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Toggle Night Mode
  const toggleNightMode = () => {
    if (soundEnabled) playHapticSound('switch');
    setIsNightMode((prev) => !prev);
  };

  // Toggle Headlights
  const toggleHeadlights = () => {
    if (soundEnabled) playHapticSound('headlights');
    setHeadlightsOn((prev) => !prev);
  };

  const currentColorFilter = COLOR_PRESETS.find(c => c.id === selectedColor)?.filter || 'none';

  // Check if viewing front or rear for realistic lighting
  const normAngle = ((angle % 360) + 360) % 360;
  const isFacingFront = normAngle >= 290 || normAngle <= 70;
  const isFacingRear = normAngle >= 110 && normAngle <= 250;

  // Active hotspots visible in current angle range
  const visibleHotspots = hotspots.filter(h => {
    const [min, max] = h.angleRange;
    if (min > max) {
      // Wraps around 360
      return normAngle >= min || normAngle <= max;
    }
    return normAngle >= min && normAngle <= max;
  });

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
      className={`showroom-360-container ${isNightMode ? 'mode-night' : 'mode-day'} ${isFullscreen ? 'is-fullscreen' : ''}`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      {/* Studio Header Bar */}
      <div className="showroom-top-bar">
        <div className="showroom-badge">
          <RotateCw size={15} className={isAutoRotating ? 'spin-slow' : ''} />
          <span>SHOWROOM VIRTUAL 360°</span>
        </div>

        <div className="showroom-quick-actions">
          {/* Audio Feedback Toggle */}
          <button 
            type="button"
            className="showroom-btn-icon" 
            title={soundEnabled ? 'Efeitos Sonoros Ativos' : 'Silenciar'}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Fullscreen Button */}
          <button 
            type="button"
            className="showroom-btn-icon" 
            title="Tela Cheia"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div 
        className="showroom-stage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Overhead Spotlights (Day or Night) */}
        <div className="showroom-overhead-light"></div>
        {isNightMode && <div className="showroom-spotlights"></div>}

        {/* Headlight Beams (Frontal volumetric light) */}
        {isNightMode && headlightsOn && isFacingFront && (
          <div className="showroom-beam-front" aria-hidden="true">
            <div className="beam-cone beam-left"></div>
            <div className="beam-cone beam-right"></div>
            <div className="beam-flare beam-flare-left"></div>
            <div className="beam-flare beam-flare-right"></div>
          </div>
        )}

        {/* Rear LED Taillight Glow (Crimson lightbar) */}
        {isNightMode && headlightsOn && isFacingRear && (
          <div className="showroom-beam-rear" aria-hidden="true">
            <div className="taillight-glow"></div>
            <div className="taillight-line"></div>
          </div>
        )}

        {/* Vehicle Image with Dynamic Sheen and Color Filter */}
        <div className="showroom-vehicle-wrapper">
          <img 
            src={currentFrame} 
            alt={`${vehicle?.brand || 'Veículo'} em 360 graus - ângulo ${angle}°`}
            className="showroom-vehicle-img"
            style={{ filter: currentColorFilter }}
            draggable={false}
          />
          
          {/* Dynamic Floor Shadow & Platform */}
          <div className="showroom-floor-platform">
            <div className="platform-ring"></div>
            <div className="platform-glow"></div>
          </div>
        </div>

        {/* Interactive Hotspots Pins */}
        {visibleHotspots.map(h => (
          <div 
            key={h.id}
            className={`showroom-hotspot-pin ${activeHotspot?.id === h.id ? 'active' : ''}`}
            style={{ left: h.posX, top: h.posY }}
            onClick={(e) => {
              e.stopPropagation();
              if (soundEnabled) playHapticSound('switch');
              setActiveHotspot(activeHotspot?.id === h.id ? null : h);
            }}
          >
            <div className="hotspot-pulse"></div>
            <div className="hotspot-core">
              <Sparkles size={11} />
            </div>
          </div>
        ))}

        {/* Hotspot Info Popup Card */}
        {activeHotspot && (
          <div className="showroom-hotspot-card fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="hotspot-card-header">
              <span className="hotspot-card-title">{activeHotspot.title}</span>
              <button 
                type="button" 
                className="hotspot-card-close" 
                onClick={() => setActiveHotspot(null)}
              >
                ✕
              </button>
            </div>
            <p className="hotspot-card-desc">{activeHotspot.description}</p>
          </div>
        )}

        {/* Drag Helper Overlay */}
        <div className={`showroom-drag-helper ${isDragging ? 'is-active' : ''}`}>
          <Compass size={14} className="drag-icon" />
          <span>{isDragging ? 'Girando 360°...' : 'Arraste para girar em 360°'}</span>
        </div>

        {/* Compass Angle Badge */}
        <div className="showroom-angle-pill">
          <span>{angle}°</span>
          <span className="angle-label">
            {normAngle >= 315 || normAngle < 45 ? 'Dianteira' :
             normAngle >= 45 && normAngle < 135 ? 'Lateral Direita' :
             normAngle >= 135 && normAngle < 225 ? 'Traseira' : 'Lateral Esquerda'}
          </span>
        </div>
      </div>

      {/* Control Console / Cockpit Controls */}
      <div className="showroom-controls">
        {/* Top Control Buttons: Night Mode & Headlights */}
        <div className="showroom-controls-row">
          {/* Day / Night Mode Toggle */}
          <button 
            type="button"
            className={`showroom-btn ${isNightMode ? 'active-night' : 'active-day'}`}
            onClick={toggleNightMode}
          >
            {isNightMode ? <Moon size={16} color="#D4AF37" /> : <Sun size={16} color="#FBBF24" />}
            <span>{isNightMode ? 'Modo Showroom Noturno' : 'Modo Estúdio Diurno'}</span>
          </button>

          {/* Headlights Toggle (Visible in Night Mode) */}
          {isNightMode && (
            <button 
              type="button"
              className={`showroom-btn ${headlightsOn ? 'active-glow' : ''}`}
              onClick={toggleHeadlights}
            >
              <Lightbulb size={16} color={headlightsOn ? '#38BDF8' : '#888'} />
              <span>Faróis LED: <strong>{headlightsOn ? 'ACESOS' : 'APAGADOS'}</strong></span>
            </button>
          )}

          {/* Auto Rotation Toggle */}
          <button 
            type="button"
            className={`showroom-btn ${isAutoRotating ? 'active-gold' : ''}`}
            onClick={() => {
              if (soundEnabled) playHapticSound('switch');
              setIsAutoRotating(!isAutoRotating);
            }}
          >
            {isAutoRotating ? <Pause size={16} /> : <Play size={16} />}
            <span>{isAutoRotating ? 'Pausar Rotação' : 'Giro Automático 360°'}</span>
          </button>
        </div>

        {/* Angle Snap Presets */}
        <div className="showroom-presets-row">
          <span className="presets-label">Ângulos Rápidos:</span>
          <div className="presets-buttons">
            <button 
              type="button" 
              className={`preset-btn ${normAngle === 0 ? 'active' : ''}`} 
              onClick={() => { setAngle(0); if (soundEnabled) playHapticSound('switch'); }}
            >
              0° Frente
            </button>
            <button 
              type="button" 
              className={`preset-btn ${normAngle === 45 ? 'active' : ''}`} 
              onClick={() => { setAngle(45); if (soundEnabled) playHapticSound('switch'); }}
            >
              45° Diagonal
            </button>
            <button 
              type="button" 
              className={`preset-btn ${normAngle === 90 ? 'active' : ''}`} 
              onClick={() => { setAngle(90); if (soundEnabled) playHapticSound('switch'); }}
            >
              90° Perfil
            </button>
            <button 
              type="button" 
              className={`preset-btn ${normAngle === 180 ? 'active' : ''}`} 
              onClick={() => { setAngle(180); if (soundEnabled) playHapticSound('switch'); }}
            >
              180° Traseira
            </button>
            <button 
              type="button" 
              className={`preset-btn ${normAngle === 270 ? 'active' : ''}`} 
              onClick={() => { setAngle(270); if (soundEnabled) playHapticSound('switch'); }}
            >
              270° Interior/Detalhe
            </button>
          </div>
        </div>

        {/* Live Paint Finishes Selector */}
        <div className="showroom-paint-row">
          <div className="paint-info">
            <span className="presets-label">Pintura da Carroceria:</span>
            <span className="paint-name">
              {COLOR_PRESETS.find(c => c.id === selectedColor)?.name}
            </span>
          </div>

          <div className="paint-swatches">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color.id}
                type="button"
                className={`paint-swatch-btn ${selectedColor === color.id ? 'active' : ''}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                onClick={() => {
                  setSelectedColor(color.id);
                  if (soundEnabled) playHapticSound('switch');
                }}
              >
                {selectedColor === color.id && <Check size={12} color={color.id === 'white' ? '#000' : '#FFF'} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
