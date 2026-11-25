import * as THREE from "three";

export interface GlobePinConfig {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  destination: "hero" | "projects";
  tag: string;
  subtitle: string;
}

export const GLOBE_PINS: GlobePinConfig[] = [
  {
    id: "kolkata",
    city: "Kolkata",
    country: "India",
    lat: 22.5726,
    lon: 88.3639,
    destination: "hero",
    tag: "HOME · PORTFOLIO",
    subtitle: "Enter Main Portfolio",
  },
  {
    id: "delhi",
    city: "Delhi",
    country: "India",
    lat: 28.6139,
    lon: 77.209,
    destination: "projects",
    tag: "CLIENT · INDIA & EXPORT",
    subtitle: "Multi-Region & International Export",
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "UAE",
    lat: 25.2048,
    lon: 55.2708,
    destination: "projects",
    tag: "CLIENT · UAE",
    subtitle: "Middle East Deployment",
  },
  {
    id: "russia",
    city: "Moscow",
    country: "Russia",
    lat: 55.7558,
    lon: 37.6173,
    destination: "projects",
    tag: "CLIENT · RUSSIA",
    subtitle: "Eurasia Enterprise Systems",
  },
  {
    id: "latvia",
    city: "Riga",
    country: "Latvia",
    lat: 56.9496,
    lon: 24.1052,
    destination: "projects",
    tag: "CLIENT · LATVIA",
    subtitle: "Baltic / EU Operations",
  },
];

/**
 * Convert geographic latitude / longitude (degrees) to 3D sphere coordinates.
 * Matches standard right-handed Three.js Y-up sphere orientation.
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
  target = new THREE.Vector3()
): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return target.set(x, y, z);
}

// Simplified, geographically accurate [lon, lat] landmass polygons
// Covers North America, South America, Greenland, Europe, UK/Ireland, Africa,
// Madagascar, Asia (Middle East, India, Russia, SE Asia, China, Japan), Australia, New Zealand.
const LAND_POLYGONS: Array<Array<[number, number]>> = [
  // North America
  [
    [-168, 66], [-162, 70], [-140, 70], [-125, 71], [-95, 74], [-80, 72],
    [-64, 62], [-55, 52], [-66, 44], [-75, 36], [-81, 31], [-80, 25],
    [-83, 29], [-90, 29], [-97, 26], [-96, 19], [-88, 21], [-83, 15],
    [-78, 8], [-82, 9], [-88, 13], [-95, 16], [-105, 20], [-110, 24],
    [-117, 32], [-124, 40], [-125, 49], [-136, 58], [-152, 60], [-162, 55],
    [-166, 60],
  ],
  // Greenland
  [
    [-52, 60], [-42, 60], [-32, 68], [-20, 75], [-26, 82], [-48, 82],
    [-68, 77], [-58, 69],
  ],
  // South America
  [
    [-78, 9], [-72, 12], [-62, 10], [-50, 1], [-35, -6], [-39, -15],
    [-40, -22], [-48, -28], [-54, -34], [-62, -40], [-67, -50], [-69, -55],
    [-74, -52], [-73, -42], [-71, -30], [-70, -18], [-77, -12], [-81, -5],
    [-79, 2],
  ],
  // Europe (mainland + Scandinavia + Baltics)
  [
    [-9, 37], [-9, 43], [-2, 43], [-4, 48], [2, 51], [8, 54], [8, 58],
    [5, 61], [12, 67], [20, 70], [30, 70], [32, 66], [28, 60], [21, 60],
    [18, 59], [14, 55], [20, 55], [24, 57], [28, 60], [30, 56], [28, 52],
    [29, 46], [28, 41], [23, 38], [19, 40], [16, 38], [12, 42], [9, 44],
    [3, 42], [-5, 36],
  ],
  // UK & Ireland
  [
    [-6, 50], [1, 51], [1, 53], [-2, 58], [-6, 58], [-6, 54], [-10, 54],
    [-10, 51],
  ],
  // Africa
  [
    [-17, 15], [-13, 28], [-6, 36], [10, 37], [12, 33], [25, 32], [33, 31],
    [39, 21], [43, 12], [51, 12], [49, 4], [41, -2], [40, -11], [35, -20],
    [33, -26], [28, -33], [19, -35], [15, -26], [12, -16], [12, -5],
    [9, 4], [2, 6], [-8, 5], [-15, 11],
  ],
  // Madagascar
  [
    [44, -25], [47, -25], [50, -15], [49, -12], [44, -17],
  ],
  // Asia (Arabia, India, Russia, China, SE Asia)
  [
    [27, 41], [36, 42], [42, 42], [41, 47], [48, 46], [49, 53], [56, 58],
    [60, 68], [72, 72], [95, 76], [115, 74], [140, 72], [170, 68], [178, 65],
    [164, 59], [156, 51], [142, 54], [136, 44], [129, 35], [126, 38],
    [121, 39], [122, 31], [117, 24], [109, 20], [109, 12], [103, 2],
    [100, 8], [97, 16], [91, 22], [86, 20], [80, 13], [77, 8], [73, 16],
    [69, 23], [61, 25], [56, 26], [51, 25], [48, 30], [56, 22], [58, 19],
    [45, 13], [39, 21], [35, 29], [36, 36],
  ],
  // Japan
  [
    [130, 31], [135, 34], [141, 38], [145, 44], [140, 45], [137, 37],
    [131, 34],
  ],
  // Indonesia / Borneo / Sumatra / Java (simplified islands)
  [
    [95, 5], [105, -2], [106, -7], [114, -8], [114, -6], [104, 1],
  ],
  [
    [109, 1], [117, 5], [118, -3], [111, -3],
  ],
  // Australia
  [
    [114, -22], [122, -17], [131, -12], [137, -12], [142, -11], [146, -18],
    [153, -27], [150, -37], [141, -38], [131, -32], [121, -34], [115, -34],
    [113, -26],
  ],
  // New Zealand
  [
    [167, -46], [174, -41], [178, -37], [173, -35], [170, -42],
  ],
];

function isPointInPolygon(lon: number, lat: number, poly: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];

    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function isLand(lon: number, lat: number): boolean {
  for (let i = 0; i < LAND_POLYGONS.length; i++) {
    if (isPointInPolygon(lon, lat, LAND_POLYGONS[i])) return true;
  }
  return false;
}

export interface GeneratedGlobeData {
  positions: Float32Array;
  isLandFlags: Uint8Array;
  count: number;
}

/**
 * Generates an evenly distributed Fibonacci-sphere real-world dotted globe.
 * Landmasses receive dense, crisp dots; oceans receive sparse subtle latitude/longitude
 * silhouette dots so the 3D sphere reads unmistakably from every angle.
 */
