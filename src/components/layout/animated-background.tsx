'use client';

export function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background">
      <style jsx>{`
        .lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          margin: auto;
          width: 90vw;
        }

        .line {
          position: absolute;
          width: 1px;
          height: 100%;
          top: 0;
          left: 50%;
          background: rgba(204, 255, 0, 0.05);
          overflow: hidden;
        }

        .line::after {
          content: '';
          display: block;
          position: absolute;
          height: 15vh;
          width: 100%;
          top: -50%;
          left: 0;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #ccff00 75%, #ccff00 100%);
          animation: drop 7s 0s infinite;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
        }

        .line:nth-child(1) {
          margin-left: -40%;
        }
        .line:nth-child(1)::after {
          animation-delay: 2s;
        }
        .line:nth-child(3) {
          margin-left: 40%;
        }
        .line:nth-child(3)::after {
          animation-delay: 2.5s;
        }
        .line:nth-child(4) {
          margin-left: -20%;
          
        }
        .line:nth-child(4)::after {
           animation-delay: 1.5s;
        }
         .line:nth-child(5) {
          margin-left: 20%;
        }
        .line:nth-child(5)::after {
           animation-delay: 3s;
        }


        @keyframes drop {
          0% {
            top: -50%;
          }
          100% {
            top: 110%;
          }
        }
      `}</style>
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </div>
  );
}
