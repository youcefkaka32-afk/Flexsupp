import React, { useEffect, useState } from 'react'

export function Meteors({ number = 20, color = 'rgba(255,255,255,0.9)' }) {
  const [meteors, setMeteors] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: number }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 2,
      size: 1 + Math.random() * 1.5,
    }))
    setMeteors(generated)
  }, [number])

  return (
    <>
      {meteors.map(m => (
        <span
          key={m.id}
          style={{
            position: 'absolute',
            top: `${m.top}%`,
            left: `${m.left}%`,
            width: `${m.size}px`,
            height: `${80 + m.size * 20}px`,
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            borderRadius: '999px',
            transform: 'rotate(215deg)',
            animationName: 'meteorFall',
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes meteorFall {
          0%   { opacity: 0; transform: rotate(215deg) translateX(0); }
          5%   { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(215deg) translateX(400px); }
        }
      `}</style>
    </>
  )
}
