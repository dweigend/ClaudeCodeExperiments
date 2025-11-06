# Implementation Plan: Experiment 01 - Particle Body Dissolution

## Executive Summary

**Gewähltes Experiment:** Particle Body Dissolution (01)

**Begründung:** Dieses Experiment eignet sich ideal als erstes Projekt, weil es:
- Die Kernthemen (Auflösung des Körpers, Identitätsverlust) direkt visualisiert
- Wichtige three.js Techniken demonstriert (Partikel-Systeme, Morphing, Animation)
- Visuell beeindruckend genug ist, um die künstlerische Vision zu kommunizieren
- Als technische Grundlage für andere Experimente dient
- Einen guten Balance-Punkt zwischen Komplexität und Machbarkeit bietet

---

## Konzept (Vertieft)

### Künstlerische Vision
Ein humanoider Körper besteht aus Tausenden individueller Lichtpunkte. In einem hypnotischen Rhythmus löst sich die Körperform auf - die Partikel driften auseinander in den Raum, verlieren ihre organisierte Struktur. Dann, wie durch eine unsichtbare Kraft, werden sie wieder angezogen und formieren sich zurück zur menschlichen Gestalt.

Dieser endlose Zyklus symbolisiert:
- **Vergänglichkeit der physischen Form**
- **Identität als temporäres Konstrukt**
- **Der Körper als Ansammlung von Atomen/Informationen**
- **Bewusstsein zwischen Form und Formlosigkeit**

### Psychologischer Effekt
Der Betrachter erlebt:
1. **Vertrautheit** - eine erkennbare menschliche Form
2. **Auflösung** - die schockierende Zerstörung dieser Form
3. **Chaos** - völlige Strukturlosigkeit
4. **Reformation** - die beruhigende Rückkehr zur Ordnung
5. **Zyklus** - die Erkenntnis, dass dieser Prozess endlos ist

In VR wird dieser Effekt verstärkt durch:
- 360° Immersion
- Möglichkeit, um die auflösende Figur zu bewegen
- Scale-Erlebnis (Figur in Lebensgröße)

---

## Technische Architektur

### Core Technologies
- **three.js** r158+ - 3D-Rendering-Engine
- **BufferGeometry** - Effiziente Partikel-Speicherung
- **Points Material** - Rendering von Tausenden Partikeln
- **Custom Animation** - Morphing zwischen States
- **Easing Functions** - Smooth Transitions

### System Architecture

```
┌─────────────────────────────────────────┐
│         Main Application Loop           │
│  (requestAnimationFrame @ 60fps)        │
└────────────┬────────────────────────────┘
             │
             ├──> Scene Graph
             │    ├── Camera (orbiting)
             │    ├── Ambient Light
             │    └── Particle System
             │         └── BufferGeometry
             │              ├── Position Attribute
             │              ├── Color Attribute
             │              └── Size Attribute
             │
             ├──> Animation Controller
             │    ├── State: FORMED / DISSOLVING / CHAOS / REFORMING
             │    ├── Progress: 0.0 - 1.0
             │    └── Easing: Smooth interpolation
             │
             └──> Particle Behavior
                  ├── Target Positions (human form)
                  ├── Chaos Positions (random)
                  └── Interpolation Logic
```

---

## Implementation Details

### Phase 1: Project Setup

#### 1.1 Package Configuration
**File:** `package.json`

Dependencies needed:
- `three` - ^0.158.0 (latest stable)
- `vite` - ^5.0.0 (dev dependency)

```json
{
  "name": "generative-3d-art-experiments",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "three": "^0.158.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

#### 1.2 Vite Configuration
**File:** `vite.config.js`

Multi-page setup für alle Experimente:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        exp01: resolve(__dirname, 'experiments/01-particle-dissolution/index.html'),
        // Weitere Experimente später hinzufügen
      }
    }
  },
  server: {
    open: '/index.html'
  }
});
```

#### 1.3 Main Index Page
**File:** `index.html`

