'use client';

interface Props {
  online: boolean;
}

export default function StatusIndicator({ online }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'}`}
      />
      <span className="text-sm text-gray-300">{online ? 'Online' : 'Offline'}</span>
    </div>
  );
}
