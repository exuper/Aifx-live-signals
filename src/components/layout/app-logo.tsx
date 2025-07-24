export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
       <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2L2 22H22L12 2ZM12 11.618L15.636 18H8.364L12 11.618Z"
          fill="currentColor"
        />
      </svg>
      <h1 className="text-xl font-bold font-headline text-foreground">
        AI Forex Signals
      </h1>
    </div>
  );
}
