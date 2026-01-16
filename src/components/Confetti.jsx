import { useEffect, useState } from 'react';

function Confetti({ onComplete }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Generate 30 confetti pieces
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 0.5,
      color: ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'][Math.floor(Math.random() * 6)],
      rotation: Math.random() * 360,
    }));
    setConfetti(pieces);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} border-2 border-black`}
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `confettiFall ${piece.duration}s ease-in forwards`,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
