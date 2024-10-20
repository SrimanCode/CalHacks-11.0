// FireComponent.js
import React from "react";

const FireComponent = ({ isMotivMode }) => {
  const particles = Array.from({ length: 30 });

  return (
    <div className="absolute top-0 h-min w-full overflow-visible">
      {particles.map((_, index) => {
        const randomSize = Math.random() * 20 + 10;
        const randomLeft = Math.random() * 100;
        const randomAnimationDelay = Math.random() * 2;
        const randomColor = `hsl(41, 96%, 53%)`;

        return (
          <div
            key={index}
            className={`absolute rounded-full ${isMotivMode ? "animate-fall" : ""}`}
            style={{
              left: `${randomLeft}vw`,
              width: `${randomSize}px`,
              height: `${randomSize}px`,
              backgroundColor: randomColor,
              animationDelay: `${randomAnimationDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default FireComponent;
