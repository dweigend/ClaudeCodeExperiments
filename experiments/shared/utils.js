import * as THREE from 'three';

/**
 * Creates a basic three.js scene with camera and renderer
 * @param {object} options - Configuration options
 * @param {number} options.backgroundColor - Background color (hex)
 * @param {object} options.cameraPosition - Camera position {x, y, z}
 * @param {number} options.fov - Field of view
 * @param {number} options.near - Near clipping plane
 * @param {number} options.far - Far clipping plane
 * @returns {object} { scene, camera, renderer }
 */
export function createBasicScene(options = {}) {
  const {
    backgroundColor = 0x000000,
    cameraPosition = { x: 0, y: 0, z: 5 },
    fov = 75,
    near = 0.1,
    far = 1000
  } = options;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);
  scene.fog = new THREE.Fog(backgroundColor, 10, 50);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

/**
 * Sets up automatic resize handling
 * @param {THREE.Camera} camera - The camera to update
 * @param {THREE.WebGLRenderer} renderer - The renderer to resize
 * @returns {function} Cleanup function
 */
export function setupResizeHandler(camera, renderer) {
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => window.removeEventListener('resize', handleResize);
}

/**
 * Easing functions for smooth animations
 * All functions take t (0.0 to 1.0) and return eased value (0.0 to 1.0)
 */
export const Easing = {
  // No easing
  linear: (t) => t,

  // Smooth start and end (cubic)
  easeInOutCubic: (t) => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  // Smooth start, sharp end
  easeInCubic: (t) => {
    return t * t * t;
  },

  // Sharp start, smooth end
  easeOutCubic: (t) => {
    return 1 - Math.pow(1 - t, 3);
  },

  // Sine wave easing (very smooth)
  easeInOutSine: (t) => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  },

  // Elastic bounce at end
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Back and forth motion
  easeInOutBack: (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  }
};

/**
 * FPS Counter for performance monitoring
 */
export class FPSCounter {
  constructor() {
    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 60;
  }

  /**
   * Update FPS calculation (call every frame)
   * @returns {number} Current FPS
   */
  update() {
    this.frames++;
    const now = performance.now();

    if (now >= this.lastTime + 1000) {
      this.fps = Math.round((this.frames * 1000) / (now - this.lastTime));
      this.frames = 0;
      this.lastTime = now;
    }

    return this.fps;
  }

  /**
   * Get current FPS without updating
   * @returns {number} Current FPS
   */
  get() {
    return this.fps;
  }
}

/**
 * Simple camera orbit controller
 */
export class OrbitController {
  constructor(camera, target = new THREE.Vector3(0, 0, 0)) {
    this.camera = camera;
    this.target = target;
    this.angle = 0;
    this.elevation = 0;
    this.distance = camera.position.distanceTo(target);
    this.autoRotate = false;
    this.autoRotateSpeed = 0.1;
  }

  /**
   * Update camera position based on angle and elevation
   * @param {number} deltaTime - Time since last frame
   */
  update(deltaTime) {
    if (this.autoRotate) {
      this.angle += this.autoRotateSpeed * deltaTime;
    }

    const x = this.target.x + this.distance * Math.sin(this.angle) * Math.cos(this.elevation);
    const y = this.target.y + this.distance * Math.sin(this.elevation);
    const z = this.target.z + this.distance * Math.cos(this.angle) * Math.cos(this.elevation);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }

  /**
   * Rotate camera by delta angle
   * @param {number} deltaAngle - Angle change in radians
   */
  rotate(deltaAngle) {
    this.angle += deltaAngle;
  }

  /**
   * Change elevation
   * @param {number} deltaElevation - Elevation change in radians
   */
  elevate(deltaElevation) {
    this.elevation = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.elevation + deltaElevation));
  }

  /**
   * Zoom in/out
   * @param {number} deltaDistance - Distance change
   */
  zoom(deltaDistance) {
    this.distance = Math.max(1, Math.min(20, this.distance + deltaDistance));
  }
}

/**
 * Random number utilities
 */
export const Random = {
  /**
   * Random float between min and max
   */
  range: (min, max) => Math.random() * (max - min) + min,

  /**
   * Random integer between min and max (inclusive)
   */
  int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  /**
   * Random point on unit sphere surface
   */
  onSphere: () => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi)
    };
  },

  /**
   * Random point inside unit sphere
   */
  inSphere: () => {
    const point = Random.onSphere();
    const radius = Math.cbrt(Math.random()); // Cubic root for uniform distribution
    return {
      x: point.x * radius,
      y: point.y * radius,
      z: point.z * radius
    };
  },

  /**
   * Pick random element from array
   */
  pick: (array) => array[Math.floor(Math.random() * array.length)]
};

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Progress (0.0 to 1.0)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map value from one range to another
 * @param {number} value - Input value
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
export function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Debug utilities
 */
export const Debug = {
  /**
   * Log renderer info
   */
  logRendererInfo: (renderer) => {
    console.log('Renderer Info:', {
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      points: renderer.info.render.points,
      lines: renderer.info.render.lines,
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures
    });
  },

  /**
   * Create FPS display element
   */
  createFPSDisplay: () => {
    const element = document.createElement('div');
    element.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      color: #00ff88;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
    `;
    document.body.appendChild(element);
    return element;
  }
};
