import React from 'react';
import './Hero.css';
import heroImage from '../assets/hero_banner.png';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-background">
                <img src={heroImage} alt="Anime Merchandise Banner" />
                <div className="hero-overlay"></div>
            </div>
            <div className="container hero-content">
                <h2 className="hero-subtitle">WELCOME TO BAWK</h2>
                <h1 className="hero-title">
                    HAVE THE BEST <span className="text-stroke">ANIME</span><br />
                    COLLECTIONS
                </h1>
                <p className="hero-offer">UP TO <span className="highlight-yellow">30% OFF</span> ON ALL FIGURES</p>
                <button className="primary-btn">SHOP NOW</button>
            </div>
        </section>
    );
};

export default Hero;
