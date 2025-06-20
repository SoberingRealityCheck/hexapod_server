import { theme } from '@/styles/theme';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold mb-4">Hexapod Monitoring System</h1>
        <p className="text-lg text-center max-w-2xl">
          Welcome to the real-time monitoring dashboard for the hexapod robot.
          This interface provides live updates on the robot&apos;s status, including:
        </p>
        <ul className="list-disc list-inside text-center max-w-xl mx-auto">
          <li>Live camera feed</li>
          <li>Battery level monitoring</li>
          <li>GPS location tracking</li>
          <li>Online/offline status</li>
          <li>Real-time message updates</li>
        </ul>
        <div className="mt-8 flex justify-center">
          <a
            href="/dashboard"
            className={`${theme.buttonPrimary} ${theme.buttonPrimaryText} ${theme.buttonPrimaryHover} px-8 py-4 text-lg font-semibold ${theme.transition} ${theme.buttonPrimaryShadow} hover:shadow-lg rounded-full`}
          >
            View Dashboard →
          </a>
        </div>
      </main>
    </div>
  );
}
