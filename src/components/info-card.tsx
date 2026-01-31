interface InfoCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

export function InfoCard({ title, icon, children }: InfoCardProps) {
  return (
    <div className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="space-y-2 flex-1">{children}</div>
    </div>
  );
}
