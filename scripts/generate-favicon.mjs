import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
/**
 * Rasterize the Eve Directory favicon mark into app/favicon.ico
 * (16 + 32 PNG frames). No native deps — pure zlib PNG + ICO pack.
 *
 * Mark: warm primary tile + Eve "E" bars (logo.tsx proportions).
 */
import { deflateSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "app", "favicon.ico");

/** @type {[number, number, number, number]} */
const TILE = [0x2a, 0x28, 0x25, 0xff];
/** @type {[number, number, number, number]} */
const BAR = [0xfa, 0xf9, 0xf7, 0xff];

/**
 * @param {number} size
 * @returns {Buffer}
 */
function renderPng(size) {
  const scale = size / 32;
  const rx = 8 * scale;
  const bars = [
    { x: 7 * scale, y: 8 * scale, w: 18 * scale, h: 3.2 * scale },
    { x: 7 * scale, y: 14.4 * scale, w: 9.2 * scale, h: 3.2 * scale },
    { x: 7 * scale, y: 20.8 * scale, w: 10.9 * scale, h: 3.2 * scale },
  ];

  const pixels = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const inside = inRoundedRect(x + 0.5, y + 0.5, size, size, rx);
      const onBar =
        inside &&
        bars.some(
          (b) =>
            x + 0.5 >= b.x &&
            x + 0.5 < b.x + b.w &&
            y + 0.5 >= b.y &&
            y + 0.5 < b.y + b.h
        );
      const c = onBar ? BAR : inside ? TILE : [0, 0, 0, 0];
      pixels[i] = c[0];
      pixels[i + 1] = c[1];
      pixels[i + 2] = c[2];
      pixels[i + 3] = c[3];
    }
  }

  return encodePng(pixels, size, size);
}

/**
 * @param {number} px
 * @param {number} py
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
function inRoundedRect(px, py, w, h, r) {
  if (px < 0 || py < 0 || px >= w || py >= h) return false;
  const rr = Math.min(r, w / 2, h / 2);
  const x = Math.min(px, w - px);
  const y = Math.min(py, h - py);
  if (x >= rr || y >= rr) return true;
  const dx = rr - x;
  const dy = rr - y;
  return dx * dx + dy * dy <= rr * rr;
}

/**
 * @param {Buffer} rgba
 * @param {number} width
 * @param {number} height
 */
function encodePng(rgba, width, height) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = deflateSync(raw);

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * @param {string} type
 * @param {Buffer} data
 */
function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

/** @param {Buffer} buf */
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * @param {Buffer[]} pngs
 * @param {number[]} sizes
 */
function packIco(pngs, sizes) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // ICO
  header.writeUInt16LE(count, 4);

  const dirSize = 16 * count;
  let offset = 6 + dirSize;
  const dirs = [];
  const bodies = [];

  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const png = pngs[i];
    const dir = Buffer.alloc(16);
    dir[0] = size >= 256 ? 0 : size;
    dir[1] = size >= 256 ? 0 : size;
    dir[2] = 0;
    dir[3] = 0;
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(png.length, 8);
    dir.writeUInt32LE(offset, 12);
    dirs.push(dir);
    bodies.push(png);
    offset += png.length;
  }

  return Buffer.concat([header, ...dirs, ...bodies]);
}

const sizes = [16, 32];
const pngs = sizes.map((s) => renderPng(s));
writeFileSync(OUT, packIco(pngs, sizes));
console.log(`Wrote ${OUT} (${sizes.join(" + ")} PNG frames)`);
