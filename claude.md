# Generative 3D Kunst Experimente - Claude Dokumentation

## Projektbeschreibung

Dies ist eine Sammlung von experimentellen three.js Prototypen für generative 3D-Kunst. Die Experimente erforschen die Grenzen zwischen Körper und Cyberspace und sind für die spätere Integration in das ICAROS VR-System konzipiert.

**Künstlerische Themen:**
- Out of Body Experience
- Auflösung des Bewusstseins
- Verschmelzung von Körper und digitalem Raum
- Veränderte Wahrnehmung

**Technischer Stack:**
- three.js (3D-Rendering)
- Vanilla JavaScript
- Vite (Build-Tool)
- GLSL (Custom Shader)

---

## Projektstruktur

```
ClaudeCodeExperiments/
├── experiments-plan.md          # Detaillierter Plan aller 15 Experimente
├── claude.md                     # Diese Datei
├── package.json                  # Dependencies
├── vite.config.js               # Vite Konfiguration
├── index.html                   # Haupt-Index mit Links zu allen Experimenten
│
└── experiments/
    ├── 01-particle-dissolution/
    │   ├── index.html
    │   ├── main.js
    │   └── README.md
    ├── 02-mirror-realms/
    ├── 03-fractal-consciousness/
    ├── 04-wireframe-ego/
    ├── 05-fluid-identity/
    ├── 06-void-walker/
    ├── 07-echo-chambers/
    ├── 08-digital-flesh/
    ├── 09-perception-grid/
    ├── 10-quantum-states/
    ├── 11-liminal-spaces/
    ├── 12-synaptic-flow/
    ├── 13-time-dilation/
    ├── 14-astral-projection/
    ├── 15-consciousness-waves/
    │
    └── shared/
        ├── utils.js             # Gemeinsame Utility-Funktionen
        ├── base-scene.js        # Basis three.js Setup
        └── shaders/             # Wiederverwendbare Shader
            ├── vertex.glsl
            └── fragment.glsl
```

---

## Design-Prinzipien

### 1. Minimalismus
Jedes Experiment ist bewusst reduziert und fokussiert auf **eine zentrale Idee**. Keine überflüssigen Features.

### 2. Abgeschlossenheit
Jedes Experiment ist **eigenständig lauffähig**. Keine komplexen Dependencies zwischen Experimenten.

### 3. Prototyp-Charakter
Dies sind **Konzept-Prototypen**, keine fertigen Produktionen. Fokus liegt auf der Idee, nicht auf Perfektion.

### 4. VR-Ready
Alle Experimente werden so entwickelt, dass sie später mit WebXR/ICAROS kompatibel sind:
- Stereoskopisches Rendering berücksichtigen
- Performance-Optimierung (90fps für VR)
- Intuitive Steuerung

---

## Entwicklungsrichtlinien

### Neues Experiment erstellen

1. **Ordner anlegen:**
   ```bash
   mkdir experiments/XX-experiment-name
   cd experiments/XX-experiment-name
   ```

2. **Basis-Dateien erstellen:**
   - `index.html` - Minimales HTML mit Canvas
   - `main.js` - three.js Setup und Animationsloop
   - `README.md` - Konzept, Bedienung, technische Details

3. **HTML-Template nutzen:**
   ```html
   <!DOCTYPE html>
   <html lang="de">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Experiment Name</title>
     <style>
       body { margin: 0; overflow: hidden; }
       canvas { display: block; }
     </style>
   </head>
   <body>
     <script type="module" src="./main.js"></script>
   </body>
   </html>
   ```

4. **JavaScript-Struktur:**
   ```javascript
   import * as THREE from 'three';

   // Scene Setup
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   const renderer = new THREE.WebGLRenderer({ antialias: true });
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);

   // Experiment-spezifischer Code hier

   // Animation Loop
   function animate() {
     requestAnimationFrame(animate);
     // Update-Logik
     renderer.render(scene, camera);
   }
   animate();

   // Window Resize
   window.addEventListener('resize', () => {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
   });
   ```

---

## Gemeinsame Utilities

### `experiments/shared/utils.js`

Hilfreiche Funktionen für alle Experimente:

```javascript
export function setupBasicScene(backgroundColor = 0x000000) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

export function handleResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
```

---

## Experimentspezifische Hinweise

### Shader-basierte Experimente
Für Experimente mit Custom Shadern (z.B. Fractal Consciousness):
- Shader in separate `.glsl`-Dateien auslagern
- `THREE.ShaderMaterial` verwenden
- Uniforms für Zeit und Interaktion

### Partikel-Systeme
Für Experimente mit vielen Partikeln (z.B. Particle Dissolution):
- `THREE.Points` statt einzelner Meshes
- `THREE.BufferGeometry` für Performance
- GPU-Instancing bei Bedarf

### Performance-Tipps
- Target: 60fps (90fps für VR später)
- `renderer.info` für Debugging
- Geometrien wiederverwenden
- Texturen komprimieren

---

## Nächste Schritte

### Phase 1: Setup (aktuell)
- [x] Projektplan erstellen
- [x] Ordnerstruktur anlegen
- [ ] Package.json und Vite konfigurieren
- [ ] Shared Utilities erstellen

### Phase 2: Erste Prototypen
- [ ] Experiment 1: Particle Dissolution
- [ ] Experiment 6: Void Walker (einfachster Start)
- [ ] Experiment 14: Astral Projection

### Phase 3: Erweiterte Experimente
- [ ] Shader-basierte Experimente
- [ ] Komplexe Geometrie-Manipulationen

### Phase 4: VR-Integration
- [ ] WebXR API Integration
- [ ] ICAROS-spezifische Anpassungen
- [ ] Performance-Optimierung für VR

---

## Ressourcen

- **three.js Dokumentation:** https://threejs.org/docs/
- **ICAROS System:** https://www.icaros.com/de/
- **WebXR Specs:** https://immersiveweb.dev/
- **Shader-Tutorial:** https://thebookofshaders.com/

---

## Kontakt & Workflow

Bei der Arbeit an diesem Projekt:
1. Jedes Experiment ist eine eigenständige Einheit
2. Begrenzte Scope - lieber mehrere einfache Experimente als ein komplexes
3. Prototyp-Mentalität - Geschwindigkeit über Perfektion
4. Dokumentiere Konzept und technische Entscheidungen im README jedes Experiments

---

*Zuletzt aktualisiert: 2025-11-06*
