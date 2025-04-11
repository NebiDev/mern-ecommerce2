import React, { useState, useEffect } from 'react'

import '../componentStyles/ImageSlider.css'

const images = [
    "./images/banner1.jpg",
    "./images/banner2.jpg",
    "./images/banner3.jpg",
    "./images/banner4.jpg",
    "./images/banner5.jpg",
    "./images/banner6.jpg",
];

function ImageSlider() {
    const [activeIndex, setActiveIndex] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000); // Change image every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);



  return (
    <div className='image-slider-container'>
        <div className="slider-images" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
           {images.map ((image, index) => (<div className="slider-item" key={index}>
                <img src={image} alt={`slide ${index+1}`} />
            </div>))
            }            
        </div>
        <div className="slider-dots">
            {images.map((_, index) => (
                <span
                    key={index}
                    className={`dot ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => setActiveIndex(index)}
                ></span>
            ))}
            </div>
      
    </div>
  )
}

export default ImageSlider
