/**
 * Movimiento de la landing: fondo WebGL del hero, explorador de servicios,
 * carrusel de sistemas, riel de pasos y acordeón de preguntas.
 * Portado del tablero de diseño; cada pieza se activa sola cuando entra en pantalla.
 */
const ACCENT = "#45FF8C";

// ---------------------------------------------------------------------------
// Foil Drift (Originkit) — escamas metálicas en WebGL cuyo brillo especular
// sigue al puntero. Portado a JS clásico; los shaders van tal cual.
// ---------------------------------------------------------------------------
const MAX_DPR = 2;

const VERT_SRC = `
precision highp float;

attribute vec2 a_seed;
attribute vec4 a_rnd;

uniform vec2  uRes;
uniform float uTime, uPx, uTumble, uSharp, uDrift, uSpread, uTilt;
uniform vec2  uLight;

varying float v_spec;

void main(){
  float ar = uRes.x / max(uRes.y, 1.0);

  float par = mix(0.55, 1.35, a_rnd.z);
  vec2 q = a_seed;
  q.x = fract(q.x + uTime * uDrift * 0.010 * par);
  q.y = fract(q.y + uTime * uDrift * 0.004 * par + 0.10 * sin(uTime * 0.20 + a_rnd.x * 6.283));
  vec2 p = (q - 0.5) * 2.05 * vec2(ar, 1.0);

  float spin = uTime * uTumble * (0.50 + a_rnd.y) + a_rnd.x * 6.283;
  float amp = uTilt * a_rnd.w * a_rnd.w;
  vec3 N = normalize(vec3(amp * cos(spin), amp * sin(spin), 1.0));

  vec3 lv = vec3(uLight, uSpread) - vec3(p, 0.0);
  vec3 L = normalize(lv);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));

  float atten = 1.0 / (1.0 + dot(lv, lv) * 0.42);
  float spec = pow(max(dot(N, H), 0.0), uSharp) * atten;

  v_spec = spec;
  float sz = uPx * (0.55 + 0.85 * fract(a_rnd.x * 7.13)) * par * (1.0 + 1.6 * spec);
  gl_PointSize = clamp(sz, 0.0, 120.0);
  gl_Position = vec4(p / vec2(ar, 1.0), 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;

uniform vec3 uBase, uAccent, uHigh;

varying float v_spec;

void main(){
  vec2 q = gl_PointCoord - 0.5;
  float m = 1.0 - smoothstep(0.55, 1.0, length(q) * 2.0);
  float s = v_spec;
  vec3 col = uBase * 0.45 + mix(uAccent, uHigh, clamp(s * 0.85, 0.0, 1.0)) * s * 2.8;
  float a = m * clamp(0.055 + s * 2.6, 0.0, 1.0);

  gl_FragColor = vec4(min(col * a, vec3(1.0)), a);
}
`;

// Preset del componente, con el verde de marca como acento.
const FOIL = {
  density: 9800,
  dotSize: 0.5,    // dotSize 50 / 100
  speed: 1.0,      // speed 50 / 50
  hover: 1.0,      // hover 100 / 100
  tumble: 3.0,     // flake.tumble 300 / 100
  tilt: 2.55,      // flake.tilt 300 / 100 * 0.85
  sharp: 13.2,     // 55 * (flake.sharpness 24 / 100)
  drift: 3.0,      // flake.drift 300 / 100
  spread: 2.0,     // flake.spread 200 / 100
  base: '#2A2E33',
  high: '#DFFFEE'
};

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('FoilDrift shader:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function parseColor(input, fb) {
  if (!input) return fb;
  const str = String(input).trim();
  if (str.charAt(0) === '#') {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r / 255, g / 255, b / 255];
    }
    return fb;
  }
  const m = str.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [
      Math.min(255, parseFloat(m[0])) / 255,
      Math.min(255, parseFloat(m[1])) / 255,
      Math.min(255, parseFloat(m[2])) / 255
    ];
  }
  return fb;
}

