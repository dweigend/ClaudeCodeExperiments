# Experiment 01: Particle Body Dissolution

## Konzept

Ein humanoider Körper aus 10.000 Lichtpartikeln löst sich in einem hypnotischen Rhythmus auf und reformiert sich wieder. Dies symbolisiert die Vergänglichkeit der physischen Form und die Auflösung der Identität zwischen Körper und Cyberspace.

## Künstlerische Vision

Der Körper ist nicht fest, sondern eine temporäre Anordnung von Partikeln. In einem endlosen Zyklus:
1. **FORMED** - Die Partikel bilden eine erkennbare menschliche Form
2. **DISSOLVING** - Die Form löst sich auf, verliert ihre Struktur
3. **CHAOS** - Vollständige Auflösung, die Partikel schweben frei im Raum
4. **REFORMING** - Die Partikel finden zurück, die Form entsteht neu

Dieser Zyklus symbolisiert:
- **Vergänglichkeit** der physischen Form
- **Identität** als temporäres Konstrukt
- Der **Körper** als Ansammlung von Informationseinheiten
- **Bewusstsein** zwischen Form und Formlosigkeit

## Technische Umsetzung

### Core Technologies
- **three.js** - 3D Rendering Engine
- **BufferGeometry** - Effiziente GPU-Partikel-Speicherung
- **Points Material** - Rendering von Tausenden Partikeln
- **State Machine** - Animation Controller
- **Easing Functions** - Smooth Transitions

### Particle System Details

**Partikelanzahl:** 10.000
- 20% Kopf (Kugel-Distribution)
- 40% Torso (Zylinder mit Verjüngung)
- 40% Gliedmaßen (Arme und Beine)

**Rendering:**
- Additive Blending für Leuchteffekt
- Size Attenuation für Tiefenwirkung
- Keine Depth-Writing für Performance

**Animation:**
- Smooth interpolation zwischen zwei Zuständen
- Sine-Wave Easing für organische Bewegung
- State Machine für klare Ablauflogik

### Performance

**Optimierungen:**
- BufferGeometry für direkte GPU-Kommunikation
- Single draw call für alle Partikel
- Effiziente Float32Array für Positionen
- Nur notwendige Attribute (Position)

**Ziel:**
- 60 FPS auf Desktop
- 30+ FPS auf Mobile
- VR-ready für zukünftige 90 FPS Integration

## Steuerung

### Desktop
- **Maus ziehen** - Kamera manuell rotieren
- **Mausrad** - Zoom (2-10 Einheiten)
- **Leertaste** - Animation pausieren/fortsetzen

### Touch (Mobile)
- **Finger ziehen** - Kamera rotieren
- **Tap** - (reserviert für zukünftige Funktionen)

### Automatisch
- Kamera rotiert langsam automatisch
- Animation läuft in Endlosschleife

## Künstlerische Entscheidungen

