'use client';

interface Props {
  level: number;
}

export default function BatteryIndicator({ level }: Props) {
  const getBatteryClass = () => {
    if (level >= 75) return 'bg-green-500';
    if (level >= 50) return 'bg-blue-500';
    if (level >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-32 h-4 bg-gray-700 rounded-full">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${getBatteryClass()}`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="text-sm text-gray-300">{level}%</span>
    </div>
  );
}