function clampN(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function flakes(n) {
  const R = rng(31337);
  const cols = Math.max(1, Math.round(Math.sqrt(n * 1.5)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const count = cols * rows;
  const seed = new Float32Array(count * 2);
  const rnd = new Float32Array(count * 4);
  let k = 0;
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      seed[k * 2] = (gx + R()) / cols;
      seed[k * 2 + 1] = (gy + R()) / rows;
      rnd[k * 4] = R();
      rnd[k * 4 + 1] = R();
      rnd[k * 4 + 2] = R();
      rnd[k * 4 + 3] = R();
      k++;
    }
  }
  return { seed: seed, rnd: rnd, count: count };
}
class Landing {
  componentDidMount() {
    this._alive = true;
    this._ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, on: 0, onTarget: 0 };
    let tries = 0;
    const boot = () => {
      if (!this._alive) return;
      const c = document.getElementById('aw-foil');
      if (c && !this._foilUp) { this._foilUp = true; this._initFoil(c); }
      if (document.getElementById('aw-exp') && !this._expUp) { this._expUp = true; this._initExp(); }
      if (document.getElementById('aw-car') && !this._carUp) { this._carUp = true; this._initCar(); }
      if (document.getElementById("aw-rail") && !this._railUp) { this._railUp = true; this._initRail(); }
      if (document.querySelector(".qa-panel") && !this._faqUp) { this._faqUp = true; this._initFaq(); }
      if (document.getElementById("aw-nav") && !this._navUp) { this._navUp = true; this._initNav(); }
      if (this._foilUp && this._expUp && this._carUp && this._railUp && this._faqUp && this._navUp) return;
      if (tries++ < 180) requestAnimationFrame(boot);
    };
    boot();
  }

  componentWillUnmount() {
    this._alive = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._detach) this._detach();
    if (this._expTimer) window.clearInterval(this._expTimer);
    if (this._carTimer) window.clearInterval(this._carTimer);
    if (this._expObs) this._expObs.disconnect();
    if (this._carObs) this._carObs.disconnect();
    if (this._railObs) this._railObs.disconnect();
    if (this._onScroll) window.removeEventListener("scroll", this._onScroll);
  }

  _initFoil(canvas) {
    const gl = canvas.getContext('webgl', {
      alpha: true, antialias: false, depth: false, premultipliedAlpha: true
    });
    if (!gl) { console.error('FoilDrift: WebGL unavailable'); return; }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('FoilDrift link:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const aSeed = gl.getAttribLocation(prog, 'a_seed');
    const aRnd = gl.getAttribLocation(prog, 'a_rnd');
    gl.enableVertexAttribArray(aSeed);
    gl.enableVertexAttribArray(aRnd);

    const locs = {};
    const u = (name) => {
      if (!(name in locs)) locs[name] = gl.getUniformLocation(prog, name);
      return locs[name];
    };

    const bSeed = gl.createBuffer();
    const bRnd = gl.createBuffer();
    let builtFor = 0;
    let count = 0;
    const build = (n) => {
      const f = flakes(n);
      gl.bindBuffer(gl.ARRAY_BUFFER, bSeed);
      gl.bufferData(gl.ARRAY_BUFFER, f.seed, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bRnd);
      gl.bufferData(gl.ARRAY_BUFFER, f.rnd, gl.STATIC_DRAW);
      builtFor = n;
      count = f.count;
    };

    const reduce = typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ptr = this._ptr;
    let last = performance.now();
    let clock = 0;

    const frame = (now) => {
      if (!this._alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock = (clock + dt * FOIL.speed) % 3600;

      const k = 1 - Math.exp(-6 * dt);
      ptr.on += (ptr.onTarget - ptr.on) * k;
      ptr.x += ((ptr.onTarget > 0 ? ptr.tx : 0.5) - ptr.x) * k;
      ptr.y += ((ptr.onTarget > 0 ? ptr.ty : 0.5) - ptr.y) * k;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const cw = canvas.clientWidth || 1440;
      const ch = canvas.clientHeight || 860;
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);
      const ar = bw / Math.max(bh, 1);
      const shortEdge = Math.min(bw, bh);

      if (FOIL.density !== builtFor) build(FOIL.density);

      const hv = Math.min(1, ptr.on) * FOIL.hover;
      const dx = 0.62 * ar * Math.cos(clock * 0.30);
      const dy = 0.40 * Math.sin(clock * 0.23);
      const mx = (ptr.x - 0.5) * 2.05 * ar;
      const my = (1 - ptr.y - 0.5) * 2.05;
      const lx = dx + (mx - dx) * Math.min(1, hv);
      const ly = dy + (my - dy) * Math.min(1, hv);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.bindBuffer(gl.ARRAY_BUFFER, bSeed);
      gl.vertexAttribPointer(aSeed, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bRnd);
      gl.vertexAttribPointer(aRnd, 4, gl.FLOAT, false, 0, 0);

      gl.uniform2f(u('uRes'), bw, bh);
      gl.uniform1f(u('uTime'), clock);
      gl.uniform1f(u('uPx'), Math.max(1.0, (shortEdge / 1080) * 5.0 * FOIL.dotSize));
      gl.uniform1f(u('uTumble'), FOIL.tumble);
      gl.uniform1f(u('uTilt'), FOIL.tilt);
      gl.uniform1f(u('uSharp'), FOIL.sharp);
      gl.uniform1f(u('uDrift'), FOIL.drift);
      gl.uniform1f(u('uSpread'), FOIL.spread);
      gl.uniform2f(u('uLight'), lx, ly);

      const cb = parseColor(FOIL.base, [0.165, 0.173, 0.22]);
      const ca = parseColor(ACCENT || '#45FF8C', [0.271, 1.0, 0.549]);
      const chh = parseColor(FOIL.high, [0.875, 1.0, 0.933]);
      gl.uniform3f(u('uBase'), cb[0], cb[1], cb[2]);
      gl.uniform3f(u('uAccent'), ca[0], ca[1], ca[2]);
      gl.uniform3f(u('uHigh'), chh[0], chh[1], chh[2]);

      gl.drawArrays(gl.POINTS, 0, count);
      if (!reduce) this._raf = requestAnimationFrame(frame);
    };

    // El puntero se escucha en toda la sección, no solo en el lienzo, para que
    // la luz siga al cursor también por encima del titular y los botones.
    const host = canvas.closest('section') || canvas.parentElement || canvas;
    const track = (e) => {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      ptr.tx = clampN((e.clientX - r.left) / r.width, 0, 1);
      ptr.ty = clampN((e.clientY - r.top) / r.height, 0, 1);
      ptr.onTarget = 1;
    };
    const onLeave = () => { ptr.onTarget = 0; };

    if (!reduce) {
      host.addEventListener('pointermove', track);
      host.addEventListener('pointerenter', track);
      host.addEventListener('pointerleave', onLeave);
      this._detach = () => {
        host.removeEventListener('pointermove', track);
        host.removeEventListener('pointerenter', track);
        host.removeEventListener('pointerleave', onLeave);
      };
    }

    build(FOIL.density);
    this._raf = requestAnimationFrame(frame);
  }

  _initExp() {
    const exp = document.getElementById('aw-exp');
    if (!exp) return;
    const items = Array.prototype.slice.call(exp.querySelectorAll('.exp-item'));
    const panes = Array.prototype.slice.call(exp.querySelectorAll('.pane'));
    const radios = Array.prototype.slice.call(exp.querySelectorAll('input[type="radio"]'));
    if (!items.length || items.length !== panes.length) return;

    const self = this;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = 0;

    const stop = function () {
      if (self._expTimer) { window.clearInterval(self._expTimer); self._expTimer = 0; }
    };
    const show = function (n) {
      if (n === cur || n < 0 || n >= panes.length) return;
      const prev = panes[cur];
      prev.classList.remove('on');
      prev.classList.add('out');
      prev.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () { prev.classList.remove('out'); }, 480);
      items[cur].classList.remove('on');
      cur = n;
      panes[cur].classList.remove('out');
      panes[cur].classList.add('on');
      panes[cur].removeAttribute('aria-hidden');
      items[cur].classList.add('on');
      if (radios[cur]) radios[cur].checked = true;
    };
    const start = function () {
      stop();
      if (reduce || !self._expVisible) return;
      exp.classList.remove('paused');
      self._expTimer = window.setInterval(function () {
        show((cur + 1) % panes.length);
      }, 5600);
    };

    radios.forEach(function (r, i) {
      r.addEventListener('change', function () { show(i); start(); });
      r.addEventListener('focus', function () { exp.classList.add('kb'); });
      r.addEventListener('blur', function () { exp.classList.remove('kb'); });
    });
    exp.addEventListener('pointerenter', function () { exp.classList.add('paused'); stop(); });
    exp.addEventListener('pointerleave', function () { start(); });

    this._expVisible = false;
    if (window.IntersectionObserver) {
      this._expObs = new IntersectionObserver(function (entries) {
        self._expVisible = entries[0].isIntersecting;
        if (self._expVisible) { start(); } else { stop(); }
      }, { threshold: 0.2 });
      this._expObs.observe(exp);
    } else {
      this._expVisible = true;
      start();
    }
  }

  _initCar() {
    const car = document.getElementById('aw-car');
    if (!car) return;
    const track = car.querySelector('.car-track');
    const slides = Array.prototype.slice.call(car.querySelectorAll('.car-slide'));
    const dots = Array.prototype.slice.call(car.querySelectorAll('.car-dot'));
    const btns = Array.prototype.slice.call(car.querySelectorAll('.car-btn'));
    const count = document.getElementById('aw-car-count');
    if (!track || !slides.length) return;

    const self = this;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = slides.length;
    let cur = 0;

    const pad = function (v) { return (v < 10 ? '0' : '') + v; };
    const stop = function () {
      if (self._carTimer) { window.clearInterval(self._carTimer); self._carTimer = 0; }
    };
    const go = function (i) {
      cur = ((i % total) + total) % total;
      track.style.setProperty('--i', String(cur));
      slides.forEach(function (s, k) {
        if (k === cur) { s.classList.add('on'); } else { s.classList.remove('on'); }
      });
      dots.forEach(function (d, k) {
        d.classList.remove('on');
        if (k === cur) { void d.offsetWidth; d.classList.add('on'); }
      });
      if (count) count.textContent = pad(cur + 1) + ' / ' + pad(total);
    };
    const start = function () {
      stop();
      if (reduce || !self._carVisible) return;
      car.classList.remove('paused');
      self._carTimer = window.setInterval(function () { go(cur + 1); }, 6600);
    };

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        go(cur + Number(b.getAttribute('data-dir') || 1));
        start();
      });
    });
    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { go(k); start(); });
    });
    car.addEventListener('pointerenter', function () { car.classList.add('paused'); stop(); });
    car.addEventListener('pointerleave', function () { start(); });

    go(0);

    this._carVisible = false;
    if (window.IntersectionObserver) {
      this._carObs = new IntersectionObserver(function (entries) {
        self._carVisible = entries[0].isIntersecting;
        if (self._carVisible) { start(); } else { stop(); }
      }, { threshold: 0.2 });
      this._carObs.observe(car);
    } else {
      this._carVisible = true;
      start();
    }
  }

  _initRail() {
    const rail = document.getElementById('aw-rail');
    if (!rail) return;
    const replay = function () {
      rail.classList.remove('go');
      void rail.offsetWidth;
      rail.classList.add('go');
    };
    if (window.IntersectionObserver) {
      this._railObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { replay(); } else { rail.classList.remove('go'); }
      }, { threshold: 0.3 });
      this._railObs.observe(rail);
    } else {
      replay();
    }
  }

  /** La barra se contrae en cuanto el hero deja de mandar. */
  _initNav() {
    const nav = document.getElementById("aw-nav");
    if (!nav) return;
    let last = null;
    const sync = function () {
      const stuck = window.scrollY > 64;
      if (stuck === last) return;
      last = stuck;
      nav.classList.toggle("is-stuck", stuck);
    };
    this._onScroll = function () { window.requestAnimationFrame(sync); };
    window.addEventListener("scroll", this._onScroll, { passive: true });
    sync();
  }

  _initFaq() {
    const panel = document.querySelector('.qa-panel');
    if (!panel) return;
    const items = Array.prototype.slice.call(panel.querySelectorAll('details.qa'));
    if (items.length < 2) return;
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        items.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
  }

}


export function initLanding() {
  const app = new Landing();
  app.componentDidMount();
  return () => app.componentWillUnmount();
}
