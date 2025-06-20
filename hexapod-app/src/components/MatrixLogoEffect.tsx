'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Props {
  className?: string;
}

export default function MatrixLogoEffect({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [logos, setLogos] = useState<{ x: number; y: number; speed: number }[]>([]);

  // Initialize logos on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const initialLogos = Array.from({ length: 20 }, () => ({
      x: Math.random() * (width / 2) + (width / 4),
      y: Math.random() * height,
      speed: 2 + Math.random() * 3
    }));

    // Add more logos to the other side
    const moreLogos = Array.from({ length: 20 }, () => ({
      x: Math.random() * (width / 2) + (width / 4),
      y: Math.random() * height,
      speed: 2 + Math.random() * 3
    }));

    setLogos([...initialLogos, ...moreLogos]);
    setLogos(initialLogos);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Create initial logos
    const initialLogos = Array.from({ length: 10 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 2 + Math.random() * 3 // Random speed between 2 and 5
    }));
    setLogos(initialLogos);

    const animate = () => {
      setLogos((prevLogos) => {
        return prevLogos.map((logo) => {
          // Move logo down
          const newY = logo.y + logo.speed;
          
          // If logo is off screen, reset to top
          if (newY > height) {
            return {
              ...logo,
              y: -50, // Start above screen
              x: Math.random() * width, // Random new x position
              speed: 2 + Math.random() * 3 // Random new speed
            };
          }
          return { ...logo, y: newY };
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div
      className={`fixed top-0 h-screen ${className} overflow-hidden w-1/4 bg-black/10`}
      ref={containerRef}
    >
      {logos.map((logo, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: logo.x,
            top: logo.y,
            transform: `translate(-50%, -50%)`,
            zIndex: 1,
            opacity: 0.6,
          }}
        >
          <Image
            src="/hexapod-logo.svg"
            alt="Hexapod Logo"
            width={30}
            height={30}
            style={{
              filter: 'hue-rotate(120deg)', // Make it green like Matrix
            }}
          />
        </div>
      ))}
    </div>
  );
}
