interface InfoItemProps {
  label: string;
  value: string;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-white/50 text-xs">{label}</p>
      <p className="text-white/90">{value}</p>
    </div>
  );
}
