export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <span className="text-8xl animate-spin [animation-duration:2s]">🌍</span>
      <p className="text-white/70 text-lg animate-pulse">Exploring the world</p>
    </div>
  );
}