Landing page mit Links zu allen Experimenten:

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generative 3D Art - ICAROS VR Experiments</title>
  <style>
    body {
      margin: 0;
      padding: 40px;
      background: #000;
      color: #fff;
      font-family: 'Courier New', monospace;
    }
    h1 { color: #00ff88; }
    .experiment-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 40px;
    }
    .experiment-card {
      border: 1px solid #333;
      padding: 20px;
      background: #111;
      transition: all 0.3s;
    }
    .experiment-card:hover {
      border-color: #00ff88;
      transform: translateY(-5px);
    }
    a { color: #00ff88; text-decoration: none; }
  </style>
</head>
<body>
  <h1>Generative 3D Art Experiments</h1>
  <p>Experimente zur Verschmelzung von Körper und Cyberspace</p>

  <div class="experiment-list">
    <div class="experiment-card">
      <h3>01 - Particle Body Dissolution</h3>
      <p>Auflösung der körperlichen Form</p>
      <a href="/experiments/01-particle-dissolution/">Start →</a>
    </div>
    <!-- Weitere Experimente folgen -->
  </div>
</body>
</html>
```

---

### Phase 2: Shared Utilities

#### 2.1 Base Scene Setup
**File:** `experiments/shared/utils.js`

```javascript
import * as THREE from 'three';

/**
 * Creates a basic three.js scene with camera and renderer
 * @param {object} options - Configuration options
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
 */
export function setupResizeHandler(camera, renderer) {
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);
  return handleResize; // Return for cleanup if needed
}

/**
 * Easing functions for smooth animations
 */
export const Easing = {
  // Smooth start and end
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

  // Sine wave easing
  easeInOutSine: (t) => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
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
}
```

---

### Phase 3: Core Implementation - Particle System

#### 3.1 HTML Structure
**File:** `experiments/01-particle-dissolution/index.html`

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Particle Body Dissolution</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      overflow: hidden;
      background: #000;
    }

    canvas {
      display: block;
      touch-action: none;
    }

    #info {
      position: absolute;
      top: 20px;
      left: 20px;
      color: rgba(255, 255, 255, 0.6);
      font-family: 'Courier New', monospace;
      font-size: 12px;
      pointer-events: none;
      z-index: 100;
    }

    #controls {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.4);
      font-family: 'Courier New', monospace;
      font-size: 11px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="info">
    <div>Experiment 01: Particle Body Dissolution</div>
    <div id="fps">FPS: --</div>
    <div id="state">State: --</div>
  </div>

  <div id="controls">
    Mouse: Rotate | Scroll: Zoom | Space: Pause
  </div>

  <script type="module" src="./main.js"></script>
</body>
</html>
```

#### 3.2 Main Implementation
**File:** `experiments/01-particle-dissolution/main.js`

