export function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-6"
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 50% 50%, #1a1a2e 0%, #0d0d1a 100%)",
      }}
    >
      <span className="text-8xl animate-spin [animation-duration:2s]">🌍</span>
      <p className="text-white/70 text-lg animate-pulse">Exploring the world</p>
    </div>
  );
}
