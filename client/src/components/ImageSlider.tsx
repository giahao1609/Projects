import React, { useState, useEffect } from 'react';
import '../styles/slider.css'; // Import file CSS cho slider

const ImageSlider: React.FC = () => {
  const images = [
    '/assets/image1.jpg',
    '/assets/image2.png',
    '/assets/image3.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Chuyển ảnh mỗi 3 giây
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider-container">
      <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div className="slider-item" key={index}>
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
