// types/vehicle.ts
export interface VehicleConfig {
  id: string;
  name: string;
  vin: string;
  modelUrl: string; // e.g., '/models/toyota_prado.glb'
  defaultColor: string;
  availableColors: { name: string; hex: string }[];
  bodyMeshNames: string[]; // Mesh names inside the GLTF file for car paint (e.g., ['Body', 'Hood', 'Doors'])
  rimMeshNames?: string[];
  hotspots: {
    title: string;
    description: string;
    position: [number, number, number]; // [x, y, z] coordinates on the real car
  }[];
}

