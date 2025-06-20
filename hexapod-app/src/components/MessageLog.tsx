'use client';

import { theme } from '@/styles/theme';

interface Props {
  messages: Array<{
    timestamp: string;
    message: string;
  }>;
  cardBackground?: string;
  borderColor?: string;
  timestampColor?: string;
  messageColor?: string;
}

export default function MessageLog({ 
  messages, 
  cardBackground = theme.surfaceSecondary,
  borderColor = theme.borderSecondary,
  timestampColor = theme.textSecondary,
  messageColor = theme.text
}: Props) {
  return (
    <div className="h-64 overflow-y-auto space-y-2 p-2">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-2 p-2 ${cardBackground} rounded-lg border ${borderColor}`}
        >
          <span className={`text-sm ${timestampColor}`}>{message.timestamp}</span>
          <span className={`text-sm ${messageColor}`}>{message.message}</span>
        </div>
      ))}
    </div>
  );
}
