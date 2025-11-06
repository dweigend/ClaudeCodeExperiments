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
  formHoldDuration: 1.5,    // seconds to hold formed state
  dissolveDuration: 2.0,    // seconds to dissolve
  chaosHoldDuration: 1.5,   // seconds to hold chaos state
  reformDuration: 2.5,      // seconds to reform

  // Dissolution effect
  chaosRadius: 3.0,         // how far particles spread when dissolved

  // Camera
  cameraDistance: 4.0,
  cameraHeight: 0.5,
  cameraRotationSpeed: 0.1,

  // Visual
  backgroundColor: 0x000000,
  additiveBl: true
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
      blending: CONFIG.additiveBl ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
      sizeAttenuation: true
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
      const radius = 0.3 * scale * Math.cbrt(Math.random()); // Uniform distribution in volume

      this.targetPositions[index++] = radius * Math.sin(phi) * Math.cos(theta);
      this.targetPositions[index++] = radius * Math.sin(phi) * Math.sin(theta) + 1.2 * scale;
      this.targetPositions[index++] = radius * Math.cos(phi);
    }

    // TORSO (cylinder with slight taper)
    for (let i = 0; i < torsoCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const height = Math.random();
      const radiusScale = 0.15 + (1 - height) * 0.1; // Wider at shoulders, narrower at waist
      const radius = radiusScale * scale * Math.sqrt(Math.random()); // Uniform in circle

      this.targetPositions[index++] = radius * Math.cos(theta);
      this.targetPositions[index++] = height * 1.0 * scale + 0.2 * scale;
      this.targetPositions[index++] = radius * Math.sin(theta);
    }

    // LIMBS (arms and legs - simplified as lines with thickness)
    const armsCount = Math.floor(limbCount * 0.5);
    const legsCount = limbCount - armsCount;

    // Arms
    for (let i = 0; i < armsCount; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const t = Math.random(); // Position along arm
      const thickness = (Math.random() - 0.5) * 0.1 * scale;

      this.targetPositions[index++] = side * (0.3 + t * 0.5) * scale + thickness * Math.random();
      this.targetPositions[index++] = (0.9 - t * 0.6) * scale;
      this.targetPositions[index++] = thickness * Math.random();
    }

    // Legs
    for (let i = 0; i < legsCount; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const t = Math.random(); // Position along leg
      const thickness = (Math.random() - 0.5) * 0.1 * scale;

      this.targetPositions[index++] = side * 0.2 * scale + thickness * Math.random();
      this.targetPositions[index++] = (0.2 - t * 0.8) * scale;
      this.targetPositions[index++] = thickness * Math.random();
    }
  }

  /**
   * Generate random scattered positions for chaos state
   */
  generateChaosPositions() {
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Random positions in a sphere with non-uniform distribution
      // (more particles near center, creating organic feel)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = CONFIG.chaosRadius * Math.pow(Math.random(), 0.7); // Power curve for distribution

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
        if (this.timeInState >= CONFIG.formHoldDuration) {
          this.transitionTo(AnimationState.DISSOLVING);
        }
        break;

      case AnimationState.DISSOLVING:
        this.progress = Math.min(this.timeInState / CONFIG.dissolveDuration, 1.0);
        if (this.progress >= 1.0) {
          this.transitionTo(AnimationState.CHAOS);
        }
        break;

      case AnimationState.CHAOS:
        if (this.timeInState >= CONFIG.chaosHoldDuration) {
          this.transitionTo(AnimationState.REFORMING);
        }
        break;

      case AnimationState.REFORMING:
        this.progress = Math.min(this.timeInState / CONFIG.reformDuration, 1.0);
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

  getStateName() {
    switch (this.state) {
      case AnimationState.FORMED: return 'FORMED';
      case AnimationState.DISSOLVING: return `DISSOLVING (${Math.floor(this.progress * 100)}%)`;
      case AnimationState.CHAOS: return 'CHAOS';
      case AnimationState.REFORMING: return `REFORMING (${Math.floor(this.progress * 100)}%)`;
      default: return 'UNKNOWN';
    }
  }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

class App {
  constructor() {
    // Setup scene
    const sceneData = createBasicScene({
      backgroundColor: CONFIG.backgroundColor,
      cameraPosition: {
        x: 0,
        y: CONFIG.cameraHeight,
        z: CONFIG.cameraDistance
      }
    });

    this.scene = sceneData.scene;
    this.camera = sceneData.camera;
    this.renderer = sceneData.renderer;

    setupResizeHandler(this.camera, this.renderer);

    // Create particle system
    this.particleSystem = new ParticleBodySystem(CONFIG.particleCount);
    this.scene.add(this.particleSystem.mesh);

    // Add subtle ambient light (for atmosphere, though particles emit own light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(ambientLight);

    // Animation controller
    this.animationController = new AnimationController();

    // Time tracking
    this.clock = new THREE.Clock();
    this.fpsCounter = new FPSCounter();

    // Camera orbit
    this.cameraAngle = 0;
    this.cameraElevation = 0.3; // Slight upward angle

    // Input handling
    this.setupInput();

    // UI elements
    this.fpsElement = document.getElementById('fps');
    this.particlesElement = document.getElementById('particles');
    this.stateElement = document.getElementById('state');

    // Update particle count display
    this.particlesElement.textContent = CONFIG.particleCount.toLocaleString();

    // Start animation loop
    this.animate();

    console.log('Particle Body Dissolution initialized');
    console.log(`Particles: ${CONFIG.particleCount}`);
  }

  setupInput() {
    // Mouse controls for camera
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    document.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;

        this.cameraAngle -= deltaX * 0.005;
        this.cameraElevation = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, this.cameraElevation - deltaY * 0.005)
        );

        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      }
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
      CONFIG.cameraDistance += e.deltaY * 0.005;
      CONFIG.cameraDistance = Math.max(2, Math.min(10, CONFIG.cameraDistance));
      e.preventDefault();
    }, { passive: false });

    // Touch support
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;

        this.cameraAngle -= deltaX * 0.005;
        this.cameraElevation = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, this.cameraElevation - deltaY * 0.005)
        );

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        e.preventDefault();
      }
    }, { passive: false });
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

    // Update camera position (orbit)
    const targetY = CONFIG.cameraHeight;
    this.camera.position.x = Math.sin(this.cameraAngle) * Math.cos(this.cameraElevation) * CONFIG.cameraDistance;
    this.camera.position.y = targetY + Math.sin(this.cameraElevation) * CONFIG.cameraDistance;
    this.camera.position.z = Math.cos(this.cameraAngle) * Math.cos(this.cameraElevation) * CONFIG.cameraDistance;
    this.camera.lookAt(0, targetY, 0);

    // Auto-rotate camera slowly
    this.cameraAngle += CONFIG.cameraRotationSpeed * deltaTime;

    // Render
    this.renderer.render(this.scene, this.camera);

    // Update UI
    const fps = this.fpsCounter.update();
    this.fpsElement.textContent = fps;
    this.stateElement.textContent = this.animationController.getStateName();
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
