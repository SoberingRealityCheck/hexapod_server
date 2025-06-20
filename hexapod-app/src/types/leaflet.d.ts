declare module 'leaflet' {
  export class Map {
    constructor(
      container: HTMLElement,
      options?: {
        zoomControl?: boolean;
        scrollWheelZoom?: boolean;
      }
    );
    setView(center: [number, number], zoom: number): Map;
    remove(): void;
  }

  export function map(
    container: HTMLElement,
    options?: {
      zoomControl?: boolean;
      scrollWheelZoom?: boolean;
    }
  ): Map;

  export function tileLayer(
    url: string,
    options?: {
      attribution?: string;
    }
  ): any;

  export function marker(position: [number, number]): any;
  export function circle(position: [number, number], options: any): any;
}
