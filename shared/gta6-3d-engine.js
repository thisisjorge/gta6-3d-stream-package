/* ============================================================================
 * GTA 6 FULL 3D STREAM PACKAGE — ULTRA PBR 3D ENGINE (Three.js)
 * High-Poly Beveled Models, Studio HDRI PMREM Reflections, GTA Pricedown
 * Custom Vector Geometry & Vice City Sunset Lighting
 * ============================================================================ */

(function(global) {
  'use strict';

  let cachedPMREMEnv = {};

  // Generate high-dynamic-range Studio + Vice City Sunset Equirectangular EnvMap
  // and prefilter it with PMREMGenerator for ultra-realistic metallic reflections
  function getStudioEnvMap(renderer, variant = 'purple') {
    const key = variant;
    if (cachedPMREMEnv[key]) return cachedPMREMEnv[key];

    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Deep dark studio base (critical for dark chrome contrast like KondorGFX)
    const bg = ctx.createLinearGradient(0, 0, 0, 512);
    if (variant === 'gold') {
      bg.addColorStop(0.0, '#ffe8b8');
      bg.addColorStop(0.22, '#ffab66');
      bg.addColorStop(0.45, '#e06898');
      bg.addColorStop(0.62, '#622878');
      bg.addColorStop(0.85, '#2b1244');
      bg.addColorStop(1.0, '#140822');
    } else {
      bg.addColorStop(0.0, '#160d2c');
      bg.addColorStop(0.28, '#38155e');
      bg.addColorStop(0.48, '#d43cc4');
      bg.addColorStop(0.54, '#241142');
      bg.addColorStop(0.82, '#120a24');
      bg.addColorStop(1.0, '#070412');
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1024, 512);

    // Studio softboxes & neon rim strips for crisp metallic speculars
    function drawSoftbox(x, y, w, h, color, blur) {
      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }

    if (variant === 'gold') {
      drawSoftbox(80, 60, 260, 45, '#ffd9b0', 12);
      drawSoftbox(460, 110, 320, 36, '#ff9d66', 14);
      drawSoftbox(180, 220, 380, 28, '#ffffff', 8);
      drawSoftbox(680, 280, 240, 50, '#b55cff', 16);
    } else {
      drawSoftbox(70, 55, 280, 42, '#ff6ee8', 12);
      drawSoftbox(480, 95, 340, 38, '#d480ff', 14);
      drawSoftbox(160, 210, 360, 24, '#ffd6f8', 8);
      drawSoftbox(690, 260, 240, 45, '#9d3bff', 16);
      drawSoftbox(320, 360, 220, 30, '#ff42b8', 14);
    }

    const rawTex = new THREE.CanvasTexture(c);
    rawTex.mapping = THREE.EquirectangularReflectionMapping;
    rawTex.colorSpace = THREE.SRGBColorSpace;

    if (renderer && THREE.PMREMGenerator) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const envRT = pmrem.fromEquirectangular(rawTex);
      cachedPMREMEnv[key] = envRT.texture;
      rawTex.dispose();
      pmrem.dispose();
      return cachedPMREMEnv[key];
    }
    cachedPMREMEnv[key] = rawTex;
    return rawTex;
  }

  // High-Res Photorealistic $100 US Dollar Bill Texture (Vintage Vice City Tint)
  function createDollarTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Paper base with warm vintage mauve-cream tone
    const baseGrad = ctx.createLinearGradient(0, 0, 1024, 512);
    baseGrad.addColorStop(0, '#c69fc4');
    baseGrad.addColorStop(0.35, '#dfc4d8');
    baseGrad.addColorStop(0.65, '#cbb0c9');
    baseGrad.addColorStop(1, '#a982ad');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle guilloche engraving lines across paper
    ctx.strokeStyle = 'rgba(72, 46, 78, 0.11)';
    ctx.lineWidth = 1.5;
    for (let y = 16; y < 496; y += 8) {
      ctx.beginPath();
      for (let x = 16; x <= 1008; x += 32) {
        ctx.lineTo(x, y + Math.sin(x * 0.04) * 3);
      }
      ctx.stroke();
    }

    // Intricate Treasury Outer Frame
    ctx.strokeStyle = '#3b2442';
    ctx.lineWidth = 18;
    ctx.strokeRect(28, 28, 968, 456);
    ctx.strokeStyle = '#5e3b68';
    ctx.lineWidth = 4;
    ctx.strokeRect(46, 46, 932, 420);
    ctx.strokeRect(54, 54, 916, 404);

    // Corner denomination rosettes & '100'
    const corners = [
      [115, 105], [905, 105], [115, 412], [905, 412]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#3a2240';
      ctx.beginPath();
      ctx.ellipse(0, -14, 58, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d8bfd6';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#efe0ec';
      ctx.font = '900 38px Impact, Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100', 0, 0);
      ctx.restore();
    });

    // Large angled watermark "100" on right side
    ctx.save();
    ctx.translate(780, 290);
    ctx.fillStyle = 'rgba(65, 38, 72, 0.28)';
    ctx.font = '900 110px Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('100', 0, 0);
    ctx.restore();

    // Benjamin Franklin Engraving Portrait Oval
    ctx.save();
    ctx.translate(512, 256);
    ctx.beginPath();
    ctx.ellipse(0, 0, 145, 185, 0, 0, Math.PI * 2);
    const ovalGrad = ctx.createRadialGradient(-20, -30, 20, 0, 0, 185);
    ovalGrad.addColorStop(0, '#cfb6cc');
    ovalGrad.addColorStop(0.7, '#8e6d92');
    ovalGrad.addColorStop(1, '#392140');
    ctx.fillStyle = ovalGrad;
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#392140';
    ctx.stroke();

    // Detailed engraved portrait shading (head, hair, collar, coat)
    ctx.fillStyle = '#2d1833';
    // Shoulders & coat
    ctx.beginPath();
    ctx.ellipse(0, 135, 115, 78, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Long colonial hair sides
    ctx.beginPath();
    ctx.ellipse(-45, -15, 34, 68, 0.2, 0, Math.PI * 2);
    ctx.ellipse(45, -15, 34, 68, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Face
    ctx.fillStyle = '#cbb0c7';
    ctx.beginPath();
    ctx.ellipse(0, -25, 52, 68, 0, 0, Math.PI * 2);
    ctx.fill();
    // Facial features (eyes, nose, mouth, cravat)
    ctx.fillStyle = '#3b2242';
    ctx.fillRect(-26, -42, 16, 6);
    ctx.fillRect(10, -42, 16, 6);
    ctx.fillRect(-4, -38, 8, 28);
    ctx.fillRect(-16, 4, 32, 5);
    // White cravat
    ctx.fillStyle = '#e7d4e4';
    ctx.beginPath();
    ctx.moveTo(-22, 42);
    ctx.lineTo(22, 42);
    ctx.lineTo(10, 115);
    ctx.lineTo(-10, 115);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Treasury Seals (Left Black Seal & Right Green/Teal Seal)
    ctx.save();
    ctx.fillStyle = 'rgba(42, 24, 48, 0.72)';
    ctx.beginPath();
    ctx.arc(265, 260, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(48, 92, 88, 0.55)';
    ctx.beginPath();
    ctx.arc(745, 255, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Serial Numbers & Header Text
    ctx.fillStyle = '#2b1830';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('THE UNITED STATES OF AMERICA', 512, 88);
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText('ONE HUNDRED DOLLARS', 512, 450);
    ctx.font = 'bold 20px monospace';
    ctx.fillText('LB 84920416 V', 255, 168);
    ctx.fillText('LB 84920416 V', 765, 368);

    // Center Currency Strap (Realistic Paper Band with Pink/Rose Edge Shadows)
    const strapGrad = ctx.createLinearGradient(420, 0, 604, 0);
    strapGrad.addColorStop(0, '#78486e');
    strapGrad.addColorStop(0.12, '#c88db8');
    strapGrad.addColorStop(0.5, '#ebd0e2');
    strapGrad.addColorStop(0.88, '#b87ca8');
    strapGrad.addColorStop(1, '#683b5f');
    ctx.fillStyle = strapGrad;
    ctx.fillRect(428, 0, 168, 512);

    // Strap borders & stamp
    ctx.strokeStyle = '#5c2d54';
    ctx.lineWidth = 4;
    ctx.strokeRect(434, -4, 156, 520);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Stacked paper edges texture for the 4 sides of the cash bundle
  function createPaperStackEdgeTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');
    for (let y = 0; y < 128; y += 2) {
      ctx.fillStyle = y % 4 === 0 ? '#a884a6' : (y % 6 === 0 ? '#6e4e6e' : '#cbb0c8');
      ctx.fillRect(0, y, 256, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // Fine tactical grip stippling bump map
  function createGripStippleTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#606060';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 4) {
      for (let x = 0; x < 256; x += 4) {
        ctx.fillStyle = ((x + y) % 8 === 0) ? '#ffffff' : '#202020';
        ctx.fillRect(x, y, 2, 2);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }

  // ==========================================================================
  // 1. ULTRA-DETAILED 3D HANDCUFFS (Dark Chrome with Neon Magenta/Violet Rim)
  // ==========================================================================
  function createHandcuffs(options = {}) {
    const group = new THREE.Group();
    const envMap = options.envMap;

    // Dark gunmetal chrome that reflects bright neon magenta/purple on edges
    const darkChromeMat = new THREE.MeshStandardMaterial({
      color: options.color || 0x9b4de8,
      metalness: 0.96,
      roughness: 0.14,
      envMap: envMap,
      envMapIntensity: 2.4
    });

    const innerRatchetMat = new THREE.MeshStandardMaterial({
      color: 0x2a123d,
      metalness: 0.92,
      roughness: 0.25,
      envMap: envMap,
      envMapIntensity: 1.8
    });

    const steelPinMat = new THREE.MeshStandardMaterial({
      color: 0xe6c8ff,
      metalness: 0.98,
      roughness: 0.08,
      envMap: envMap,
      envMapIntensity: 2.5
    });

    function buildDetailedCuff() {
      const cuff = new THREE.Group();

      // Double-cheek outer bow (top & bottom parallel plates) - seamless full loop
      const bowGeo = new THREE.TorusGeometry(0.94, 0.135, 24, 64, Math.PI * 1.12);
      bowGeo.scale(1, 1.04, 0.38);

      const doubleCheek1 = new THREE.Mesh(bowGeo, darkChromeMat);
      doubleCheek1.position.z = 0.068;
      doubleCheek1.rotation.z = -0.06;
      const doubleCheek2 = new THREE.Mesh(bowGeo, darkChromeMat);
      doubleCheek2.position.z = -0.068;
      doubleCheek2.rotation.z = -0.06;
      cuff.add(doubleCheek1, doubleCheek2);

      // Single-strand swing bow (the other half of the circle, seamlessly meeting the double cheek)
      const swingGeo = new THREE.TorusGeometry(0.94, 0.138, 24, 64, Math.PI * 1.12);
      swingGeo.scale(1, 1.04, 0.36);
      const swingBow = new THREE.Mesh(swingGeo, darkChromeMat);
      swingBow.rotation.z = Math.PI - 0.06;
      cuff.add(swingBow);

      // Inner serrated ratchet teeth along swing bow
      for (let i = 0; i < 11; i++) {
        const angle = Math.PI + 0.32 + i * 0.17;
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.085, 0.085), innerRatchetMat);
        tooth.position.set(Math.cos(angle) * 0.82, Math.sin(angle) * 0.85, 0);
        tooth.rotation.z = angle;
        cuff.add(tooth);
      }

      // Beveled Lock Casing Box (Extruded rounded rectangle)
      const lockShape = new THREE.Shape();
      const lw = 0.36, lh = 0.28, lr = 0.06;
      lockShape.moveTo(-lw + lr, -lh);
      lockShape.lineTo(lw - lr, -lh);
      lockShape.quadraticCurveTo(lw, -lh, lw, -lh + lr);
      lockShape.lineTo(lw, lh - lr);
      lockShape.quadraticCurveTo(lw, lh, lw - lr, lh);
      lockShape.lineTo(-lw + lr, lh);
      lockShape.quadraticCurveTo(-lw, lh, -lw, lh - lr);
      lockShape.lineTo(-lw, -lh + lr);
      lockShape.quadraticCurveTo(-lw, -lh, -lw + lr, -lh);

      const lockGeo = new THREE.ExtrudeGeometry(lockShape, {
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.03,
        bevelSegments: 4
      });
      lockGeo.center();
      const lockBox = new THREE.Mesh(lockGeo, darkChromeMat);
      lockBox.position.set(0, 1.12, 0);
      cuff.add(lockBox);

      // Keyhole Pin + 2 Structural Rivets on Lock Casing
      const rivetGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.285, 20);
      rivetGeo.rotateX(Math.PI / 2);
      [-0.2, 0.2].forEach(rx => {
        const r = new THREE.Mesh(rivetGeo, steelPinMat);
        r.position.set(rx, 1.15, 0);
        cuff.add(r);
      });

      // Keyhole slot
      const keyhole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.29, 20).rotateX(Math.PI / 2),
        innerRatchetMat
      );
      keyhole.position.set(0, 1.03, 0);
      cuff.add(keyhole);

      // Pivot Hinge Pin on side of cuff
      const pivotPin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.048, 0.24, 20).rotateX(Math.PI / 2),
        steelPinMat
      );
      pivotPin.position.set(-0.94, 0.0, 0);
      cuff.add(pivotPin);

      // Swivel Collar & D-Ring at top of Lock Box
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.14, 20), steelPinMat);
      collar.position.set(0, 1.44, 0);
      const swivelLoop = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.045, 16, 32), darkChromeMat);
      swivelLoop.position.set(0, 1.56, 0);
      cuff.add(collar, swivelLoop);

      return cuff;
    }

    // Both cuffs connected at their Swivel Loops via a realistic 3-link chain!
    // Left cuff has its swivel loop at (-0.18, -0.18) pointing toward the chain
    const leftCuff = buildDetailedCuff();
    leftCuff.position.set(-1.32, -1.25, 0.14);
    leftCuff.rotation.set(0.18, 0.22, -0.78);
    group.add(leftCuff);

    // Right cuff has its swivel loop at (+0.18, +0.18) pointing toward the chain
    const rightCuff = buildDetailedCuff();
    rightCuff.position.set(1.32, 1.25, -0.14);
    rightCuff.rotation.set(-0.22, -0.18, 2.36);
    group.add(rightCuff);

    // Heavy Interlocking Chain Links cleanly bridging the two Swivel Loops
    const linkGeo = new THREE.TorusGeometry(0.16, 0.048, 16, 32);
    linkGeo.scale(1.38, 0.86, 1);
    for (let i = 0; i < 3; i++) {
      const link = new THREE.Mesh(linkGeo, darkChromeMat);
      const t = (i - 1) * 0.21;
      link.position.set(t, t, 0);
      link.rotation.set(i % 2 === 0 ? 0.55 : -0.75, 0.38, 0.78);
      group.add(link);
    }

    return group;
  }

  // ==========================================================================
  // 2. ULTRA-DETAILED 3D TACTICAL GLOCK PISTOL (Beveled Slide, Picatinny Laser,
  //    Stippled Ergonomic Grip, Finger Grooves, Pins & Trigger Guard)
  // ==========================================================================
  function createPistol(options = {}) {
    const group = new THREE.Group();
    const variant = options.variant || 'pink'; // 'pink' or 'bronze'
    const envMap = options.envMap;
    const gripBump = createGripStippleTexture();

    // Metallic Anodized Slide Material
    const slideMat = new THREE.MeshStandardMaterial({
      color: variant === 'bronze' ? 0xd99b72 : 0xdc58d2,
      metalness: 0.86,
      roughness: 0.19,
      envMap: envMap,
      envMapIntensity: 2.1
    });

    // Polymer/Metallic Frame with Stippled Bump Texture
    const frameMat = new THREE.MeshStandardMaterial({
      color: variant === 'bronze' ? 0x3b2654 : 0xa83cb0,
      metalness: 0.68,
      roughness: 0.28,
      bumpMap: gripBump,
      bumpScale: 0.018,
      envMap: envMap,
      envMapIntensity: 1.7
    });

    // Deep Recess / Barrel / Sights / Pins Material
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: variant === 'bronze' ? 0x1a1028 : 0x451256,
      metalness: 0.92,
      roughness: 0.18,
      envMap: envMap,
      envMapIntensity: 1.9
    });

    // 1. Beveled Upper Slide via ExtrudeGeometry cross-section
    const slideShape = new THREE.Shape();
    slideShape.moveTo(-0.22, -0.30);
    slideShape.lineTo(0.22, -0.30);
    slideShape.lineTo(0.22, 0.16);
    slideShape.lineTo(0.15, 0.30);
    slideShape.lineTo(-0.15, 0.30);
    slideShape.lineTo(-0.22, 0.16);
    slideShape.closePath();

    const slideGeo = new THREE.ExtrudeGeometry(slideShape, {
      depth: 2.72,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 3
    });
    slideGeo.rotateY(Math.PI / 2);
    slideGeo.center();
    const slide = new THREE.Mesh(slideGeo, slideMat);
    slide.position.set(0.14, 0.56, 0);
    group.add(slide);

    // Ejection port & visible barrel hood
    const ejectionPort = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.24, 0.455), darkMetalMat);
    ejectionPort.position.set(-0.02, 0.62, 0);
    group.add(ejectionPort);

    // Rear & Front Angled Slide Serrations
    for (let i = 0; i < 7; i++) {
      const groove = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.42, 0.46), darkMetalMat);
      groove.position.set(-1.02 + i * 0.082, 0.52, 0);
      group.add(groove);
    }

    // Combat Iron Sights (Rear U-notch & Front Blade)
    const rearSight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.32), darkMetalMat);
    rearSight.position.set(-1.08, 0.91, 0);
    const frontSight = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.10), darkMetalMat);
    frontSight.position.set(1.36, 0.91, 0);
    group.add(rearSight, frontSight);

    // Barrel Muzzle & Recoil Guide Rod
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.115, 0.115, 0.28, 24).rotateZ(Math.PI / 2),
      darkMetalMat
    );
    barrel.position.set(1.54, 0.58, 0);
    const Bore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.30, 20).rotateZ(Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x06030a })
    );
    Bore.position.set(1.55, 0.58, 0);
    group.add(barrel, Bore);

    // 2. Lower Receiver Frame & Dust Cover with Picatinny Rail Slots
    const dustCover = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.26, 0.41), frameMat);
    dustCover.position.set(0.08, 0.15, 0);
    group.add(dustCover);

    // Frame pins & slide lock lever details (visible on side of frame)
    const pinGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.44, 16).rotateX(Math.PI / 2);
    [[-0.22, 0.18], [-0.42, 0.12], [-0.02, 0.10]].forEach(([px, py]) => {
      const pin = new THREE.Mesh(pinGeo, darkMetalMat);
      pin.position.set(px, py, 0);
      group.add(pin);
    });

    // Slide stop lever & takedown latch
    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.435), darkMetalMat);
    lever.position.set(-0.28, 0.24, 0);
    group.add(lever);

    // 3. Under-Barrel Tactical Laser/Light Module (with side bolts & emitter bezel)
    const tacGroup = new THREE.Group();
    tacGroup.position.set(0.94, -0.14, 0);

    const tacBody = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.36, 0.43), slideMat);
    tacGroup.add(tacBody);

    // Side mounting screws & adjustment dials on tactical light
    [-0.24, 0.18].forEach(bx => {
      const bolt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.46, 16).rotateX(Math.PI / 2),
        darkMetalMat
      );
      bolt.position.set(bx, 0.04, 0);
      tacGroup.add(bolt);
    });

    // Tactical Light Front Bezel
    const bezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.115, 0.16, 24).rotateZ(Math.PI / 2),
      darkMetalMat
    );
    bezel.position.set(0.51, -0.02, 0);
    tacGroup.add(bezel);
    group.add(tacGroup);

    // 4. Sculpted Ergonomic Pistol Grip with Finger Grooves, Thumb Rest & Magwell
    const gripGroup = new THREE.Group();
    gripGroup.position.set(-0.74, -0.46, 0);
    gripGroup.rotation.z = -0.25;

    // Beveled Grip Core
    const gripShape = new THREE.Shape();
    const gw = 0.34, gh = 0.72, gr = 0.08;
    gripShape.moveTo(-gw + gr, -gh);
    gripShape.lineTo(gw - gr, -gh);
    gripShape.quadraticCurveTo(gw, -gh, gw, -gh + gr);
    gripShape.lineTo(gw, gh - gr);
    gripShape.quadraticCurveTo(gw, gh, gw - gr, gh);
    gripShape.lineTo(-gw + gr, gh);
    gripShape.quadraticCurveTo(-gw, gh, -gw, gh - gr);
    gripShape.lineTo(-gw, -gh + gr);
    gripShape.quadraticCurveTo(-gw, -gh, -gw + gr, -gh);

    const gripGeo = new THREE.ExtrudeGeometry(gripShape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 4
    });
    gripGeo.center();
    const gripMesh = new THREE.Mesh(gripGeo, frameMat);
    gripGroup.add(gripMesh);

    // Front strap finger humps
    [-0.12, -0.38].forEach(fy => {
      const hump = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.41, 16).rotateX(Math.PI / 2),
        frameMat
      );
      hump.position.set(0.33, fy, 0);
      gripGroup.add(hump);
    });

    // Textured Stippled Grip Inset Panel
    const insetPanel = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.08, 0.44), darkMetalMat);
    insetPanel.position.set(-0.02, -0.05, 0);
    gripGroup.add(insetPanel);

    // Beavertail Backstrap curve at top of grip
    const beavertail = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.40), frameMat);
    beavertail.position.set(-0.28, 0.62, 0);
    beavertail.rotation.z = 0.45;
    gripGroup.add(beavertail);

    // Extended Magazine Baseplate
    const magPlate = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.16, 0.46), darkMetalMat);
    magPlate.position.set(0.02, -0.78, 0);
    gripGroup.add(magPlate);

    group.add(gripGroup);

    // 5. Trigger Guard (with undercut & hooked front) + Curved Trigger
    const guardBottom = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.11, 0.24), frameMat);
    guardBottom.position.set(-0.06, -0.35, 0);
    const guardFront = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.40, 0.24), frameMat);
    guardFront.position.set(0.29, -0.16, 0);
    guardFront.rotation.z = -0.12;
    group.add(guardBottom, guardFront);

    const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.30, 0.11), darkMetalMat);
    trigger.position.set(-0.12, -0.12, 0);
    trigger.rotation.z = 0.38;
    group.add(trigger);

    return group;
  }

  // ==========================================================================
  // 3. ULTRA-DETAILED 3D CASH STACK ($100 Franklin Bundle with Fanned Layers)
  // ==========================================================================
  function createCashStack(options = {}) {
    const group = new THREE.Group();
    const dollarTex = createDollarTexture();
    const edgeTex = createPaperStackEdgeTexture();
    const envMap = options.envMap;

    const billFaceMat = new THREE.MeshStandardMaterial({
      map: dollarTex,
      roughness: 0.48,
      metalness: 0.12,
      envMap: envMap,
      envMapIntensity: 0.9
    });

    const stackEdgeMat = new THREE.MeshStandardMaterial({
      map: edgeTex,
      color: 0xb592b6,
      roughness: 0.65,
      metalness: 0.08
    });

    const materials = [
      stackEdgeMat, stackEdgeMat,
      billFaceMat,  billFaceMat,
      stackEdgeMat, stackEdgeMat
    ];

    // Main currency brick
    const mainBrick = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.34, 1.06), materials);
    group.add(mainBrick);

    // Slightly offset individual top & bottom bill packets for realistic fanned look
    const packet1 = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.05, 1.05), materials);
    packet1.position.set(0.01, 0.20, -0.01);
    packet1.rotation.set(0.015, 0.03, 0.025);
    group.add(packet1);

    const packet2 = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.04, 1.05), materials);
    packet2.position.set(-0.01, -0.19, 0.01);
    packet2.rotation.set(-0.01, -0.025, -0.02);
    group.add(packet2);

    // Raised 3D Currency Strap Band wrapping the middle of the bundle
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0xd9a1c8,
      roughness: 0.38,
      metalness: 0.15,
      envMap: envMap
    });
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.44, 1.09), strapMat);
    group.add(strap);

    return group;
  }

  // ==========================================================================
  // 4. 3D FACETED 5-POINT STAR (Gold & Vice Purple Dual-Tone Facets)
  // ==========================================================================
  function createStar3D(options = {}) {
    const outerR = options.outerRadius || 1.2;
    const innerR = options.innerRadius || 0.48;
    const depth = options.depth || 0.42;
    const envMap = options.envMap;

    const positions = [];
    const normals = [];
    const tipPoints = [];

    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      tipPoints.push(new THREE.Vector3(Math.cos(angle) * r, -Math.sin(angle) * r, 0));
    }

    const frontApex = new THREE.Vector3(0, 0, depth);
    const backApex = new THREE.Vector3(0, 0, -depth);

    function pushTriangle(a, b, c) {
      const cb = new THREE.Vector3().subVectors(c, b);
      const ab = new THREE.Vector3().subVectors(a, b);
      const norm = new THREE.Vector3().crossVectors(cb, ab).normalize();
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z);
    }

    for (let i = 0; i < 10; i++) {
      const p1 = tipPoints[i];
      const p2 = tipPoints[(i + 1) % 10];
      pushTriangle(frontApex, p1, p2);
      pushTriangle(backApex, p2, p1);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

    const mat = new THREE.MeshStandardMaterial({
      color: options.color || 0xffcc55,
      emissive: 0x7a4212,
      emissiveIntensity: 0.35,
      metalness: 0.78,
      roughness: 0.22,
      envMap: envMap,
      envMapIntensity: 2.0,
      flatShading: true
    });

    return new THREE.Mesh(geo, mat);
  }

  // ==========================================================================
  // 5. 6 FLOATING 3D ALERT ICONS + SPINNING PLASMA-FIRE "K" ORB
  // ==========================================================================
  function createAlertIcon3D(type, envMap) {
    const lilacMat = new THREE.MeshStandardMaterial({
      color: 0xdcb0ff,
      metalness: 0.78,
      roughness: 0.18,
      envMap: envMap,
      envMapIntensity: 1.9
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd066,
      emissive: 0x7c4414,
      emissiveIntensity: 0.35,
      metalness: 0.78,
      roughness: 0.2,
      envMap: envMap,
      envMapIntensity: 2.0,
      flatShading: true
    });
    const darkPurpleMat = new THREE.MeshStandardMaterial({
      color: 0x561c8c,
      metalness: 0.88,
      roughness: 0.2,
      envMap: envMap
    });

    const group = new THREE.Group();

    if (type === 'gift') {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 0.85), lilacMat);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.2, 0.94), lilacMat);
      lid.position.y = 0.42;
      const rib1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.98, 0.96), darkPurpleMat);
      rib1.position.y = 0.05;
      const rib2 = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.98, 0.18), darkPurpleMat);
      rib2.position.y = 0.05;
      const bowL = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 12, 24), darkPurpleMat);
      bowL.position.set(-0.15, 0.62, 0);
      bowL.rotation.z = 0.4;
      const bowR = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 12, 24), darkPurpleMat);
      bowR.position.set(0.15, 0.62, 0);
      bowR.rotation.z = -0.4;
      group.add(box, lid, rib1, rib2, bowL, bowR);
    } else if (type === 'diamond') {
      const geo = new THREE.OctahedronGeometry(0.65, 0);
      geo.scale(0.66, 1.28, 0.66);
      group.add(new THREE.Mesh(geo, goldMat));
    } else if (type === 'star') {
      group.add(createStar3D({ outerRadius: 0.78, innerRadius: 0.32, depth: 0.26, envMap }));
    } else if (type === 'dollar') {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.35, 0.26), lilacMat);
      const topCurve = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.12, 16, 32, Math.PI * 1.35), lilacMat);
      topCurve.position.set(0, 0.26, 0);
      topCurve.rotation.z = Math.PI * 0.35;
      const botCurve = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.12, 16, 32, Math.PI * 1.35), lilacMat);
      botCurve.position.set(0, -0.26, 0);
      botCurve.rotation.z = -Math.PI * 0.65;
      group.add(bar, topCurve, botCurve);
    } else if (type === 'bolt') {
      const shape = new THREE.Shape();
      shape.moveTo(0.12, 0.78);
      shape.lineTo(-0.42, -0.05);
      shape.lineTo(-0.04, -0.05);
      shape.lineTo(-0.22, -0.78);
      shape.lineTo(0.42, 0.12);
      shape.lineTo(0.04, 0.12);
      shape.closePath();
      const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.04,
        bevelSegments: 3
      });
      extrudeGeo.center();
      group.add(new THREE.Mesh(extrudeGeo, goldMat));
    } else if (type === 'user') {
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 28), lilacMat);
      head.position.y = 0.36;
      const bodyGeo = new THREE.CylinderGeometry(0.32, 0.48, 0.58, 28);
      bodyGeo.scale(1.15, 1, 0.62);
      const body = new THREE.Mesh(bodyGeo, lilacMat);
      body.position.y = -0.22;
      group.add(head, body);
    }

    return group;
  }

  // Glowing Fiery Plasma 3D Orb Coin with Extruded Letter ('J' for apenasojorge or 'K')
  function createAlertCoin3D(letter = 'J', envMap) {
    const group = new THREE.Group();
    const char = (letter || 'J').toUpperCase();

    // High-res plasma fire ring canvas texture (matching KondorGFX screenshot)
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Deep smoky plum core
    const coreGrad = ctx.createRadialGradient(256, 256, 20, 256, 256, 248);
    coreGrad.addColorStop(0.0, '#5a364e');
    coreGrad.addColorStop(0.55, '#351d36');
    coreGrad.addColorStop(0.78, '#7d3a68');
    coreGrad.addColorStop(0.90, '#ff9872');
    coreGrad.addColorStop(0.96, '#ffe5b4');
    coreGrad.addColorStop(1.0, '#c864ff');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Glowing plasma fire wisps around the rim (organic continuous fire halo)
    const rimFire = ctx.createRadialGradient(256, 256, 150, 256, 256, 252);
    rimFire.addColorStop(0.0, 'rgba(60, 28, 56, 0)');
    rimFire.addColorStop(0.45, 'rgba(195, 95, 225, 0.35)');
    rimFire.addColorStop(0.75, 'rgba(255, 165, 110, 0.82)');
    rimFire.addColorStop(0.92, 'rgba(255, 232, 185, 0.95)');
    rimFire.addColorStop(1.0, 'rgba(205, 110, 255, 0.65)');
    ctx.fillStyle = rimFire;
    ctx.beginPath();
    ctx.arc(256, 256, 252, 0, Math.PI * 2);
    ctx.fill();

    // Soft organic flame tongues along the ring
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + 0.3;
      const rx = 256 + Math.cos(angle) * 185;
      const ry = 256 + Math.sin(angle) * 185;
      const wisp = ctx.createRadialGradient(rx, ry, 10, rx, ry, 115);
      wisp.addColorStop(0, i % 2 === 0 ? 'rgba(255, 225, 165, 0.55)' : 'rgba(220, 125, 255, 0.45)');
      wisp.addColorStop(1, 'rgba(50, 20, 60, 0)');
      ctx.fillStyle = wisp;
      ctx.beginPath();
      ctx.arc(rx, ry, 115, 0, Math.PI * 2);
      ctx.fill();
    }

    const faceTex = new THREE.CanvasTexture(c);
    faceTex.colorSpace = THREE.SRGBColorSpace;

    const coinGeo = new THREE.CylinderGeometry(1.02, 1.02, 0.22, 64);
    coinGeo.rotateX(Math.PI / 2);
    const coinMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      metalness: 0.72,
      roughness: 0.22,
      envMap: envMap,
      envMapIntensity: 1.8
    });
    group.add(new THREE.Mesh(coinGeo, coinMat));

    // Glowing Beveled 3D Letter in the center ('J' for apenasojorge or 'K')
    const kMat = new THREE.MeshStandardMaterial({
      color: 0xfff0d8,
      emissive: 0xffa468,
      emissiveIntensity: 0.65,
      metalness: 0.85,
      roughness: 0.15,
      envMap: envMap
    });

    const letterGroup = new THREE.Group();
    if (char === 'J') {
      // Sculpted Beveled 3D Extruded 'J' for @apenasojorge
      const jShape = new THREE.Shape();
      jShape.moveTo(-0.08, 0.48);
      jShape.lineTo(0.36, 0.48);
      jShape.lineTo(0.36, 0.28);
      jShape.lineTo(0.24, 0.28);
      jShape.lineTo(0.24, -0.15);
      jShape.quadraticCurveTo(0.24, -0.48, -0.08, -0.48);
      jShape.quadraticCurveTo(-0.38, -0.48, -0.38, -0.18);
      jShape.lineTo(-0.38, -0.06);
      jShape.lineTo(-0.16, -0.06);
      jShape.lineTo(-0.16, -0.16);
      jShape.quadraticCurveTo(-0.16, -0.26, -0.08, -0.26);
      jShape.quadraticCurveTo(0.01, -0.26, 0.01, -0.15);
      jShape.lineTo(0.01, 0.28);
      jShape.lineTo(-0.08, 0.28);
      jShape.closePath();

      const jGeo = new THREE.ExtrudeGeometry(jShape, {
        depth: 0.26,
        bevelEnabled: true,
        bevelThickness: 0.045,
        bevelSize: 0.035,
        bevelSegments: 4
      });
      jGeo.center();
      const jMesh = new THREE.Mesh(jGeo, kMat);
      jMesh.position.z = 0.04;
      letterGroup.add(jMesh);
    } else {
      const leftBar = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.92, 0.32), kMat);
      leftBar.position.x = -0.22;
      const topArm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.58, 0.32), kMat);
      topArm.position.set(0.12, 0.21, 0);
      topArm.rotation.z = -0.72;
      const botArm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.58, 0.32), kMat);
      botArm.position.set(0.14, -0.21, 0);
      botArm.rotation.z = 0.72;
      letterGroup.add(leftBar, topArm, botArm);
    }
    group.add(letterGroup);

    return group;
  }

  // ==========================================================================
  // 6. VICE CITY STUDIO LIGHTING & TONE MAPPING SETUP
  // ==========================================================================
  function configureRenderer(renderer) {
    renderer.setSize(1920, 1080);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  function setupViceLighting(scene, variant = 'purple') {
    const ambient = new THREE.AmbientLight(0x28183c, 1.1);
    scene.add(ambient);

    // Hot Magenta / Sunset Key Light
    const keyLight = new THREE.DirectionalLight(
      variant === 'gold' ? 0xffb878 : 0xff55e0,
      3.4
    );
    keyLight.position.set(7, 8, 6);
    scene.add(keyLight);

    // Deep Violet Back/Rim Light
    const rimLight = new THREE.DirectionalLight(
      variant === 'gold' ? 0xa445ff : 0x8c2eff,
      2.8
    );
    rimLight.position.set(-8, -6, 4);
    scene.add(rimLight);

    // Warm Specular Kicker Light
    const kicker = new THREE.PointLight(
      variant === 'gold' ? 0xffe0a8 : 0xff94e8,
      2.4,
      30
    );
    kicker.position.set(0, 5, 8);
    scene.add(kicker);

    return { ambient, keyLight, rimLight, kicker };
  }

  global.GTA6Engine = {
    getStudioEnvMap,
    configureRenderer,
    createHandcuffs,
    createPistol,
    createCashStack,
    createStar3D,
    createAlertIcon3D,
    createAlertCoin3D,
    setupViceLighting
  };
})(window);
