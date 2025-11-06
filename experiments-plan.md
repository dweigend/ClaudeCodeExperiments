# Generative 3D Kunst Experimente für ICAROS VR

## Projektübersicht
Eine Sammlung von experimentellen three.js Prototypen, die die Grenzen zwischen Körper und Cyberspace erforschen. Jedes Experiment ist eine eigenständige, minimalistische Exploration von Wahrnehmung, Bewusstsein und digitaler Existenz.

**Ziel:** VR-Erlebnis über das ICAROS-System (https://www.icaros.com/de/)

**Themen:**
- Out of Body Experience
- Auflösung des Bewusstseins
- Körper-Cyberspace Verschmelzung
- Veränderte Wahrnehmung

---

## Die 15 Experimente

### 1. Particle Body Dissolution
**Konzept:** Ein humanoider Körper aus Tausenden von Partikeln, der sich langsam auflöst und wieder zusammensetzt.

**Technische Umsetzung:**
- THREE.Points für Partikelsystem
- Morphing zwischen Körperform und chaotischer Verteilung
- Pulsierender Rhythmus der Auflösung/Reformation

**Psychologischer Effekt:** Identitätsverlust, Vergänglichkeit des Körpers

---

### 2. Mirror Realms
**Konzept:** Multiple gespiegelte Welten, die sich in verschiedene Richtungen entfernen. Der Betrachter sieht unendliche Versionen seiner selbst.

**Technische Umsetzung:**
- Mehrere THREE.Scene Instanzen oder gespiegelte Geometrien
- Kaleidoskop-Effekt durch symmetrische Anordnung
- Langsame Drift der gespiegelten Welten

**Psychologischer Effekt:** Fragmentierung des Selbst, Multiple Identitäten

---

### 3. Fractal Consciousness
**Konzept:** Eine endlose Reise durch fraktale Strukturen (Mandelbulb, Julia Sets), die Bewusstseinsebenen repräsentieren.

**Technische Umsetzung:**
- Raymarching für 3D-Fraktale
- ShaderMaterial mit GLSL
- Automatische Kamerafahrt durch fraktale Landschaften

**Psychologischer Effekt:** Unendliche Tiefe, Selbstähnlichkeit des Bewusstseins

---

### 4. Wireframe Ego
**Konzept:** Drahtgitterstrukturen, die zwischen solider Form und vollständiger Auflösung oszillieren.

**Technische Umsetzung:**
- THREE.LineSegments und THREE.Mesh Wechsel
- Morphing zwischen verschiedenen geometrischen Primitiven
- Rhythmische Pulsation der Liniendicke

**Psychologischer Effekt:** Fragilität der Identität, Durchlässigkeit des Selbst

---

### 5. Fluid Identity
**Konzept:** Flüssige, organische Formen, die ineinander morphen (Metaballs).

**Technische Umsetzung:**
- Marching Cubes Algorithmus
- Metaball-Physik
- Smooth Transitions zwischen Formen

**Psychologischer Effekt:** Fließende Identität, Formlosigkeit

---

### 6. Void Walker
**Konzept:** Navigation durch einen endlosen schwarzen Raum mit schwebenden, pulsierenden Lichtpunkten.

**Technische Umsetzung:**
- Minimale Geometrie, schwarzer Hintergrund
- THREE.PointLight mit variierender Intensität
- Langsame Kamerabewegung durch den Raum
- Fog für Tiefeneffekt

**Psychologischer Effekt:** Isolation, Verlust räumlicher Orientierung

---

### 7. Echo Chambers
**Konzept:** Ein zentrales Objekt wird von zeitverzögerten Echos seiner selbst umgeben.

**Technische Umsetzung:**
- Speichern von Transformationen in einem Array
- Mehrere Mesh-Instanzen mit zeitversetzter Wiedergabe
- Transparenzgradient (ältere Echos transparenter)

**Psychologischer Effekt:** Zeitliche Desynchronisation, Echo der Vergangenheit

---

### 8. Digital Flesh
**Konzept:** Organisch wirkende Formen, die aus digitalen Primitiven (Voxel, Polygone) bestehen.

**Technische Umsetzung:**
- Subdivision Surface auf Low-Poly-Meshes
- Noise-basierte Deformation
- Pulsierendes "Atmen" der Geometrie

**Psychologischer Effekt:** Verschmelzung von Organischem und Digitalem

---

### 9. Perception Grid
**Konzept:** Ein sich dynamisch veränderndes Gitter, das optische Täuschungen und Perspektivverschiebungen erzeugt.

**Technische Umsetzung:**
- THREE.GridHelper mit animierten Vertices
- Nicht-euklidische Raumverzerrungen
- Wellen und Verwerfungen im Grid

**Psychologischer Effekt:** Destabilisierung der räumlichen Wahrnehmung

---

### 10. Quantum States
**Konzept:** Objekte existieren gleichzeitig an mehreren Orten, verschwimmen zwischen Zuständen.

**Technische Umsetzung:**
- Mehrere transparente Instanzen desselben Objekts
- Interpolation zwischen verschiedenen Positionen
- Probabilistische Verteilung der Positionen

**Psychologischer Effekt:** Unbestimmtheit, Quantenüberlagerung des Bewusstseins

---

### 11. Liminal Spaces
**Konzept:** Endlose Korridore und Übergangsräume zwischen verschiedenen Welten.

**Technische Umsetzung:**
- Procedurale Generation von Architektur
- Portale zwischen verschiedenen Räumen
- Monotone, leicht verstörende Ästhetik

**Psychologischer Effekt:** Schwellenräume, Zwischenzustände

---

### 12. Synaptic Flow
**Konzept:** Ein pulsierendes Netzwerk aus Knoten und Verbindungen, wie ein neuronales Netz.

**Technische Umsetzung:**
- THREE.Line für Verbindungen
- THREE.Sprite oder kleine Geometrien für Knoten
- Animierte "Impulse" die durch das Netzwerk wandern
- Organisches Wachstum und Zerfall

**Psychologischer Effekt:** Visualisierung von Gedankenströmen, neuronale Aktivität

---

### 13. Time Dilation
**Konzept:** Verschiedene Objekte bewegen sich in unterschiedlichen Zeitgeschwindigkeiten, manche fast eingefroren, andere rasend schnell.

**Technische Umsetzung:**
- Individuelle Zeitskalen für jedes Objekt
- Delta-Time Multiplikatoren
- Visueller Slow-Motion/Speed-Up Effekt (Motion Blur)

**Psychologischer Effekt:** Verzerrte Zeitwahrnehmung, Relativität der Erfahrung

---

### 14. Astral Projection
**Konzept:** Die Kamera (= Bewusstsein) löst sich vom Körper und schwebt frei im Raum.

**Technische Umsetzung:**
- Fester "Körper" im Raum (Mesh)
- Kamera bewegt sich unabhängig vom Körper
- Verbindung durch leuchtende "Silberband"-Linie
- Smooth Camera Controls

**Psychologischer Effekt:** Out of Body Experience, Trennung von Körper und Geist

---

### 15. Consciousness Waves
**Konzept:** Wellenförmige Strukturen, die durch den Raum fließen und verschiedene Bewusstseinszustände repräsentieren.

**Technische Umsetzung:**
- THREE.PlaneGeometry mit Vertex-Shader-Animation
- Sinuswellen mit verschiedenen Frequenzen und Amplituden
- Farbverläufe entsprechend "Bewusstseinszuständen"
- Audio-reaktiv (optional)

**Psychologischer Effekt:** Fließende Bewusstseinszustände, meditative Qualität

---

## Technische Grundlagen

### Stack
- **three.js** - 3D-Rendering
- **Vanilla JavaScript** - Minimale Dependencies
- **Vite** - Build Tool
- **GLSL** - Shader für fortgeschrittene Effekte

### Projektstruktur
```
experiments/
├── 01-particle-dissolution/
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
└── shared/
    ├── utils.js
    └── shaders/
```

### Jedes Experiment enthält
- `index.html` - Minimales HTML
- `main.js` - three.js Setup und Animation
- `README.md` - Konzept und Bedienung
- (optional) `shaders/` - Custom GLSL Shader

---

## VR-Integration (Zukünftig)

Alle Experimente werden so konzipiert, dass sie später mit:
- WebXR API
- ICAROS VR System
- Stereoskopischem Rendering

kompatibel sind.

---

## Künstlerische Vision

Diese Experimente sind keine fertigen Kunstwerke, sondern **Prototypen für psychologische Erfahrungen**. Jedes Experiment erforscht eine Facette der Frage: *Was passiert, wenn die Grenzen zwischen Körper, Geist und digitalem Raum verschwimmen?*

Die Ästhetik ist bewusst reduziert, um die konzeptuellen Ideen in den Vordergrund zu stellen. In VR werden diese Erfahrungen durch Immersion und Körperbeteiligung (ICAROS) intensiviert.
