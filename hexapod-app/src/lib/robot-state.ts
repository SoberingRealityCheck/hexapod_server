import { WebSocket } from 'ws';

interface RobotState {
  online: boolean;
  batteryLevel: number;
  gpsLocation: {
    latitude: number;
    longitude: number;
  };
  messages: Array<{
    timestamp: string;
    message: string;
  }>;
}

export class RobotStateDO {
  private state: RobotState = {
    online: false,
    batteryLevel: 0,
    gpsLocation: {
      latitude: 0,
      longitude: 0
    },
    messages: []
  };

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    switch (pathname) {
      case '/update': {
        const data = await request.json() as Partial<RobotState>;
        this.updateState(data);
        return new Response('OK');
      }
      case '/subscribe': {
        // For WebSocket connections, we just return a 200 OK response
        // The actual WebSocket connection will be handled separately
        return new Response('WebSocket connection established');
      }
      default:
        return new Response('Not Found', { status: 404 });
    }
  }

  private updateState(data: Partial<RobotState>): void {
    this.state = {
      ...this.state,
      ...data
    };

    // Notify all subscribers
    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    // Implementation for notifying subscribers
  }
}

export type { RobotState };
export default RobotStateDO;