### Farbwahl
**Cyan (#00ffaa)** wurde gewählt, weil:
- Technologisch und digital
- Kalt und distanziert (nicht menschlich/warm)
- Gute Sichtbarkeit auf schwarzem Hintergrund
- Assoziationen: Neon, Cyberspace, Matrix

### Timing
- **Geformt halten:** 1.5s - Zeit zum Erkennen
- **Auflösung:** 2.0s - Langsam genug für Drama
- **Chaos halten:** 1.5s - Moment der Desorientierung
- **Reformation:** 2.5s - Etwas langsamer, hoffnungsvoll

**Gesamt-Zyklus:** ~7.5 Sekunden - Meditativ, hypnotisch

### Form
Bewusst **vereinfachter Humanoid**:
- Erkennbar als Mensch
- Aber abstrakt genug für Projektion
- Nicht zu detailliert (bleibt konzeptuell)

### Chaos-Verteilung
**Nicht-uniforme sphärische Verteilung:**
- Mehr Partikel nahe Zentrum
- Organisches Auseinanderdriften
- Nicht zu perfekt/mathematisch

## VR-Bereitschaft

Das Experiment ist vorbereitet für WebXR Integration:

✅ **Performance:** Optimiert für 90fps
✅ **Stereoscopic:** Keine problematischen Effekte
✅ **Scale:** Körper in Lebensgröße konzipiert
✅ **Controls:** Bereit für VR-Controller-Integration

### ICAROS-spezifische Überlegungen

Für ICAROS-Integration geplant:
- **Körperbewegung:** Spieler bewegt sich um Figur herum
- **Scale:** Figur in 1:1 Lebensgröße
- **Interaktion:** Partikel "wegpusten" durch Bewegung
- **Immersion:** Stereo-Audio für räumliche Erfahrung

## Code-Struktur

```
main.js
├── CONFIG - Zentrale Konfiguration
├── AnimationState - Enum für Zustände
├── ParticleBodySystem - Partikel-Verwaltung
│   ├── generateHumanoidShape()
│   ├── generateChaosPositions()
│   └── update(progress, state)
├── AnimationController - State Machine
│   ├── update(deltaTime)
│   └── transitionTo(state)
└── App - Haupt-Applikation
    ├── setupInput()
    └── animate() - Main Loop
```

## Parameter Tuning

Zentrale Parameter in `CONFIG`:

```javascript
particleCount: 10000,     // Anzahl Partikel (Performance vs Detail)
particleSize: 0.02,       // Größe einzelner Partikel
chaosRadius: 3.0,         // Wie weit Partikel sich verteilen
dissolveDuration: 2.0,    // Auflösungs-Geschwindigkeit
reformDuration: 2.5,      // Reformations-Geschwindigkeit
cameraRotationSpeed: 0.1  // Auto-Rotation Geschwindigkeit
```

Für andere künstlerische Intentionen anpassbar:
- **Schneller Zyklus:** Nervös, hektisch
- **Langsamer Zyklus:** Meditativ, ruhig
- **Größerer Chaos-Radius:** Explosiv
- **Kleinerer Radius:** Sanft, subtil

## Mögliche Erweiterungen

### Technisch
- [ ] Audio-Reaktivität (Mikrofon-Input)
- [ ] Partikel-Farb-Shifts basierend auf Zustand
- [ ] Unterschiedliche Körperformen (verschiedene Posen)
- [ ] Mehrere Körper gleichzeitig
- [ ] Trail-Effekte (Motion Blur)

### Interaktiv
- [ ] Partikel mit Hand "wegpusten" (VR)
- [ ] Manuelle Kontrolle über Auflösungs-Geschwindigkeit
- [ ] Verschiedene Auflösungs-Muster
- [ ] Partikel folgen Mauszeiger

### Künstlerisch
- [ ] Mehrere Körper in verschiedenen Zuständen
- [ ] Morphing zwischen verschiedenen Formen
- [ ] Emotional states (Farb-Shifts)
- [ ] Interaktion zwischen mehreren Körpern

## Known Limitations

1. **Body Shape:** Sehr vereinfacht - könnte 3D-Model-Daten verwenden
2. **Physics:** Keine echte Physik-Simulation
3. **Collision:** Partikel interagieren nicht miteinander
4. **Audio:** Noch keine Sound-Design
5. **Mobile:** Performance auf älteren Geräten begrenzt

## Lessons Learned

### Was funktioniert gut:
- BufferGeometry ist extrem performant
- State Machine macht Animation-Flow klar
- Sine-Easing fühlt sich sehr organisch an
- Additive Blending erzeugt schönen Glüh-Effekt

### Was schwierig war:
- Humanoid-Form-Generation (Balance zwischen Erkennbarkeit und Performance)
- Timing-Tuning (subjektiv, viel Ausprobieren)
- Chaos-Distribution (zu uniform wirkt künstlich)

### Für nächste Experimente:
- Mehr Parameter externalisieren für Live-Tuning
- Debug-UI für Entwicklung
- Preset-System für verschiedene "Moods"

---

**Status:** ✅ Completed
**Performance:** 60 FPS @ 10k particles
**VR-Ready:** Yes (pending WebXR integration)
**Last Updated:** 2025-11-06
