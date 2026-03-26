// ts/_shadertoy.ts
function parseCSSColorToFloat(colorStr) {
  const div = document.createElement("div");
  div.style.color = window.getComputedStyle(document.body).getPropertyValue(colorStr).trim();
  document.body.appendChild(div);
  const rgb = window.getComputedStyle(div).color;
  document.body.removeChild(div);
  const match = rgb.match(/[\d.]+/g);
  return [
    parseFloat(match[0]) / 255,
    parseFloat(match[1]) / 255,
    parseFloat(match[2]) / 255,
    match[3] !== undefined ? parseFloat(match[3]) : 1
  ];
}
class ShaderSketch {
  container;
  canvas;
  gl;
  program;
  elTimeRange;
  elTimeRangeLabel;
  elFramerate;
  elTotaltime;
  elMaxtime;
  elResolution;
  elFailed;
  elPanzoom;
  elButtonsPlay;
  elButtonsPause;
  elButtonsReset;
  elButtonFullscreen;
  elButtonExitFullscreen;
  startTime;
  lastNow;
  lastFrameTime;
  lastRenderTime;
  iTime;
  iResolution;
  iTileOffset;
  iMouse;
  iColorDarker;
  iColorDark;
  iColorGray;
  iColorLight;
  iColorLighter;
  iColorPrimary;
  iColorPrimaryDark;
  iColorPrimaryLight;
  iColorSecondary;
  iColorTertiary;
  iAA;
  iTimeScale;
  zoom;
  cx;
  cy;
  _dragActive;
  _dragStartX;
  _dragStartY;
  _dragCX;
  _dragCY;
  _pinchDist;
  _pinchZoom;
  _pinchMidX;
  _pinchMidY;
  _pinchFracCX;
  _pinchFracCY;
  frameCount;
  fps;
  fpsLimit;
  fpsInterval;
  uniforms;
  scaleFactor;
  maxTime;
  isPaused;
  isLooping;
  setFailed(error) {
    this.canvas.style.display = "none";
    this.elFailed.forEach((el) => {
      el.style.display = "flex";
      el.innerHTML = String(error);
    });
  }
  constructor(container, canvas, fragmentShader) {
    this.container = container;
    this.canvas = canvas;
    this.elFailed = document.querySelectorAll("#error");
    this.elTimeRange = document.querySelectorAll("#timerange");
    this.elTimeRangeLabel = document.querySelectorAll("#timerange-label");
    this.elFramerate = document.querySelectorAll("#framerate");
    this.elTotaltime = document.querySelectorAll("#totaltime");
    this.elMaxtime = document.querySelectorAll("#maxtime");
    this.elResolution = document.querySelectorAll("#resolution");
    this.elPanzoom = document.querySelectorAll("#panzoom");
    this.elButtonsPlay = document.querySelectorAll('[id="play"]');
    this.elButtonsPause = document.querySelectorAll('[id="pause"]');
    this.elButtonsReset = document.querySelectorAll('[id="reset"]');
    this.elButtonFullscreen = document.querySelector("#fullscreen");
    this.elButtonExitFullscreen = document.querySelector("#exit-fullscreen");
    const gl = canvas.getContext("webgl2", {});
    if (!gl) {
      console.error("WebGL2 not supported");
      this.setFailed("WebGL2 not supported");
      return;
    }
    this.gl = gl;
    this.startTime = Date.now();
    this.lastNow = Date.now();
    this.lastFrameTime = Date.now();
    this.iTime = 0;
    this.iResolution = [0, 0];
    this.iTileOffset = [0, 0];
    this.iMouse = [0, 0, 0, 0];
    this.iColorDarker = [0, 0, 0, 0];
    this.iColorDark = [0, 0, 0, 0];
    this.iColorGray = [0, 0, 0, 0];
    this.iColorLight = [0, 0, 0, 0];
    this.iColorLighter = [0, 0, 0, 0];
    this.iColorPrimary = [0, 0, 0, 0];
    this.iColorPrimaryDark = [0, 0, 0, 0];
    this.iColorPrimaryLight = [0, 0, 0, 0];
    this.iColorSecondary = [0, 0, 0, 0];
    this.iColorTertiary = [0, 0, 0, 0];
    this.iAA = 1;
    this.iTimeScale = 1;
    this.zoom = 1;
    this.cx = 0;
    this.cy = 0;
    this._dragActive = false;
    this._dragStartX = 0;
    this._dragStartY = 0;
    this._dragCX = 0;
    this._dragCY = 0;
    this._pinchDist = 0;
    this._pinchZoom = 1;
    this._pinchMidX = 0;
    this._pinchMidY = 0;
    this._pinchFracCX = 0;
    this._pinchFracCY = 0;
    this.frameCount = 0;
    this.fps = 0;
    this.fpsLimit = 0;
    this.fpsInterval = 0;
    this.lastRenderTime = 0;
    this.uniforms = [];
    this.scaleFactor = 1;
    this.maxTime = 1;
    this.isPaused = true;
    this.isLooping = false;
    this.initShader(fragmentShader);
    this.resize();
    this.resetSketch();
    this.playSketch();
    this.canvas.addEventListener("resize", () => this.resize());
    this.elButtonsPause.forEach((el) => el.addEventListener("click", () => this.pauseSketch()));
    this.elButtonsPlay.forEach((el) => el.addEventListener("click", () => this.playSketch()));
    this.elButtonsReset.forEach((el) => el.addEventListener("click", () => this.resetSketch()));
    this.elTimeRange.forEach((el) => el.addEventListener("input", (e) => {
      this.isPaused = true;
      this.elButtonsPause.forEach((b) => b.classList.toggle("active", true));
      this.elButtonsPlay.forEach((b) => b.classList.toggle("active", false));
      this.iTime = parseFloat(e.target.value);
      if (!this.isLooping)
        requestAnimationFrame(() => this.render());
    }));
    this.elButtonFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        this.container.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });
    this.elButtonExitFullscreen.addEventListener("click", () => {
      document.exitFullscreen();
    });
    new ResizeObserver(() => this.resize()).observe(this.canvas);
    const refreshColors = () => {
      console.log("refresh colors");
      this.iColorLighter = parseCSSColorToFloat("--color-lighter");
      this.iColorLight = parseCSSColorToFloat("--color-light");
      this.iColorGray = parseCSSColorToFloat("--color-gray");
      this.iColorDark = parseCSSColorToFloat("--color-dark");
      this.iColorDarker = parseCSSColorToFloat("--color-darker");
      this.iColorPrimary = parseCSSColorToFloat("--color-primary");
      this.iColorSecondary = parseCSSColorToFloat("--color-secondary");
      this.iColorTertiary = parseCSSColorToFloat("--color-tertiary");
      this.iColorPrimaryDark = parseCSSColorToFloat("--color-primary-dark");
      this.iColorPrimaryLight = parseCSSColorToFloat("--color-primary-light");
      this.renderOnce();
    };
    new MutationObserver(refreshColors).observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    new MutationObserver(refreshColors).observe(document.body, { attributes: true, attributeFilter: ["data-dark-mode"] });
    const captureButtons = document.querySelectorAll("button[data-capture]");
    captureButtons.forEach((el) => {
      let capfunc = null;
      const [type, cw, ch, ct] = el.getAttribute("data-capture").split(" ");
      switch (type) {
        case "fullscreen":
          capfunc = () => this.captureResolution(window.screen.width * window.devicePixelRatio, window.screen.height * window.devicePixelRatio);
          break;
        case "canvas":
          capfunc = () => this.captureResolution(this.canvas.width, this.canvas.height);
          break;
        case "custom":
          capfunc = () => this.captureResolution(parseInt(cw), parseInt(ch));
          break;
        case "custom-tile":
          capfunc = () => this.captureTiledAsync(parseInt(cw), parseInt(ch), parseInt(ct));
          break;
        default:
          console.log("bad screenshot button");
          return;
      }
      el.addEventListener("click", capfunc);
    });
    const downresButtons = document.querySelectorAll("button[data-downres]");
    downresButtons.forEach((el) => {
      el.addEventListener("click", () => {
        this.setScalingFactor(parseFloat(el.getAttribute("data-downres")));
        downresButtons.forEach((el2) => el2.classList.toggle("active", false));
        el.classList.toggle("active", true);
      });
    });
    const iaaButtons = document.querySelectorAll("button[data-iaa]");
    iaaButtons.forEach((el) => {
      el.addEventListener("click", () => {
        this.setIAAValue(parseInt(el.getAttribute("data-iaa")));
        iaaButtons.forEach((el2) => el2.classList.toggle("active", false));
        el.classList.toggle("active", true);
      });
    });
    const tscaleButtons = document.querySelectorAll("button[data-tscale]");
    tscaleButtons.forEach((el) => {
      el.addEventListener("click", () => {
        this.setTscaleValue(parseFloat(el.getAttribute("data-tscale")));
        tscaleButtons.forEach((el2) => el2.classList.toggle("active", false));
        el.classList.toggle("active", true);
      });
    });
    const fpslimitButtons = document.querySelectorAll("button[data-fpslimit]");
    fpslimitButtons.forEach((el) => {
      el.addEventListener("click", () => {
        this.setFpslimit(parseInt(el.getAttribute("data-fpslimit")));
        fpslimitButtons.forEach((el2) => el2.classList.toggle("active", false));
        el.classList.toggle("active", true);
      });
    });
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && this.zoom > 1) {
        this._dragActive = true;
        this._dragStartX = e.touches[0].clientX;
        this._dragStartY = e.touches[0].clientY;
        this._dragCX = this.cx;
        this._dragCY = this.cy;
      } else if (e.touches.length === 2) {
        this._dragActive = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this._pinchDist = Math.hypot(dx, dy);
        this._pinchZoom = this.zoom;
        const rect = this.canvas.getBoundingClientRect();
        this._pinchMidX = ((e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left) / rect.width;
        this._pinchMidY = 1 - ((e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top) / rect.height;
        this._pinchFracCX = this.cx;
        this._pinchFracCY = this.cy;
      }
    }, { passive: false });
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      if (e.touches.length === 1 && this._dragActive) {
        const aspect = this.canvas.width / this.canvas.height;
        const dx = (e.touches[0].clientX - this._dragStartX) / rect.width * aspect / this.zoom;
        const dy = (e.touches[0].clientY - this._dragStartY) / rect.height / this.zoom;
        this.cx = this._dragCX - dx;
        this.cy = this._dragCY + dy;
        this.applyPanZoom();
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = dist / this._pinchDist;
        const pmx = this._pinchMidX;
        const pmy = this._pinchMidY;
        const aspect = this.canvas.width / this.canvas.height;
        const fx = this._pinchFracCX + aspect * (pmx - 0.5) / this._pinchZoom;
        const fy = this._pinchFracCY + (pmy - 0.5) / this._pinchZoom;
        this.zoom = Math.max(1, Math.min(999999, this._pinchZoom * factor));
        this.cx = fx - aspect * (pmx - 0.5) / this.zoom;
        this.cy = fy - (pmy - 0.5) / this.zoom;
        this.applyPanZoom();
      }
    }, { passive: false });
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const cx_norm = e.offsetX / this.canvas.width;
      const cy_norm = 1 - e.offsetY / this.canvas.height;
      const aspect = this.canvas.width / this.canvas.height;
      const fx = this.cx + aspect * (cx_norm - 0.5) / this.zoom;
      const fy = this.cy + (cy_norm - 0.5) / this.zoom;
      this.zoom = Math.max(1, Math.min(999999, this.zoom * factor));
      this.cx = fx - aspect * (cx_norm - 0.5) / this.zoom;
      this.cy = fy - (cy_norm - 0.5) / this.zoom;
      this.applyPanZoom();
    }, { passive: false });
    canvas.addEventListener("mousedown", (e) => {
      if (this.zoom > 1) {
        this._dragActive = true;
        this._dragStartX = e.clientX;
        this._dragStartY = e.clientY;
        this._dragCX = this.cx;
        this._dragCY = this.cy;
      }
    });
    canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this._dragActive) {
        const aspect = this.canvas.width / this.canvas.height;
        const dx = (e.clientX - this._dragStartX) / rect.width * aspect / this.zoom;
        const dy = (e.clientY - this._dragStartY) / rect.height / this.zoom;
        this.cx = this._dragCX - dx;
        this.cy = this._dragCY + dy;
        this.applyPanZoom();
      }
    });
    canvas.addEventListener("touchend", () => {
      this._dragActive = false;
    });
    canvas.addEventListener("touchcancel", () => {
      this._dragActive = false;
    });
    canvas.addEventListener("mouseup", () => {
      this._dragActive = false;
    });
    canvas.addEventListener("mouseleave", () => {
      this._dragActive = false;
    });
  }
  applyPanZoom() {
    if (this.zoom === 1) {
      this.cx = 0;
      this.cy = 0;
    }
    const w = this.canvas.width;
    const h = this.canvas.height;
    const aspect = w / h;
    const maxCY = 0.5 * (1 - 1 / this.zoom);
    const maxCX = aspect * maxCY;
    this.cx = Math.max(-maxCX, Math.min(maxCX, this.cx));
    this.cy = Math.max(-maxCY, Math.min(maxCY, this.cy));
    const panX = this.cx / aspect - 0.5 / this.zoom + 0.5;
    const panY = this.cy - 0.5 / this.zoom + 0.5;
    this.iResolution = [
      w * this.zoom,
      h * this.zoom
    ];
    this.iTileOffset = [
      panX * w * this.zoom,
      panY * h * this.zoom
    ];
    this.elPanzoom.forEach((el) => el.innerHTML = `zoom:${Math.log(this.zoom).toFixed(2)} pan:${this.cx.toFixed(4)} x ${this.cy.toFixed(4)}`);
  }
  pauseSketch() {
    this.isPaused = true;
    this.elButtonsPause.forEach((el) => el.classList.toggle("active", true));
    this.elButtonsPlay.forEach((el) => el.classList.toggle("active", false));
  }
  playSketch() {
    this.isPaused = false;
    this.elButtonsPause.forEach((el) => el.classList.toggle("active", false));
    this.elButtonsPlay.forEach((el) => el.classList.toggle("active", true));
    this.maxTime = Math.max(1, this.maxTime);
    this.elTimeRange.forEach((el) => {
      el.max = String(Math.ceil(this.maxTime * 100) / 100);
      el.value = String(this.maxTime);
    });
    this.lastNow = Date.now();
    if (!this.isLooping) {
      requestAnimationFrame(() => this.render());
    }
  }
  resetSketch() {
    this.lastNow = Date.now();
    this.iTime = 0;
    this.maxTime = 1;
    this.elTimeRange.forEach((el) => {
      el.value = "1";
      el.max = "1";
    });
    this.elTotaltime.forEach((el) => el.innerText = this.formatTime(0));
    this.elMaxtime.forEach((el) => el.innerText = this.formatTime(1));
    this.renderOnce();
  }
  setScalingFactor(scaleFactor) {
    this.scaleFactor = Math.min(Math.max(scaleFactor, 0.1), 1);
    this.resize();
    console.log(`scaling factor set: ${this.scaleFactor}`);
  }
  setIAAValue(iAAValue) {
    this.iAA = Math.min(Math.max(iAAValue, 1), 100);
    console.log(`iaa value set: ${this.iAA}`);
    if (!this.isLooping)
      requestAnimationFrame(() => this.render());
  }
  setTscaleValue(tscaleValue) {
    this.iTimeScale = Math.min(Math.max(tscaleValue, 0.001), 100);
    console.log(`tscale value set: ${this.iTimeScale}`);
  }
  setFpslimit(fpslimitValue) {
    this.fpsLimit = Math.min(Math.max(fpslimitValue, 0), 100);
    this.fpsInterval = this.fpsLimit > 0 ? 1000 / this.fpsLimit : 0;
    console.log(`fpslimit value set: ${this.fpsLimit}`);
  }
  async captureTiledAsync(cols, rows, tileSize = 4096) {
    const gl = this.gl;
    const totalW = cols * tileSize;
    const totalH = rows * tileSize;
    const CRC32_TABLE = (() => {
      const t = new Uint32Array(256);
      for (let i = 0;i < 256; i++) {
        let c = i;
        for (let j = 0;j < 8; j++)
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        t[i] = c;
      }
      return t;
    })();
    function crc32(data) {
      let c = 4294967295;
      for (let i = 0;i < data.length; i++)
        c = CRC32_TABLE[(c ^ data[i]) & 255] ^ c >>> 8;
      return (c ^ 4294967295) >>> 0;
    }
    function makeChunk(type, data) {
      const buf = new Uint8Array(4 + 4 + data.length + 4);
      const v = new DataView(buf.buffer);
      v.setUint32(0, data.length, false);
      for (let i = 0;i < 4; i++)
        buf[4 + i] = type.charCodeAt(i);
      buf.set(data, 8);
      v.setUint32(8 + data.length, crc32(buf.subarray(4, 8 + data.length)), false);
      return buf;
    }
    const cs = new CompressionStream("deflate");
    const csWriter = cs.writable.getWriter();
    const idatChunks = [];
    const collectDone = (async () => {
      const reader = cs.readable.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        idatChunks.push(makeChunk("IDAT", value));
      }
    })();
    const origW = this.canvas.width, origH = this.canvas.height;
    const origRes = [...this.iResolution], origOffset = [...this.iTileOffset];
    this.pauseSketch();
    try {
      this.iResolution = [
        totalW * this.zoom,
        totalH * this.zoom
      ];
      const baseOffX = this.cx * totalH * this.zoom + totalW * (this.zoom - 1) / 2;
      const baseOffY = this.cy * totalH * this.zoom + totalH * (this.zoom - 1) / 2;
      for (let tileRow = 0;tileRow < rows; tileRow++) {
        const tileBuffers = [];
        for (let tileCol = 0;tileCol < cols; tileCol++) {
          const x0 = tileCol * tileSize, y0 = tileRow * tileSize;
          this.canvas.width = tileSize;
          this.canvas.height = tileSize;
          gl.viewport(0, 0, tileSize, tileSize);
          this.iTileOffset = [
            x0 + baseOffX,
            totalH - y0 - tileSize + baseOffY
          ];
          this.uniforms.forEach((e) => e.submit(e.loc));
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          const px = new Uint8Array(tileSize * tileSize * 4);
          gl.readPixels(0, 0, tileSize, tileSize, gl.RGBA, gl.UNSIGNED_BYTE, px);
          const flipped = new Uint8Array(tileSize * tileSize * 4);
          for (let y = 0;y < tileSize; y++) {
            const src = (tileSize - 1 - y) * tileSize * 4;
            flipped.set(px.subarray(src, src + tileSize * 4), y * tileSize * 4);
          }
          tileBuffers.push(flipped);
          await new Promise((r) => setTimeout(r, 0));
        }
        for (let py = 0;py < tileSize; py++) {
          const row = new Uint8Array(1 + totalW * 3);
          for (let tc = 0;tc < cols; tc++) {
            for (let px = 0;px < tileSize; px++) {
              const si = (py * tileSize + px) * 4;
              const di = 1 + (tc * tileSize + px) * 3;
              row[di] = tileBuffers[tc][si];
              row[di + 1] = tileBuffers[tc][si + 1];
              row[di + 2] = tileBuffers[tc][si + 2];
            }
          }
          await csWriter.write(row);
        }
      }
      await csWriter.close();
      await collectDone;
      const ihdr = new Uint8Array(13);
      const iv = new DataView(ihdr.buffer);
      iv.setUint32(0, totalW, false);
      iv.setUint32(4, totalH, false);
      ihdr[8] = 8;
      ihdr[9] = 2;
      const blob = new Blob([
        new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
        makeChunk("IHDR", ihdr),
        ...idatChunks,
        makeChunk("IEND", new Uint8Array(0))
      ], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `giga-${totalW}x${totalH}.png`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1e4);
    } finally {
      this.canvas.width = origW;
      this.canvas.height = origH;
      this.iResolution = origRes;
      this.iTileOffset = origOffset;
      gl.viewport(0, 0, origW, origH);
      this.renderOnce();
    }
  }
  captureResolution(width, height) {
    const gl = this.gl;
    const originalW = this.canvas.width;
    const originalH = this.canvas.height;
    const originalRes = [...this.iResolution];
    this.canvas.width = width;
    this.canvas.height = height;
    this.applyPanZoom();
    gl.viewport(0, 0, width, height);
    this.uniforms.forEach((e) => e.submit(e.loc));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `wallpaper-${width}x${height}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      this.canvas.width = originalW;
      this.canvas.height = originalH;
      this.iResolution = originalRes;
      gl.viewport(0, 0, originalW, originalH);
      this.render();
    }, "image/png");
  }
  initShader(fragmentSource) {
    const gl = this.gl;
    const vertexSource = `#version 300 es
            in vec2 position;

            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;
    const fragmentSourcePrefix = `#version 300 es
            precision highp float;

            uniform float   iTime;
            uniform vec2    iResolution;
            uniform vec4    iMouse;

            uniform vec4    iColorLighter;
            uniform vec4    iColorLight;
            uniform vec4    iColorGray;
            uniform vec4    iColorDark;
            uniform vec4    iColorDarker;

            uniform vec4    iColorPrimary;
            uniform vec4    iColorPrimaryDark;
            uniform vec4    iColorPrimaryLight;
            uniform vec4    iColorSecondary;
            uniform vec4    iColorTertiary;

            uniform int     iAA;

            uniform vec2    iTileOffset;
        `;
    const fragmentSourceSuffix = `

            out vec4 _lzon_frag_color;
            void main() {
                int _iAA = iAA;
                vec4 _color = vec4(0.0);
                for (int x = 0; x < _iAA; x++) {
                    for (int y = 0; y < _iAA; y++) {
                        vec2 _offset = (vec2(float(x), float(y)) + 0.5) / float(_iAA) - 0.5;
                        vec4 _sample;
                        mainImage(_sample, gl_FragCoord.xy + _offset + iTileOffset);
                        _color += _sample;
                    }
                }
                _lzon_frag_color = _color / float(_iAA * _iAA);
            }

        `;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSourcePrefix + fragmentSource + fragmentSourceSuffix);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const errorString = gl.getShaderInfoLog(fragmentShader);
      console.error("Fragment shader error:", errorString);
      this.setFailed(errorString);
      return;
    }
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    this.uniforms.push({ name: "iTime", submit: (loc) => {
      gl.uniform1f(loc, this.iTime);
    } });
    this.uniforms.push({ name: "iResolution", submit: (loc) => {
      gl.uniform2f(loc, ...this.iResolution);
    } });
    this.uniforms.push({ name: "iMouse", submit: (loc) => {
      gl.uniform4f(loc, ...this.iMouse);
    } });
    this.uniforms.push({ name: "iTileOffset", submit: (loc) => {
      gl.uniform2f(loc, ...this.iTileOffset);
    } });
    this.uniforms.push({ name: "iColorDarker", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorDarker);
    } });
    this.uniforms.push({ name: "iColorDark", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorDark);
    } });
    this.uniforms.push({ name: "iColorGray", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorGray);
    } });
    this.uniforms.push({ name: "iColorLight", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorLight);
    } });
    this.uniforms.push({ name: "iColorLighter", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorLighter);
    } });
    this.uniforms.push({ name: "iColorPrimary", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorPrimary);
    } });
    this.uniforms.push({ name: "iColorPrimaryDark", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorPrimaryDark);
    } });
    this.uniforms.push({ name: "iColorPrimaryLight", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorPrimaryLight);
    } });
    this.uniforms.push({ name: "iColorSecondary", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorSecondary);
    } });
    this.uniforms.push({ name: "iColorTertiary", submit: (loc) => {
      gl.uniform4f(loc, ...this.iColorTertiary);
    } });
    this.uniforms.push({ name: "iAA", submit: (loc) => {
      gl.uniform1i(loc, this.iAA);
    } });
    this.uniforms.forEach((e) => {
      e.loc = gl.getUniformLocation(this.program, e.name);
      console.log(`${e.name} : ${e.loc} `);
    });
    this.iColorLighter = parseCSSColorToFloat("--color-lighter");
    this.iColorLight = parseCSSColorToFloat("--color-light");
    this.iColorGray = parseCSSColorToFloat("--color-gray");
    this.iColorDark = parseCSSColorToFloat("--color-dark");
    this.iColorDarker = parseCSSColorToFloat("--color-darker");
    this.iColorPrimary = parseCSSColorToFloat("--color-primary");
    this.iColorSecondary = parseCSSColorToFloat("--color-secondary");
    this.iColorTertiary = parseCSSColorToFloat("--color-tertiary");
    this.iColorPrimaryDark = parseCSSColorToFloat("--color-primary-dark");
    this.iColorPrimaryLight = parseCSSColorToFloat("--color-primary-light");
    this.isPaused = false;
  }
  resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(this.canvas.clientWidth * this.scaleFactor * dpr);
    const height = Math.round(this.canvas.clientHeight * this.scaleFactor * dpr);
    this.canvas.width = width;
    this.canvas.height = height;
    this.applyPanZoom();
    this.gl.viewport(0, 0, width, height);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.elResolution.forEach((el) => el.innerText = `${width} x ${height}`);
    if (!this.isLooping)
      requestAnimationFrame(() => this.render());
  }
  renderOnce() {
    const gl = this.gl;
    this.lastNow = Date.now();
    this.uniforms.forEach((e) => e.submit(e.loc));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  render() {
    this.isLooping = true;
    const gl = this.gl;
    const now = Date.now();
    if (this.fpsInterval > 0) {
      const elapsed = now - this.lastRenderTime;
      if (elapsed < this.fpsInterval) {
        if (this.isPaused) {
          this.isLooping = false;
          return;
        }
        setTimeout(() => requestAnimationFrame(() => this.render()), this.fpsInterval - elapsed);
        return;
      }
      this.lastRenderTime = now - elapsed % this.fpsInterval;
    }
    const deltaTime = now - this.lastFrameTime;
    if (!this.isPaused) {
      const newTime = (now - this.lastNow) / 1000;
      this.iTime += newTime * this.iTimeScale;
      if (this.maxTime < this.iTime)
        this.maxTime = this.iTime;
      const maxVal = Math.ceil(this.maxTime * 100) / 100;
      this.elTimeRange.forEach((el) => {
        el.max = String(maxVal);
        el.value = String(maxVal);
      });
    }
    this.lastNow = now;
    this.renderOnce();
    const totalTimeClamp = Math.min(999, this.iTime);
    const maxTimeClamp = Math.min(999, this.maxTime);
    this.elTotaltime.forEach((el) => el.innerText = this.formatTime(totalTimeClamp));
    this.elMaxtime.forEach((el) => el.innerText = this.formatTime(maxTimeClamp));
    this.elTimeRangeLabel.forEach((el) => el.innerText = `${this.formatTime(totalTimeClamp)} - ${this.formatTime(maxTimeClamp)}`);
    if (this.isPaused) {
      this.isLooping = false;
      return;
    }
    requestAnimationFrame(() => this.render());
    this.frameCount++;
    if (deltaTime >= 1000) {
      this.fps = this.frameCount / deltaTime * 1000;
      this.frameCount = 0;
      this.lastFrameTime = now;
      this.elFramerate.forEach((el) => el.innerText = `${this.fps.toFixed(1)} fps`);
    }
  }
  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toFixed(1).padStart(4, "0");
    return `${m}:${s}`;
  }
}
function initShadertoy() {
  const shaderCode = RAW_GLSL_CODE;
  console.log("shader code: " + shaderCode);
  if (!RAd_GLSL_CODE) {
    console.error("raw glsl code is undefined");
    return;
  }
  const container = document.getElementById("sketch");
  const canvas = container.querySelector("canvas");
  const sketch = new ShaderSketch(container, canvas, shaderCode);
  const codeWrapper = document.querySelector("#glslCodeWrapper");
  codeWrapper.innerHTML = HTML_GLSL_CODE + codeWrapper.innerHTML;
  codeWrapper.setAttribute("data-raw-code", RAW_GLSL_CODE);
  initCodeWrapper(codeWrapper);
  window.sketch = sketch;
}
initShadertoy();