```javascript
import * as THREE from 'three';
import { createBasicScene, setupResizeHandler, Easing, FPSCounter } from '../shared/utils.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Particle system
  particleCount: 10000,
  particleSize: 0.02,
  particleColor: 0x00ffaa,

  // Body shape (simplified humanoid)
  bodyScale: 1.5,

  // Animation timing
  cycleDuration: 8.0, // seconds for full cycle
  holdDuration: 1.5,  // seconds to hold formed state

  // Dissolution effect
  chaosRadius: 3.0,   // how far particles spread when dissolved

  // Camera
  cameraDistance: 4.0,
  cameraRotationSpeed: 0.1,

  // Performance
  targetFPS: 60
};

// ============================================================================
// ANIMATION STATES
// ============================================================================

const AnimationState = {
  FORMED: 'FORMED',           // Body is fully formed
  DISSOLVING: 'DISSOLVING',   // Body is breaking apart
  CHAOS: 'CHAOS',             // Particles are scattered
  REFORMING: 'REFORMING'      // Particles are coming back together
};

// ============================================================================
// PARTICLE SYSTEM CLASS
// ============================================================================

class ParticleBodySystem {
  constructor(particleCount) {
    this.particleCount = particleCount;

    // Create geometry
    this.geometry = new THREE.BufferGeometry();

    // Positions (current particle positions)
    this.positions = new Float32Array(particleCount * 3);

    // Target positions (human form)
    this.targetPositions = new Float32Array(particleCount * 3);

    // Chaos positions (random scattered positions)
    this.chaosPositions = new Float32Array(particleCount * 3);

    // Initialize positions
    this.generateHumanoidShape();
    this.generateChaosPositions();

    // Set initial positions to formed state
    this.positions.set(this.targetPositions);

    // Create buffer attributes
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );

    // Material
    this.material = new THREE.PointsMaterial({
      size: CONFIG.particleSize,
      color: CONFIG.particleColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Create Points mesh
    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  /**
   * Generate particle positions in a humanoid shape
   * Simple approach: sphere for head, cylinders for body/limbs
   */
  generateHumanoidShape() {
    const scale = CONFIG.bodyScale;
    let index = 0;

    // Distribution: 20% head, 40% torso, 40% limbs
    const headCount = Math.floor(this.particleCount * 0.2);
    const torsoCount = Math.floor(this.particleCount * 0.4);
    const limbCount = this.particleCount - headCount - torsoCount;

    // HEAD (sphere)
    for (let i = 0; i < headCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.3 * scale;

      this.targetPositions[index++] = radius * Math.sin(phi) * Math.cos(theta);
      this.targetPositions[index++] = radius * Math.sin(phi) * Math.sin(theta) + 1.2 * scale;
      this.targetPositions[index++] = radius * Math.cos(phi);
    }

    // TORSO (cylinder)
    for (let i = 0; i < torsoCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = (0.2 + Math.random() * 0.15) * scale;
      const height = Math.random() * 1.0 * scale;

      this.targetPositions[index++] = radius * Math.cos(theta);
      this.targetPositions[index++] = height + 0.2 * scale;
      this.targetPositions[index++] = radius * Math.sin(theta);
    }

    // LIMBS (arms and legs - simplified as lines)
    for (let i = 0; i < limbCount; i++) {
      // 50% arms, 50% legs
      if (Math.random() < 0.5) {
        // Arms
        const side = Math.random() < 0.5 ? -1 : 1;
        const t = Math.random();
        this.targetPositions[index++] = side * (0.3 + t * 0.5) * scale;
        this.targetPositions[index++] = (0.9 - t * 0.6) * scale;
        this.targetPositions[index++] = (Math.random() - 0.5) * 0.2 * scale;
      } else {
        // Legs
        const side = Math.random() < 0.5 ? -1 : 1;
        const t = Math.random();
        this.targetPositions[index++] = side * 0.2 * scale;
        this.targetPositions[index++] = (0.2 - t * 0.8) * scale;
        this.targetPositions[index++] = (Math.random() - 0.5) * 0.2 * scale;
      }
    }
  }

  /**
   * Generate random scattered positions for chaos state
   */
  generateChaosPositions() {
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Random positions in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.random() * CONFIG.chaosRadius;

      this.chaosPositions[i3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
      this.chaosPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      this.chaosPositions[i3 + 2] = radius * Math.cos(phi);
    }
  }

  /**
   * Update particle positions based on animation progress
   * @param {number} progress - 0.0 to 1.0
   * @param {string} state - Current animation state
   */
  update(progress, state) {
    const easedProgress = Easing.easeInOutSine(progress);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      let startX, startY, startZ;
      let endX, endY, endZ;

      // Determine interpolation based on state
      if (state === AnimationState.DISSOLVING) {
        // From formed to chaos
        startX = this.targetPositions[i3 + 0];
        startY = this.targetPositions[i3 + 1];
        startZ = this.targetPositions[i3 + 2];
        endX = this.chaosPositions[i3 + 0];
        endY = this.chaosPositions[i3 + 1];
        endZ = this.chaosPositions[i3 + 2];
      } else if (state === AnimationState.REFORMING) {
        // From chaos to formed
        startX = this.chaosPositions[i3 + 0];
        startY = this.chaosPositions[i3 + 1];
        startZ = this.chaosPositions[i3 + 2];
        endX = this.targetPositions[i3 + 0];
        endY = this.targetPositions[i3 + 1];
        endZ = this.targetPositions[i3 + 2];
      } else {
        // FORMED or CHAOS - no interpolation needed
        continue;
      }

      // Linear interpolation with easing
      this.positions[i3 + 0] = startX + (endX - startX) * easedProgress;
      this.positions[i3 + 1] = startY + (endY - startY) * easedProgress;
      this.positions[i3 + 2] = startZ + (endZ - startZ) * easedProgress;
    }

    // Update geometry
    this.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Set particles to fully formed state
   */
  setFormed() {
    this.positions.set(this.targetPositions);
    this.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Set particles to chaos state
   */
  setChaos() {
    this.positions.set(this.chaosPositions);
    this.geometry.attributes.position.needsUpdate = true;
  }
}

// ============================================================================
// ANIMATION CONTROLLER
// ============================================================================

class AnimationController {
  constructor() {
    this.state = AnimationState.FORMED;
    this.progress = 0.0;
    this.timeInState = 0.0;
    this.isPaused = false;
  }

  update(deltaTime) {
    if (this.isPaused) return;

    this.timeInState += deltaTime;

    // State machine
    switch (this.state) {
      case AnimationState.FORMED:
        if (this.timeInState >= CONFIG.holdDuration) {
          this.transitionTo(AnimationState.DISSOLVING);
        }
        break;

      case AnimationState.DISSOLVING:
        this.progress = Math.min(this.timeInState / 2.0, 1.0);
        if (this.progress >= 1.0) {
          this.transitionTo(AnimationState.CHAOS);
        }
        break;

      case AnimationState.CHAOS:
        if (this.timeInState >= CONFIG.holdDuration) {
          this.transitionTo(AnimationState.REFORMING);
        }
        break;

      case AnimationState.REFORMING:
        this.progress = Math.min(this.timeInState / 2.5, 1.0);
        if (this.progress >= 1.0) {
          this.transitionTo(AnimationState.FORMED);
        }
        break;
    }
  }

  transitionTo(newState) {
    this.state = newState;
    this.progress = 0.0;
    this.timeInState = 0.0;
  }

  toggle() {
    this.isPaused = !this.isPaused;
  }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

class App {
  constructor() {
    // Setup scene
    const sceneData = createBasicScene({
      backgroundColor: 0x000000,
      cameraPosition: { x: 0, y: 1, z: CONFIG.cameraDistance }
    });

    this.scene = sceneData.scene;
    this.camera = sceneData.camera;
    this.renderer = sceneData.renderer;

    setupResizeHandler(this.camera, this.renderer);

    // Create particle system
    this.particleSystem = new ParticleBodySystem(CONFIG.particleCount);
    this.scene.add(this.particleSystem.mesh);

    // Add subtle lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    // Animation controller
    this.animationController = new AnimationController();

    // Time tracking
    this.clock = new THREE.Clock();
    this.fpsCounter = new FPSCounter();

    // Camera orbit
    this.cameraAngle = 0;

    // Input handling
    this.setupInput();

    // UI elements
    this.fpsElement = document.getElementById('fps');
    this.stateElement = document.getElementById('state');

    // Start animation loop
    this.animate();
  }

  setupInput() {
    // Mouse controls for camera
    let isDragging = false;
    let previousMouseX = 0;

    document.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        this.cameraAngle += deltaX * 0.005;
      }
      previousMouseX = e.clientX;
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.animationController.toggle();
        e.preventDefault();
      }
    });

    // Zoom with mouse wheel
    document.addEventListener('wheel', (e) => {
      this.camera.position.z += e.deltaY * 0.005;
      this.camera.position.z = Math.max(2, Math.min(10, this.camera.position.z));
      e.preventDefault();
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();

    // Update animation
    this.animationController.update(deltaTime);

    // Update particle system
    this.particleSystem.update(
      this.animationController.progress,
      this.animationController.state
    );

    // Update camera orbit
    this.cameraAngle += CONFIG.cameraRotationSpeed * deltaTime;
    this.camera.position.x = Math.sin(this.cameraAngle) * CONFIG.cameraDistance;
    this.camera.position.z = Math.cos(this.cameraAngle) * CONFIG.cameraDistance;
    this.camera.lookAt(0, 0.5, 0);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Update UI
    const fps = this.fpsCounter.update();
    this.fpsElement.textContent = `FPS: ${fps}`;
    this.stateElement.textContent = `State: ${this.animationController.state}`;
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
```

