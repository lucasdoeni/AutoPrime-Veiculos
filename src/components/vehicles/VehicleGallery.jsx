import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import './VehicleGallery.css';

export default function VehicleGallery({ images = [], altText = 'Veículo' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
  ];

  const photoList = images.length > 0 ? images : fallbackImages;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? photoList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === photoList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="vehicle-gallery">
      {/* Main Viewport */}
      <div className="gallery-main-viewport">
        <img 
          src={photoList[selectedIndex]} 
          alt={`${altText} - foto ${selectedIndex + 1}`} 
          className="gallery-main-img"
        />

        {photoList.length > 1 && (
          <>
            <button 
              className="gallery-nav-arrow gallery-nav-prev" 
              onClick={handlePrev}
              aria-label="Foto anterior"
              type="button"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="gallery-nav-arrow gallery-nav-next" 
              onClick={handleNext}
              aria-label="Próxima foto"
              type="button"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="gallery-counter-badge">
          <Camera size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          <span>{selectedIndex + 1} / {photoList.length}</span>
        </div>
      </div>

      {/* Thumbnails */}
      {photoList.length > 1 && (
        <div className="gallery-thumbs-strip">
          {photoList.map((imgUrl, idx) => (
            <div 
              key={idx} 
              className={`gallery-thumb-item ${selectedIndex === idx ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
            >
              <img src={imgUrl} alt={`Miniatura ${idx + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
