
'use client';

export function AuroraBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background pointer-events-none">
      <style jsx>{`
        .aurora {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          mix-blend-mode: screen;
        }

        .aurora-item {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: drift 20s infinite alternate;
        }

        .aurora-item:nth-child(1) {
          top: 10%;
          left: 15%;
          width: 300px;
          height: 300px;
          background-color: hsl(var(--primary));
          animation-duration: 22s;
        }

        .aurora-item:nth-child(2) {
          bottom: 20%;
          right: 10%;
          width: 400px;
          height: 400px;
          background-color: hsl(var(--accent));
           animation-duration: 25s;
           animation-delay: -5s;
        }
        
        .aurora-item:nth-child(3) {
          top: 50%;
          left: 50%;
          width: 250px;
          height: 250px;
          background-color: rgba(255, 255, 255, 0.2);
           animation-duration: 18s;
           animation-delay: -10s;
        }

        @keyframes drift {
          0% {
            transform: translate(-50px, -50px) rotate(0deg);
          }
          100% {
            transform: translate(50px, 50px) rotate(30deg);
          }
        }
      `}</style>
      <div className="aurora">
        <div className="aurora-item"></div>
        <div className="aurora-item"></div>
        <div className="aurora-item"></div>
      </div>
    </div>
  );
}