---

### Phase 4: Documentation

#### 4.1 Experiment README
**File:** `experiments/01-particle-dissolution/README.md`

```markdown
# Experiment 01: Particle Body Dissolution

## Konzept

Ein humanoider Körper aus 10.000 Lichtpartikeln löst sich in einem hypnotischen Rhythmus auf und reformiert sich wieder. Dies symbolisiert die Vergänglichkeit der physischen Form und die Auflösung der Identität.

## Technische Umsetzung

- **Partikelsystem:** THREE.Points mit BufferGeometry
- **Partikelanzahl:** 10.000
- **Morphing:** Linear interpolation zwischen zwei Zuständen (geformt/aufgelöst)
- **Animation:** State Machine mit 4 Zuständen
- **Rendering:** Additive Blending für Leuchteffekt

## Steuerung

- **Maus ziehen:** Kamera rotieren
- **Mausrad:** Zoom
- **Leertaste:** Animation pausieren/fortsetzen

## Performance

- **Target:** 60 FPS
- **Partikel:** 10.000
- **Draw Calls:** 1 (optimiert durch BufferGeometry)

## Künstlerische Entscheidungen

1. **Farbe:** Cyan (#00ffaa) - technologisch, kalt, digital
2. **Geschwindigkeit:** Langsam (8s Zyklus) - meditativ, hypnotisch
3. **Form:** Vereinfachter Humanoid - erkennbar aber abstrakt
4. **Chaos:** Sphärische Verteilung - organisches Auseinanderdriften

## VR-Bereitschaft

- Performance optimiert für 90fps
- Keine VR-spezifischen Controls implementiert
- Bereit für WebXR Integration

## Mögliche Erweiterungen

- Audio-Reaktivität
- Mehrere Körper gleichzeitig
- Interaktion: Partikel mit Hand "wegpusten"
- Color shifts basierend auf emotionalen Zuständen
```

