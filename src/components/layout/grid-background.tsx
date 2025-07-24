
'use client';

export function GridBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background pointer-events-none">
      <style jsx>{`
        .grid-container {
            width: 100%;
            height: 100%;
            position: absolute;
            background-image:
                linear-gradient(to right, hsla(var(--primary), 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, hsla(var(--primary), 0.1) 1px, transparent 1px);
            background-size: 4rem 4rem;
            animation: pan 60s linear infinite;
        }

        @keyframes pan {
            0% {
                background-position: 0% 0%;
            }
            100% {
                background-position: 100% 100%;
            }
        }
      `}</style>
      <div className="grid-container" />
    </div>
  );
}