export function generateWorldGlobeDots(
  targetCount: number,
  radius: number
): GeneratedGlobeData {
  const positions = new Float32Array(targetCount * 3);
  const isLandFlags = new Uint8Array(targetCount);

  // Oversample Fibonacci sphere to collect dense land dots + sparse ocean frame dots
  const candidateSamples = targetCount * 3;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const landCoords: Array<[number, number, number]> = [];
  const oceanCoords: Array<[number, number, number]> = [];

  for (let i = 0; i < candidateSamples; i++) {
    const yNorm = 1 - (i / (candidateSamples - 1)) * 2; // 1 to -1
    const rSlice = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
    const theta = goldenAngle * i;

    const xNorm = Math.cos(theta) * rSlice;
    const zNorm = Math.sin(theta) * rSlice;

    const lat = Math.asin(yNorm) * (180 / Math.PI);
    // Invert latLonToVector3 convention cleanly:
    // x = -sin(phi)*cos(lon+180), z = sin(phi)*sin(lon+180)
    const lonRad = Math.atan2(zNorm, -xNorm);
    let lon = (lonRad * 180) / Math.PI - 180;
    if (lon < -180) lon += 360;
    if (lon > 180) lon -= 360;

    if (lat > -58 && isLand(lon, lat)) {
      landCoords.push([xNorm * radius, yNorm * radius, zNorm * radius]);
    } else if (i % 19 === 0 && Math.abs(lat) < 78) {
      oceanCoords.push([xNorm * radius, yNorm * radius, zNorm * radius]);
    }
  }

  // Fill ~88% with land dots and ~12% with subtle ocean silhouette dots
  const maxLandTarget = Math.min(landCoords.length, Math.floor(targetCount * 0.88));
  let writeIdx = 0;

  // Deterministic stride through landCoords for uniform coverage
  const landStep = landCoords.length / Math.max(1, maxLandTarget);
  for (let i = 0; i < maxLandTarget && writeIdx < targetCount; i++) {
    const pt = landCoords[Math.floor(i * landStep)];
    const i3 = writeIdx * 3;
    positions[i3] = pt[0];
    positions[i3 + 1] = pt[1];
    positions[i3 + 2] = pt[2];
    isLandFlags[writeIdx] = 1;
    writeIdx++;
  }

  // Fill remaining slots with sparse ocean silhouette dots
  let oIdx = 0;
  while (writeIdx < targetCount && oceanCoords.length > 0) {
    const pt = oceanCoords[oIdx % oceanCoords.length];
    const i3 = writeIdx * 3;
    positions[i3] = pt[0];
    positions[i3 + 1] = pt[1];
    positions[i3 + 2] = pt[2];
    isLandFlags[writeIdx] = 0;
    writeIdx++;
    oIdx++;
  }

  return {
    positions,
    isLandFlags,
    count: targetCount,
  };
}