---

## Implementation Timeline

### Estimated Time: 4-6 hours

1. **Setup (30 min)**
   - package.json erstellen
   - Dependencies installieren
   - Vite konfigurieren
   - Main index.html

2. **Shared Utilities (45 min)**
   - utils.js implementieren
   - Testen und verfeinern

3. **Particle System (2 hours)**
   - ParticleBodySystem class
   - Humanoid shape generation
   - Position interpolation

4. **Animation System (1 hour)**
   - AnimationController state machine
   - Easing integration
   - Timing tuning

5. **Integration & Polish (1 hour)**
   - Camera controls
   - UI elements
   - Performance optimization

6. **Documentation (30 min)**
   - README schreiben
   - Code comments
   - Inline documentation

---

## Success Criteria

✅ Particle system renders smoothly (60fps)
✅ Body shape is recognizable as humanoid
✅ Dissolution/reformation cycle is smooth and hypnotic
✅ Camera controls are intuitive
✅ Code is clean and well-documented
✅ Experiment is fully self-contained

---

## Known Limitations & Future Work

1. **Body Shape:** Currently simplified - could use actual 3D model data
2. **Physics:** No physics simulation - particles follow strict interpolation
3. **Interaction:** No user interaction with particles yet
4. **Audio:** No sound design yet
5. **VR:** WebXR not yet implemented

---

## Technical Decisions Explained

### Why BufferGeometry?
- **Performance:** Direct GPU upload, minimal overhead
- **Scalability:** Can handle 10k+ particles easily
- **Control:** Full control over attributes

### Why State Machine?
- **Clarity:** Easy to understand animation flow
- **Extensibility:** Easy to add new states
- **Debugging:** Clear state at any time

### Why Linear Interpolation?
- **Simplicity:** Easy to implement and understand
- **Performance:** Very fast calculation
- **Smoothness:** With easing, looks very smooth

### Why Additive Blending?
- **Aesthetic:** Creates glowing, ethereal effect
- **Depth:** Overlapping particles create brightness variation
- **Digital:** Reinforces the digital/cybernetic theme

---

**Next Steps After Implementation:**
1. Test thoroughly
2. Adjust timing and parameters based on feeling
3. Record demo video
4. Plan next experiment (Void Walker or Mirror Realms)
