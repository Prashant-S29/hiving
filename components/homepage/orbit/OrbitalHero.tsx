"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface OrbitalHeroProps {
  /** Overall orbital speed multiplier. */
  orbitSpeed?: number;
  /** How fast the whole system (and the counter-streaming starfield) drifts sideways. */
  driftSpeed?: number;
  /** Tilt of the orbital plane, in degrees. */
  planeLean?: number;
  /** Comet-style tapered trails behind each planet. */
  showTrails?: boolean;
}

/**
 * A sun-anchored orbital system: planets travel one direction on a tilted
 * plane (inner ones faster, Kepler-ish), each trailing a comet tail; the
 * starfield behind them streams the opposite way to sell the sun's own
 * travel. Ported 1:1 from the Claude Design prototype's Three.js scene —
 * same math, now backed by a real `three` import instead of a CDN script.
 */
export function OrbitalHero({ orbitSpeed = 1, driftSpeed = 3, planeLean = 22, showTrails = true }: OrbitalHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const speed = orbitSpeed;
    const lean = (planeLean * Math.PI) / 180;
    const drift = driftSpeed;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
    camera.position.set(0, 0, 40);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Side-on view. The sun holds its place on screen while the system drifts
    // along +X; trails are laid down in the world it left behind, so each
    // planet's path resolves into a helix rather than a closed ellipse.
    const system = new THREE.Group();
    scene.add(system);

    // orbital plane, seen nearly edge-on: e1 runs up-screen with a lean,
    // e2 runs into depth, so orbits project as narrow leaning ellipses
    const e1 = new THREE.Vector3(Math.sin(lean), Math.cos(lean), 0).normalize();
    const e2 = new THREE.Vector3(0.14, -0.06, 0.99).normalize();
    const VIEW = new THREE.Vector3(0, 0, 1);

    scene.add(new THREE.AmbientLight(0xfff0e2, 0.9));
    const sunLight = new THREE.PointLight(0xffc069, 2.4, 260);
    system.add(sunLight);
    const fill = new THREE.DirectionalLight(0xffe6cf, 0.5);
    fill.position.set(-8, 14, 12);
    scene.add(fill);

    // ---- sun: solid core + two soft shells that read as glow on cream paper
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffa030 }));
    system.add(sun);
    const shellMat = (op: number, col: number) => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op });
    const shellA = new THREE.Mesh(new THREE.SphereGeometry(1.95, 48, 48), shellMat(0.28, 0xffb968));
    const shellB = new THREE.Mesh(new THREE.SphereGeometry(2.5, 48, 48), shellMat(0.12, 0xffd0a0));
    system.add(shellA, shellB);

    // ---- orbit rings, drawn in the tilted plane (read as thin leaning ellipses)
    const ringOf = (r: number, op: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 180; i++) {
        const a = (i / 180) * Math.PI * 2;
        pts.push(
          new THREE.Vector3(
            e1.x * Math.cos(a) * r + e2.x * Math.sin(a) * r,
            e1.y * Math.cos(a) * r + e2.y * Math.sin(a) * r,
            e1.z * Math.cos(a) * r + e2.z * Math.sin(a) * r,
          ),
        );
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      return new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xb0713a, transparent: true, opacity: op }));
    };

    // ---- starfield: distant dots streaming the opposite way to the sun's travel
    const SN = 460;
    const SPAN = 150;
    const sPos = new Float32Array(SN * 3);
    const sSeed = new Float32Array(SN);
    for (let i = 0; i < SN; i++) {
      sSeed[i] = Math.random() * SPAN;
      sPos[i * 3] = sSeed[i] - SPAN / 2;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 46;
      sPos[i * 3 + 2] = -14 - Math.random() * 46;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x9c6534, size: 0.3, transparent: true, opacity: 0.5, sizeAttenuation: true, depthWrite: false }),
    );
    scene.add(stars);

    // ---- planets, all travelling the same direction, inner ones faster (Kepler-ish)
    const defs = [
      { r: 2.9, size: 0.22, color: 0x8a4a12, per: 4.5, trail: 0.26 },
      { r: 4.3, size: 0.34, color: 0xd4712a, per: 7.0, trail: 0.3 },
      { r: 5.9, size: 0.44, color: 0xff8c00, per: 10.5, trail: 0.32 },
      { r: 7.4, size: 0.3, color: 0x904d00, per: 14.5, trail: 0.24 },
      { r: 8.9, size: 0.56, color: 0xc6752f, per: 19.5, trail: 0.22 },
      { r: 10.3, size: 0.4, color: 0x9a4fd6, per: 26.0, trail: 0.14 },
    ];

    const planets = defs.map((d, i) => {
      if (i === 2 || i === 4) system.add(ringOf(d.r, 0.07)); // two faint reference orbits only
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(d.size, 40, 40),
        new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.55, metalness: 0.18 }),
      );
      system.add(mesh);

      // comet-style trail: a tapered ribbon over the arc just travelled
      const N = 66;
      let trail: THREE.Mesh | null = null;
      if (showTrails) {
        const pos = new Float32Array(N * 2 * 3);
        const col = new Float32Array(N * 2 * 4);
        const idx: number[] = [];
        for (let k = 0; k < N - 1; k++) {
          const a = k * 2,
            b = k * 2 + 1,
            c = (k + 1) * 2,
            e = (k + 1) * 2 + 1;
          idx.push(a, b, e, a, e, c);
        }
        const base = new THREE.Color(d.color);
        for (let k = 0; k < N; k++) {
          const f = 1 - k / (N - 1); // 1 at the head, 0 at the tail
          const lift = (1 - f) * 0.45; // tail washes toward the paper
          const r = base.r + (1 - base.r) * lift;
          const g2 = base.g + (1 - base.g) * lift;
          const b2 = base.b + (1 - base.b) * lift;
          const alpha = Math.pow(f, 1.5) * d.trail * 1.7;
          for (let s = 0; s < 2; s++) {
            const o = (k * 2 + s) * 4;
            col[o] = r;
            col[o + 1] = g2;
            col[o + 2] = b2;
            col[o + 3] = alpha;
          }
        }
        const g = new THREE.BufferGeometry();
        g.setIndex(idx);
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        g.setAttribute("color", new THREE.BufferAttribute(col, 4));
        trail = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
        system.add(trail);
      }

      return { ...d, mesh, trail, N, phase: (i * 1.9) % (Math.PI * 2) };
    });

    // one moon, to give the middle planet a sense of scale
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), new THREE.MeshStandardMaterial({ color: 0xe8c49f, roughness: 0.7 }));
    system.add(moon);

    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };
    if (!prefersReducedMotion) parent.addEventListener("mousemove", onMove);

    // keep the sun anchored at ~76% of the hero width, whatever the viewport
    const resize = () => {
      const w = parent.clientWidth,
        h = parent.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
      system.position.x = visH * camera.aspect * 0.32; // matches the CSS bloom's left:82%
      system.position.y = visH * 0.06;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // orbit position at time t, in the frame that travels with the sun
    const posAt = (p: (typeof planets)[number], t: number, out: THREE.Vector3) => {
      const a = p.phase + (t / p.per) * Math.PI * 2 * speed;
      const c = Math.cos(a) * p.r,
        s = Math.sin(a) * p.r;
      return out.set(e1.x * c + e2.x * s, e1.y * c + e2.y * s, e1.z * c + e2.z * s);
    };
    // same orbit, but pushed back along -X by how far the sun has travelled since
    // — this is what turns each closed orbit into a trailing helix
    const wakeAt = (p: (typeof planets)[number], t: number, now: number, out: THREE.Vector3) => {
      posAt(p, t, out);
      out.x -= drift * (now - t);
      return out;
    };
    const _v = new THREE.Vector3(),
      _v2 = new THREE.Vector3(),
      _tan = new THREE.Vector3(),
      _off = new THREE.Vector3();

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      const t = clock.getElapsedTime();

      sun.rotation.y = t * 0.06;
      shellA.rotation.y = -t * 0.04;
      shellB.rotation.y = t * 0.03;
      shellA.scale.setScalar(1 + Math.sin(t * 0.9) * 0.025);
      shellB.scale.setScalar(1 + Math.sin(t * 0.9 + 1) * 0.035);

      planets.forEach((p) => {
        posAt(p, t, _v);
        p.mesh.position.copy(_v);
        p.mesh.rotation.y = t * 0.4;
        if (p.trail) {
          const arr = (p.trail.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
          const dt = 0.13;
          for (let k = 0; k < p.N; k++) {
            const f = 1 - k / (p.N - 1);
            wakeAt(p, t - k * dt, t, _v);
            wakeAt(p, t - (k + 1) * dt, t, _v2);
            _tan.subVectors(_v, _v2);
            if (_tan.lengthSq() < 1e-8) _tan.set(1, 0, 0);
            _off.crossVectors(_tan.normalize(), VIEW);
            if (_off.lengthSq() < 1e-8) _off.set(0, 1, 0);
            _off.normalize().multiplyScalar(p.size * 0.62 * Math.pow(f, 0.62));
            const o = k * 6;
            arr[o] = _v.x - _off.x;
            arr[o + 1] = _v.y - _off.y;
            arr[o + 2] = _v.z - _off.z;
            arr[o + 3] = _v.x + _off.x;
            arr[o + 4] = _v.y + _off.y;
            arr[o + 5] = _v.z + _off.z;
          }
          (p.trail.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        }
      });

      const host = planets[2];
      posAt(host, t, _v);
      moon.position.set(_v.x + Math.cos(t * 1.6) * 1.3, _v.y + Math.sin(t * 1.6) * 1.1, _v.z + Math.sin(t * 1.6) * 1.3);

      // stars stream the opposite way to the sun's travel, wrapping seamlessly
      const sArr = (starGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < SN; i++) {
        let x = sSeed[i] - ((drift * 0.55 * t) % SPAN);
        if (x < 0) x += SPAN;
        sArr[i * 3] = x - SPAN / 2;
      }
      (starGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      camera.position.x = mx * 7;
      camera.position.y = -my * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      if (!prefersReducedMotion) raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      parent.removeEventListener("mousemove", onMove);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose();
        }
      });
    };
  }, [orbitSpeed, driftSpeed, planeLean, showTrails]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}
