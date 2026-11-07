/**
 * Micro-UI Vector & Geometry Construction Kit
 * Standard 2.5D axonometric projection, procedural geometry, and SVG construction utilities.
 *
 * MIT License
 * Copyright (c) 2026 chenyiwanshishen-source
 */

export const deg = Math.PI / 180;

/** Format a number to 2 decimal places for clean SVG output */
export const f = n => +(+n).toFixed(2);

// ==========================================
// 1. Vector & Linear Algebra Helpers
// ==========================================

export const add = (a, b) => a.map((val, i) => val + b[i]);
export const sub = (a, b) => a.map((val, i) => val - b[i]);
export const mul = (a, scalar) => a.map(val => val * scalar);
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + (a[2] || 0) * (b[2] || 0);
export const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const norm = a => {
  const len = Math.hypot(...a);
  return len ? mul(a, 1 / len) : a;
};
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/** Convert array of 2D points into closed SVG polygon path data */
export const poly = pts => 'M' + pts.map(p => `${f(p[0])},${f(p[1])}`).join('L') + 'Z';

/** Convert array of 2D points into open SVG polyline path data */
export const line = pts => 'M' + pts.map(p => `${f(p[0])},${f(p[1])}`).join('L');

// ==========================================
// 2. 2D Shapes & Contour Generators
// ==========================================

/**
 * Generate discrete perimeter points for a rounded rectangle.
 * @param {number} cx Center X
 * @param {number} cy Center Y
 * @param {number} w  Total width
 * @param {number} d  Total depth/height
 * @param {number} r  Corner radius
 * @param {number} n  Arc resolution per corner
 */
export function rrect(cx, cy, w, d, r, n = 7) {
  const points = [];
  const maxR = Math.min(r, w / 2, d / 2);
  const corners = [
    [cx + w / 2 - maxR, cy - d / 2 + maxR, -90],
    [cx + w / 2 - maxR, cy + d / 2 - maxR, 0],
    [cx - w / 2 + maxR, cy + d / 2 - maxR, 90],
    [cx - w / 2 + maxR, cy - d / 2 + maxR, 180],
  ];

  for (const [x, y, startAngle] of corners) {
    for (let i = 0; i <= n; i++) {
      const angle = (startAngle + (90 * i) / n) * deg;
      points.push([x + maxR * Math.cos(angle), y + maxR * Math.sin(angle)]);
    }
  }
  return points;
}

/** Generate points along a circle perimeter */
export const circle = (cx, cy, r, n = 64) =>
  Array.from({ length: n }, (_, i) => [
    cx + r * Math.cos((2 * Math.PI * i) / n),
    cy + r * Math.sin((2 * Math.PI * i) / n),
  ]);

/**
 * Compute the 2D convex hull of a point set using Andrew's Monotone Chain algorithm.
 * @param {Array<[number, number]>} P Point array
 * @returns {Array<[number, number]>} Points forming the convex hull polygon
 */
