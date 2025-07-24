
'use client';

export function BlobsBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background pointer-events-none">
      <style jsx>{`
        .blobs-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            filter: blur(100px);
            opacity: 0.4;
        }
        .blob {
            position: absolute;
            border-radius: 50%;
            mix-blend-mode: screen;
            animation: move 30s infinite alternate;
        }
        .blob:nth-child(1) {
            width: 400px;
            height: 400px;
            top: -50px;
            left: -100px;
            background: hsl(var(--primary));
             animation-duration: 25s;
        }
        .blob:nth-child(2) {
            width: 350px;
            height: 350px;
            bottom: -50px;
            right: -100px;
            background: hsl(var(--accent));
            animation-duration: 30s;
             animation-delay: -5s;
        }
         .blob:nth-child(3) {
            width: 250px;
            height: 250px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.2);
            animation-duration: 20s;
        }
        @keyframes move {
            from {
                transform: translate(0, 0) rotate(0deg) scale(1);
            }
            to {
                transform: translate(100px, -50px) rotate(180deg) scale(1.2);
            }
        }
      `}</style>
       <div className="blobs-container">
            <div className="blob"></div>
            <div className="blob"></div>
            <div className="blob"></div>
       </div>
    </div>
  );
}
