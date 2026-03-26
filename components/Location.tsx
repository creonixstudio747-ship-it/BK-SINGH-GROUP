"use client";

import React from "react";
import { MapPin, Navigation, Maximize2 } from "lucide-react";

const Location: React.FC = () => {
    return (
        <section className="campus-location container">
            <div className="location-container grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="location-details">
                    <div className="section-header" style={{ textAlign: "left", marginBottom: "2rem" }}>
                        <h2 className="text-3xl font-bold cyber-green-text">Visit the B.K. Singh Hub</h2>
                        <p className="text-zinc-400">Experience excellence in person at our Bagaha campus</p>
                    </div>
                    
                    <div className="address-box flex items-start gap-4 p-6 glass-card-inner mb-8">
                        <MapPin className="text-green-400 shrink-0" />
                        <div className="address-text text-zinc-300">
                            43M6+558, Sukhban,<br />
                            Bagaha, Bihar 845105
                        </div>
                    </div>

                    <a href="https://www.google.com/maps/dir/?api=1&destination=43M6%2B558,+Sukhban,+Bagaha,+Bihar+845105" 
                       target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full flex items-center justify-center gap-2 mb-12">
                        <Navigation size={18} />
                        Get Directions on Google Maps
                    </a>

                    <div className="photo-gallery grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="gallery-item relative aspect-square glass-card overflow-hidden group cursor-pointer">
                                <img src={`/assets/location${i}.jpg`} alt={`Location ${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="gallery-overlay absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 className="text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="map-wrapper glass-card overflow-hidden h-[500px]">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550!2d83.9!3d27.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3993000000000001%3A0x0!2zQi5LLiBTaW5naCBHcm91cCwgQmFnYWhh!5e0!3m2!1sen!2sin!4v1711310000000!5m2!1sen!2sin" 
                        className="w-full h-full border-none grayscale contrast-125"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default Location;