export function hull(P) {
  if (P.length <= 2) return P.slice();
  const sorted = P.map(pt => [pt[0], pt[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const cross2D = (origin, a, b) =>
    (a[0] - origin[0]) * (b[1] - origin[1]) - (a[1] - origin[1]) * (b[0] - origin[0]);

  const lower = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross2D(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper = [];
  for (const p of sorted.slice().reverse()) {
    while (upper.length >= 2 && cross2D(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

// ==========================================
// 3. Coordinate Frames & Transformations
// ==========================================

/** 3D rotation frame with Euler angles (applied in sequence X -> Y -> Z) */
export function rotFrame(rx = 0, ry = 0, rz = 0) {
  const rotateVec = v => {
    let [x, y, z] = v;
    // Rotation around X
    [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
    // Rotation around Y
    [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
    // Rotation around Z
    [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
    return [x, y, z];
  };

  return [rotateVec([1, 0, 0]), rotateVec([0, 1, 0]), rotateVec([0, 0, 1])];
}

/** Local coordinate frame with an origin point and basis vectors */
export const frame = (o, F = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) => ({
  o,
  F,
  at: ([x, y, z]) => add(add(add(o, mul(F[0], x)), mul(F[1], y)), mul(F[2], z)),
});

/** Plane tilt in degrees around X axis */
export const tiltFrame = tilt => {
  if (!Number.isFinite(tilt)) throw new Error('Explicit finite tilt required');
  const a = tilt * deg;
  return [
    [1, 0, 0],
    [0, Math.sin(a), Math.cos(a)],
    [0, -Math.cos(a), Math.sin(a)],
  ];
};

/** Upright plate frame (local X -> world X, local Y -> world Z) */
export const uprightFrame = [
  [1, 0, 0],
  [0, 0, 1],
  [0, -1, 0],
];

/** Classify normal direction into side roles */
export function sideKey(n) {
  if (n[2] > 0.62) return 'up';
  if (n[2] < -0.62) return 'down';
  const angle = Math.atan2(n[1], n[0]) / deg;
  if (angle >= -135 && angle < -45) return 'front';
  if (angle >= -45 && angle < 45) return 'right';
  if (angle >= 45 && angle < 135) return 'back';
  return 'left';
}

// ==========================================
// 4. Axonometric Camera & 2.5D Construction
// ==========================================

/**
 * Create an axonometric camera for 2.5D projection and solid extrusion.
 * @param {object} options
 * @param {number} options.TH Azimuth angle (theta) in degrees
 * @param {number} options.PH Elevation angle (phi) in degrees
 * @param {number} options.S  Scale factor
 * @param {string|null} options.outline Outline stroke color
 * @param {number} options.lineWidth Outline width
 */
export function makeCam({ TH, PH, S = 1, outline = null, lineWidth = 2 } = {}) {
  if (![TH, PH, S].every(Number.isFinite) || S <= 0) {
    throw new Error('Explicit finite TH/PH and positive S required');
  }

  const th = TH * deg;
  const ph = PH * deg;
  const cT = Math.cos(th), sT = Math.sin(th);
  const cP = Math.cos(ph), sP = Math.sin(ph);

  // Unit vector toward camera
  const V = [-sT * cP, -cT * cP, sP];

  // 3D to 2D projection function
  const pr = ([x, y, z]) => {
    const xr = x * cT - y * sT;
    const yr = x * sT + y * cT;
    return [S * xr, -S * (yr * sP + z * cP)];
  };

  const J = pr;
  const BOX = [];
  const keep = pts => {
    for (const q of pts) BOX.push(q);
    return pts;
  };

  function matrixRaw(fr, z) {
    const o = pr(fr.at([0, 0, z]));
    const a = J(fr.F[0]);
    const b = J(fr.F[1]);
    return [a[0], a[1], -b[0], -b[1], o[0], o[1]];
  }

  /** Affine transform matrix string for placing 2D elements onto a 3D plane */
  const mat = (fr, z) => `matrix(${matrixRaw(fr, z).map(f).join(' ')})`;

  /**
   * Construct extruded 2.5D solid geometry between bottom ring r0 and top ring r1.
   */
  function solid({
    fr,
    r0,
    z0,
    r1,
    z1,
    col,
    cap = col.cap,
    stroke = Boolean(outline),
    extra = '',
    creases = true,
    lw = lineWidth,
    track = true,
  }) {
    if (stroke && !outline) throw new Error('An outline colour is required when stroke is enabled');
    if (r0.length < 3 || r0.length !== r1.length) {
      throw new Error('Corresponding rings must have equal length >= 3');
    }

    const B = r0.map(p => fr.at([p[0], p[1], z0]));
    const T = r1.map(p => fr.at([p[0], p[1], z1]));
    const N = B.length;

    const vis = [];
    const key = [];
    let last = null;

    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      let n = cross(sub(B[j], B[i]), sub(T[i], B[i]));
      if (Math.hypot(...n) < 1e-6) n = cross(sub(T[j], T[i]), sub(T[i], B[i]));

      if (Math.hypot(...n) < 1e-6) {
        vis.push(last ? last.v : false);
        key.push(last ? last.k : 'front');
        continue;
      }

      n = norm(n);
      const isVisible = dot(n, V) > 0.06;
      const k = col.keyOf ? col.keyOf(n) : sideKey(n);
      vis.push(isVisible);
      key.push(k);
      last = { v: isVisible, k };
    }

    let out = '';
    let start = vis.findIndex(v => !v);
    if (start < 0) start = 0;

    const runs = [];
    let cur = null;
    for (let s = 1; s <= N; s++) {
      const i = (start + s) % N;
      if (vis[i]) {
        if (cur && cur.k === key[i]) {
          cur.end = i;
        } else {
          if (cur) runs.push(cur);
          cur = { k: key[i], beg: i, end: i };
        }
      } else {
        if (cur) runs.push(cur);
        cur = null;
      }
    }
    if (cur) runs.push(cur);

    const creaseIdx = [];
    const allp = [...B, ...T].map(pr);
    const runFills = [];

    for (const rn of runs) {
      const idx = [];
      let i = rn.beg;
      for (;;) {
        idx.push(i);
        if (i === rn.end) break;
        i = (i + 1) % N;
      }
      const e = (rn.end + 1) % N;
      const pts = [
        ...idx.map(k => B[k]),
        B[e],
        T[e],
        ...idx.slice().reverse().map(k => T[k]),
      ].map(pr);

      runFills.push(`<path d="${poly(pts)}" fill="${col[rn.k] ?? col.cap}"/>`);
    }

    if (runs.length) {
      out += `<path d="${poly(hull(allp))}" fill="${col[runs[0].k] ?? col.cap}"/>`;
    }
    out += runFills.join('');

    for (let a = 0; a < runs.length - 1; a++) {
      if ((runs[a].end + 1) % N === runs[a + 1].beg) creaseIdx.push(runs[a + 1].beg);
    }
    if (runs.length > 1 && (runs[runs.length - 1].end + 1) % N === runs[0].beg) {
      creaseIdx.push(runs[0].beg);
    }

    const capN = norm(cross(sub(T[1], T[0]), sub(T[Math.floor(N / 3)], T[0])));
    const topVis = dot(capN, V) > 0;
    const topPts = T.map(pr);

    if (topVis && cap) out += `<path d="${poly(topPts)}" fill="${cap}"/>`;
    out += extra;
    if (track) keep(allp);

    if (stroke) {
      out += `<path d="${poly(hull(allp))}" fill="none" stroke="${outline}" stroke-width="${lw}" stroke-linejoin="round"/>`;
      if (topVis) {
        out += `<path d="${poly(topPts)}" fill="none" stroke="${outline}" stroke-width="${lw}" stroke-linejoin="round"/>`;
      }
      if (creases) {
        for (const i of creaseIdx) {
          out += `<path d="${line([pr(B[i]), pr(T[i])])}" fill="none" stroke="${outline}" stroke-width="${lw}" stroke-linecap="round"/>`;
        }
      }
    }

    return { svg: out, hull: hull(allp), topVis, top: topPts };
  }

  /** Compute projected cast shadow polygon on a target plane */
  function castShadow(points, { planeZ = 0, direction } = {}) {
    if (!direction || direction.length !== 3 || !direction.every(Number.isFinite) || Math.abs(direction[2]) < 1e-9) {
      throw new Error('Non-horizontal finite 3D light direction required');
    }
    const [dx, dy, dz] = direction;
    return hull(
      points.map(([x, y, z]) =>
        pr([x + ((planeZ - z) * dx) / dz, y + ((planeZ - z) * dy) / dz, planeZ])
      )
    );
  }

  return { V, pr, J, BOX, keep, mat, matrixRaw, solid, castShadow };
}

// ==========================================
// 5. SVG Layout & Role Resolution Tools
// ==========================================

/** Calculate 2D bounding box [minX, minY, maxX, maxY] */
export function bbox(points) {
  if (!points.length || points.some(p => p.length < 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1]))) {
    throw new Error('Finite non-empty point set required');
  }
  return [
    Math.min(...points.map(p => p[0])),
    Math.min(...points.map(p => p[1])),
    Math.max(...points.map(p => p[0])),
    Math.max(...points.map(p => p[1])),
  ];
}

/** Compute scale and centering transform to fit bounding box into a viewport */
export function fitBounds(bounds, { width, height, margin = 0, allowUpscale = false } = {}) {
  const [x0, y0, x1, y1] = bounds;
  const w = x1 - x0;
  const h = y1 - y0;

  if (![...bounds, width, height, margin].every(Number.isFinite) || w <= 0 || h <= 0 || margin < 0 || width <= 2 * margin || height <= 2 * margin) {
    throw new Error('Positive bounds and usable viewport required');
  }

  const scale = Math.min((width - 2 * margin) / w, (height - 2 * margin) / h, allowUpscale ? Infinity : 1);
  const tx = width / 2 - (scale * (x0 + x1)) / 2;
  const ty = height / 2 - (scale * (y0 + y1)) / 2;

  return { scale, tx, ty, transform: `translate(${tx} ${ty}) scale(${scale})` };
}

/** Flat stepped extrusion generator */
export function extrude2D(d, { dx, dy, side, steps = 8 } = {}) {
  if (![dx, dy].every(Number.isFinite) || !Number.isInteger(steps) || steps < 1 || !side) {
    throw new Error('Explicit offset, side colour and positive integer steps required');
  }
  return Array.from({ length: steps }, (_, i) => {
    const k = (steps - i) / steps;
    return `<path d="${escapeXml(d)}" transform="translate(${f(dx * k)} ${f(dy * k)})" fill="${escapeXml(side)}"/>`;
  }).join('');
}

/** Escape XML special characters */
export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }[c]));
}

/** Resolve color roles from design token object */
export function resolveRoles(tokens, mapping) {
  return Object.fromEntries(
    Object.entries(mapping).map(([role, path]) => {
      const keys = Array.isArray(path) ? path : path.split('.');
      let value = tokens;
      for (const key of keys) {
        if (!value || typeof value !== 'object' || !Object.hasOwn(value, key)) {
          throw new Error(`Missing token: ${keys.join('.')}`);
        }
        value = value[key];
      }
      if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`Token is not a colour string: ${keys.join('.')}`);
      }
      return [role, value];
    })
  );
}

/** Convert var(--illus-role) CSS variables to concrete colors */
export function resolveSvgRoles(svg, roles) {
  return svg.replace(/var\(--illus-([a-zA-Z0-9_-]+)\)/g, (_, role) => {
    if (!Object.hasOwn(roles, role)) {
      throw new Error(`Unresolved illustration role: ${role}`);
    }
    return escapeXml(roles[role]);
  });
}

/** Wrap artwork body into a standalone SVG document */
export function svgDocument({ width, height, body, defs = '', background, label = '' }) {
  if (![width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
    throw new Error('Positive viewport dimensions required');
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}"><defs>${defs}</defs>${background ? `<rect width="${width}" height="${height}" fill="${escapeXml(background)}"/>` : ''}${body}</svg>`;
}
