import { theme } from '@/styles/theme';
import MatrixLogoEffect from '@/components/MatrixLogoEffect';
import '@/styles/animated-logo.css';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative">
      <MatrixLogoEffect className="left-0" />
      <MatrixLogoEffect className="right-0" />
      <div className="text-center max-w-2xl">
        <main className="flex flex-col gap-[32px] items-center">
          <h1 className="text-4xl font-bold mb-4">Hexapod Monitoring System.</h1>
          <h2 className="text-2xl font-semibold mb-4">bug robots? hell yes.</h2>
          <p className="text-lg">
            Welcome to the real-time monitoring dashboard for my hexapod robot.
            This interface provides live updates on the robot&apos;s status, including:
          </p>
          <ul className="list-disc list-inside">
            <li>Live camera feed</li>
            <li>Battery level monitoring</li>
            <li>GPS location tracking</li>
            <li>Online/offline status</li>
            <li>Real-time message updates</li>
          </ul>
          <p className="text-lg">
            I plan to update this in the future with more complex infortmation displays like realtime SLAM maps and path planning
            once I get the base functionality I&apos;ve outlined here operational. We shall see!
          </p>
          <div className="mt-8">
            <a
              href="/dashboard"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors text-lg"
            >
              View Dashboard →
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
