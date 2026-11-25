/**
 * MODELLER — "Model Kur" etkinliklerinin vektör çizimleri (fen kitabındaki modellerin sade, özgün hâlleri).
 * Her model: 400×300 görünüm kutusunda bir çizim + etiket yuvaları (x, y; yuvanın göstereceği nokta).
 * Yeni model eklemek: MODELLER'e { ciz, yuvalar } ekle; içerikte sahne: '<kimlik>' olarak kullan.
 */
import type { ReactNode } from 'react'

export interface ModelTanim {
  ad: string
  ciz: () => ReactNode
  /** yuva kimliği → işaret noktası (çizim koordinatı) ve etiketin duracağı yer */
  yuvalar: Record<string, { x: number; y: number; lx: number; ly: number }>
}

const INK = '#3a2a5e'

/* ---------------------------------------------------------------- bitkinin kısımları */
const Bitki = () => (
  <g>
    <rect x="60" y="232" width="280" height="68" rx="8" fill="#a0673a" />
    <rect x="60" y="226" width="280" height="12" rx="6" fill="#7cc15a" />
    {/* kökler */}
    <g stroke="#e9d2a6" strokeWidth="4" strokeLinecap="round" fill="none">
      <path d="M200 236 C 196 256, 180 266, 168 286" />
      <path d="M200 236 C 204 258, 222 268, 236 288" />
      <path d="M200 240 L 200 290" />
      <path d="M190 256 C 182 262, 172 262, 164 266" />
    </g>
    {/* gövde */}
    <path d="M200 232 C 198 190, 204 150, 200 96" stroke="#3f9a35" strokeWidth="9" fill="none" strokeLinecap="round" />
    {/* yapraklar */}
    <path d="M202 176 C 236 150, 272 158, 284 170 C 262 188, 226 190, 202 176 Z" fill="#5bc236" stroke="#3a8f1d" strokeWidth="2" />
    <path d="M198 150 C 166 124, 128 130, 116 142 C 140 162, 176 164, 198 150 Z" fill="#5bc236" stroke="#3a8f1d" strokeWidth="2" />
    {/* çiçek */}
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <ellipse key={a} cx={200 + 22 * Math.cos((a * Math.PI) / 180)} cy={72 + 22 * Math.sin((a * Math.PI) / 180)} rx="16" ry="11" transform={`rotate(${a} ${200 + 22 * Math.cos((a * Math.PI) / 180)} ${72 + 22 * Math.sin((a * Math.PI) / 180)})`} fill="#ff7aa8" stroke="#d84c7e" strokeWidth="2" />
    ))}
    <circle cx="200" cy="72" r="13" fill="#ffd23f" stroke="#e8a40c" strokeWidth="2" />
  </g>
)

/* ---------------------------------------------------------------- duyu organları */
const Yuz = () => (
  <g>
    <circle cx="200" cy="150" r="98" fill="#ffd9b8" stroke="#e0a77a" strokeWidth="3" />
    <path d="M110 120 C 120 50, 280 50, 290 120 C 270 84, 130 84, 110 120 Z" fill="#6b3f1f" />
    {/* kulaklar */}
    <ellipse cx="100" cy="155" rx="16" ry="26" fill="#ffcfa6" stroke="#e0a77a" strokeWidth="3" />
    <ellipse cx="300" cy="155" rx="16" ry="26" fill="#ffcfa6" stroke="#e0a77a" strokeWidth="3" />
    {/* gözler */}
    {[165, 235].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy="140" rx="17" ry="13" fill="#fff" stroke={INK} strokeWidth="2" />
        <circle cx={x} cy="141" r="7" fill="#4a7fd4" />
        <circle cx={x} cy="141" r="3" fill={INK} />
      </g>
    ))}
    {/* burun */}
    <path d="M200 150 C 192 172, 192 180, 204 182" stroke="#d08a5c" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* ağız ve dil */}
    <path d="M168 200 C 184 226, 216 226, 232 200 Z" fill="#a8323c" />
    <ellipse cx="200" cy="214" rx="14" ry="8" fill="#ff8aa0" />
    {/* el (deri) */}
    <g transform="translate(318 220)">
      <rect x="0" y="10" width="44" height="50" rx="16" fill="#ffd9b8" stroke="#e0a77a" strokeWidth="3" />
      {[4, 14, 24, 34].map((x) => (
        <rect key={x} x={x} y="-12" width="9" height="30" rx="4.5" fill="#ffd9b8" stroke="#e0a77a" strokeWidth="2" />
      ))}
    </g>
  </g>
)

/* ---------------------------------------------------------------- basit elektrik devresi */
const Devre = () => (
  <g>
    <path d="M80 220 L 80 90 L 200 90" stroke="#e8463c" strokeWidth="7" fill="none" strokeLinejoin="round" />
    <path d="M200 90 L 320 90 L 320 220" stroke="#e8463c" strokeWidth="7" fill="none" strokeLinejoin="round" />
    <path d="M80 220 L 150 220" stroke="#2a7fd4" strokeWidth="7" fill="none" />
    <path d="M250 220 L 320 220" stroke="#2a7fd4" strokeWidth="7" fill="none" />
    {/* pil */}
    <g transform="translate(150 200)">
      <rect x="0" y="0" width="100" height="40" rx="8" fill="#3a3a3a" />
      <rect x="0" y="0" width="34" height="40" rx="8" fill="#e8a40c" />
      <rect x="100" y="12" width="8" height="16" rx="3" fill="#9a9a9a" />
      <text x="70" y="27" fontSize="18" fill="#fff" fontWeight="900">+</text>
      <text x="12" y="27" fontSize="18" fill="#3a2a00" fontWeight="900">−</text>
    </g>
    {/* ampul */}
    <g transform="translate(200 58)">
      <circle cx="0" cy="0" r="28" fill="#fff6b0" stroke="#e8a40c" strokeWidth="3" />
      <path d="M-8 6 L -4 -8 L 0 4 L 4 -8 L 8 6" stroke="#e8a40c" strokeWidth="2.5" fill="none" />
      <rect x="-14" y="26" width="28" height="16" rx="3" fill="#9a9a9a" />
    </g>
    {/* anahtar */}
    <g transform="translate(320 150)">
      <circle cx="0" cy="-26" r="6" fill="#555" />
      <circle cx="0" cy="26" r="6" fill="#555" />
      <rect x="-3" y="-26" width="6" height="50" rx="3" fill="#777" transform="rotate(-25 0 -26)" />
    </g>
  </g>
)

/* ================================================================ 3. SINIF FEN KİTABININ MODELLERİ */
const Ikon = ({ ad, x, y, s = 56 }: { ad: string; x: number; y: number; s?: number }) => <image href={`/assets/objects/${ad}.png`} x={x - s / 2} y={y - s / 2} width={s} height={s} />

/* Güneş, Dünya, Ay — büyüklük karşılaştırması (oyun hamuru modeli gibi) */
const Gok = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" rx="20" fill="#1d1b4a" />
    {Array.from({ length: 26 }, (_, i) => (
      <circle key={i} cx={(i * 67) % 390 + 5} cy={(i * 41) % 290 + 5} r={i % 3 ? 1.2 : 2} fill="#fff" opacity="0.8" />
    ))}
    <circle cx="110" cy="150" r="88" fill="#ffc83d" />
    <circle cx="110" cy="150" r="88" fill="none" stroke="#ff9a2e" strokeWidth="6" opacity="0.7" />
    <circle cx="265" cy="160" r="34" fill="#2a7fd4" />
    <path d="M250 145 C 262 138, 275 148, 268 160 C 260 170, 245 162, 250 145 Z" fill="#5bc236" />
    <circle cx="345" cy="165" r="12" fill="#d9d9e8" />
    <circle cx="341" cy="162" r="2.5" fill="#b0b0c8" />
  </g>
)

/* Kelebeğin vücut bölümleri */
const Kelebek = () => (
  <g>
    <rect x="0" y="230" width="400" height="70" fill="#bfe8a0" />
    <ellipse cx="200" cy="150" rx="9" ry="58" fill="#4a3a2a" />
    <circle cx="200" cy="86" r="13" fill="#4a3a2a" />
    {/* antenler */}
    <path d="M195 76 C 180 50, 168 40, 160 34" stroke="#4a3a2a" strokeWidth="3" fill="none" />
    <path d="M205 76 C 220 50, 232 40, 240 34" stroke="#4a3a2a" strokeWidth="3" fill="none" />
    <circle cx="160" cy="34" r="5" fill="#4a3a2a" />
    <circle cx="240" cy="34" r="5" fill="#4a3a2a" />
    {/* kanatlar */}
    <path d="M192 110 C 140 50, 60 70, 80 140 C 90 170, 150 160, 192 140 Z" fill="#ff9a2e" stroke="#c86a0c" strokeWidth="3" />
    <path d="M208 110 C 260 50, 340 70, 320 140 C 310 170, 250 160, 208 140 Z" fill="#ff9a2e" stroke="#c86a0c" strokeWidth="3" />
    <path d="M192 150 C 150 160, 110 200, 140 225 C 165 240, 190 200, 194 168 Z" fill="#ffd23f" stroke="#c86a0c" strokeWidth="3" />
    <path d="M208 150 C 250 160, 290 200, 260 225 C 235 240, 210 200, 206 168 Z" fill="#ffd23f" stroke="#c86a0c" strokeWidth="3" />
    <circle cx="120" cy="110" r="10" fill="#fff" opacity="0.8" />
    <circle cx="280" cy="110" r="10" fill="#fff" opacity="0.8" />
    {/* hortum */}
    <path d="M200 98 C 200 112, 214 112, 214 104 C 214 98, 207 98, 207 103" stroke="#3a2a5e" strokeWidth="2.5" fill="none" />
    {/* bacaklar */}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <path d={`M196 ${130 + i * 16} L 176 ${144 + i * 16} L 170 ${160 + i * 16}`} stroke="#4a3a2a" strokeWidth="2.5" fill="none" />
        <path d={`M204 ${130 + i * 16} L 224 ${144 + i * 16} L 230 ${160 + i * 16}`} stroke="#4a3a2a" strokeWidth="2.5" fill="none" />
      </g>
    ))}
  </g>
)

/* Fosil kesiti */
const Fosil = () => (
  <g>
    <rect x="0" y="0" width="400" height="70" fill="#bfe6ff" />
    <rect x="0" y="62" width="400" height="16" fill="#7cc15a" />
    <rect x="0" y="78" width="400" height="60" fill="#c99a6b" />
    <rect x="0" y="138" width="400" height="60" fill="#b07d50" />
    <rect x="0" y="198" width="400" height="102" fill="#8a5c36" />
    <path d="M0 138 L 400 138 M0 198 L 400 198" stroke="#6b4425" strokeWidth="2" strokeDasharray="10 6" />
    {/* fosil: sarmal kabuk + balık iskeleti */}
    <g transform="translate(150 250)">
      <path d="M0 0 C 0 -18, 26 -18, 26 0 C 26 14, 6 14, 6 2 C 6 -6, 18 -6, 18 0" stroke="#f3e2c4" strokeWidth="4" fill="none" />
    </g>
    <g transform="translate(270 245)" stroke="#f3e2c4" strokeWidth="3" fill="none">
      <path d="M-30 0 L 30 0" />
      {[-20, -10, 0, 10, 20].map((x) => (
        <path key={x} d={`M${x} -10 L ${x} 10`} />
      ))}
      <path d="M30 0 L 44 -10 L 44 10 Z" />
    </g>
    <Ikon ad="detective" x={60} y={40} s={60} />
  </g>
)

/* Katı, sıvı, gaz — kaba göre biçim (tanecik modeli DEĞİL; program yasaklar) */
const Kaplar = () => (
  <g>
    {[40, 160, 280].map((x) => (
      <path key={x} d={`M${x} 90 L ${x + 80} 90 L ${x + 74} 230 L ${x + 6} 230 Z`} fill="#eef7ff" stroke="#9fb6d9" strokeWidth="3" />
    ))}
    {/* katı: biçimi değişmeyen tahta küp */}
    <rect x="58" y="178" width="44" height="44" rx="4" fill="#c99a6b" stroke="#8a5c36" strokeWidth="3" />
    {/* sıvı: kabın biçimini alır */}
    <path d="M166 170 L 234 170 L 230 228 L 170 228 Z" fill="#5aa8ff" opacity="0.85" />
    {/* gaz: kapalı kabı tamamen doldurur */}
    <rect x="276" y="80" width="88" height="12" rx="4" fill="#9fb6d9" />
    <path d="M283 94 L 357 94 L 352 228 L 288 228 Z" fill="#c8b4ff" opacity="0.55" />
    {[[300, 120], [335, 140], [310, 175], [340, 200], [298, 210], [325, 108]].map(([a, b], i) => (
      <path key={i} d={`M${a - 8} ${b} q 8 -8 16 0`} stroke="#9b6ef3" strokeWidth="2.5" fill="none" />
    ))}
  </g>
)

/* İtme ve çekme kuvveti */
const Kuvvet = () => (
  <g>
    <rect x="0" y="230" width="400" height="70" fill="#d9c7a3" />
    {/* itme: oyuncak araba */}
    <Ikon ad="boy" x={70} y={190} s={80} />
    <rect x="110" y="175" width="70" height="40" rx="8" fill="#ff6b6b" />
    <circle cx="125" cy="222" r="9" fill="#333" />
    <circle cx="165" cy="222" r="9" fill="#333" />
    <path d="M115 150 L 175 150" stroke="#22a845" strokeWidth="6" markerEnd="url(#ok)" />
    {/* çekme: kızak ipi */}
    <Ikon ad="girl" x={340} y={190} s={80} />
    <rect x="220" y="195" width="70" height="22" rx="6" fill="#5aa8ff" />
    <path d="M290 205 L 318 190" stroke="#8a5c36" strokeWidth="3" />
    <path d="M285 150 L 225 150" stroke="#e8463c" strokeWidth="6" markerEnd="url(#ok)" transform="rotate(180 255 150)" />
    <defs>
      <marker id="ok" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
        <path d="M0 0 L 4 2 L 0 4 Z" fill="#3a2a5e" />
      </marker>
    </defs>
  </g>
)

/* Toprak kavanozu — toprağın içindekiler */
const Toprak = () => (
  <g>
    <rect x="110" y="40" width="180" height="22" rx="6" fill="#9fb6d9" />
    <rect x="104" y="60" width="192" height="220" rx="18" fill="#eef7ff" stroke="#9fb6d9" strokeWidth="4" />
    <rect x="112" y="100" width="176" height="40" fill="#5b3a22" />
    <rect x="112" y="140" width="176" height="50" fill="#8a5c36" />
    <rect x="112" y="190" width="176" height="45" fill="#e2c38a" />
    <rect x="112" y="235" width="176" height="38" rx="10" fill="#a8a8a8" />
    {[130, 165, 200, 240, 270].map((x, i) => (
      <circle key={x} cx={x} cy={252 + (i % 2) * 8} r={7 + (i % 3) * 2} fill="#7d7d7d" />
    ))}
    {/* canlı kalıntısı: yaprak parçası, solucan */}
    <path d="M135 112 C 150 102, 165 108, 160 122 C 150 128, 138 124, 135 112 Z" fill="#6b8f2a" />
    <path d="M220 160 c 10 -8, 20 8, 30 0 s 16 6, 22 0" stroke="#ff9aa8" strokeWidth="6" fill="none" strokeLinecap="round" />
    {/* hava ve su: kabarcık ve damlacık */}
    <circle cx="250" cy="118" r="6" fill="#bfe6ff" stroke="#fff" strokeWidth="1.5" />
    <circle cx="265" cy="128" r="4" fill="#bfe6ff" stroke="#fff" strokeWidth="1.5" />
  </g>
)

/* Bitkinin büyümesi için gerekenler */
const Saksi = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" rx="20" fill="#eaf7ff" />
    <Ikon ad="sun" x={70} y={60} s={80} />
    <Ikon ad="droplet" x={330} y={70} s={60} />
    <Ikon ad="thermometer" x={330} y={200} s={70} />
    <path d="M165 210 L 235 210 L 225 270 L 175 270 Z" fill="#d9772e" stroke="#9c4d14" strokeWidth="3" />
    <path d="M200 210 C 198 180, 202 150, 200 120" stroke="#3f9a35" strokeWidth="7" fill="none" />
    <path d="M200 170 C 230 150, 255 160, 262 168 C 245 182, 220 182, 200 170 Z" fill="#5bc236" />
    <path d="M200 145 C 170 125, 145 132, 138 140 C 155 156, 180 156, 200 145 Z" fill="#5bc236" />
    <path d="M110 80 L 165 130" stroke="#ffc83d" strokeWidth="4" strokeDasharray="6 5" />
  </g>
)

/* Yaşam alanları dioraması */
const Yasam = () => (
  <g>
    <rect x="0" y="0" width="200" height="150" fill="#cdeec0" />
    <rect x="200" y="0" width="200" height="150" fill="#9fd6ff" />
    <rect x="0" y="150" width="200" height="150" fill="#bfe6ff" />
    <rect x="200" y="150" width="200" height="150" fill="#f6dfa0" />
    <path d="M0 150 L 400 150 M200 0 L 200 300" stroke="#fff" strokeWidth="6" />
    <Ikon ad="evergreen" x={60} y={80} s={70} />
    <Ikon ad="owl" x={140} y={90} s={52} />
    <Ikon ad="wave" x={270} y={70} s={60} />
    <Ikon ad="fish" x={340} y={100} s={44} />
    <Ikon ad="frog" x={70} y={230} s={48} />
    <Ikon ad="duck" x={140} y={220} s={50} />
    <Ikon ad="cactus" x={270} y={230} s={60} />
    <Ikon ad="lizard" x={345} y={240} s={44} />
  </g>
)

export const MODELLER: Record<string, ModelTanim> = {
  // --- 3. sınıf fen kitabındaki modeller
  duyu: {
    ad: 'Duyu organları',
    ciz: Yuz,
    yuvalar: {
      goz: { x: 165, y: 140, lx: 60, ly: 70 },
      kulak: { x: 300, y: 155, lx: 345, ly: 95 },
      burun: { x: 198, y: 172, lx: 60, ly: 205 },
      dil: { x: 200, y: 214, lx: 200, ly: 286 },
      deri: { x: 340, y: 240, lx: 345, ly: 196 },
    },
  },
  gok: {
    ad: 'Güneş, Dünya ve Ay',
    ciz: Gok,
    yuvalar: {
      gunes: { x: 110, y: 150, lx: 110, ly: 268 },
      dunya: { x: 265, y: 160, lx: 255, ly: 268 },
      ay: { x: 345, y: 165, lx: 355, ly: 228 },
    },
  },
  kelebek: {
    ad: 'Kelebeğin bölümleri',
    ciz: Kelebek,
    yuvalar: {
      anten: { x: 162, y: 38, lx: 70, ly: 30 },
      kanat: { x: 290, y: 110, lx: 345, ly: 40 },
      hortum: { x: 212, y: 104, lx: 330, ly: 205 },
      bacak: { x: 172, y: 176, lx: 70, ly: 220 },
    },
  },
  fosil: {
    ad: 'Fosil ve toprak katmanları',
    ciz: Fosil,
    yuvalar: {
      paleontolog: { x: 60, y: 40, lx: 170, ly: 32 },
      katman: { x: 200, y: 168, lx: 330, ly: 108 },
      fosil: { x: 270, y: 245, lx: 330, ly: 280 },
    },
  },
  kaplar: {
    ad: 'Katı, sıvı, gaz',
    ciz: Kaplar,
    yuvalar: {
      kati: { x: 80, y: 200, lx: 80, ly: 268 },
      sivi: { x: 200, y: 200, lx: 200, ly: 268 },
      gaz: { x: 320, y: 150, lx: 320, ly: 268 },
    },
  },
  kuvvet: {
    ad: 'İtme ve çekme',
    ciz: Kuvvet,
    yuvalar: {
      itme: { x: 145, y: 150, lx: 110, ly: 60 },
      cekme: { x: 255, y: 150, lx: 290, ly: 60 },
    },
  },
  toprak: {
    ad: 'Toprağın içindekiler',
    ciz: Toprak,
    yuvalar: {
      kalinti: { x: 148, y: 115, lx: 50, ly: 90 },
      solucan: { x: 240, y: 160, lx: 350, ly: 150 },
      kil: { x: 160, y: 165, lx: 50, ly: 170 },
      kum: { x: 200, y: 212, lx: 350, ly: 212 },
      tas: { x: 165, y: 254, lx: 50, ly: 262 },
      hava: { x: 255, y: 122, lx: 350, ly: 90 },
    },
  },
  saksi: {
    ad: 'Bitkinin ihtiyaçları',
    ciz: Saksi,
    yuvalar: {
      isik: { x: 70, y: 60, lx: 70, ly: 125 },
      su: { x: 330, y: 70, lx: 330, ly: 125 },
      sicaklik: { x: 330, y: 200, lx: 330, ly: 270 },
    },
  },
  yasam: {
    ad: 'Yaşam alanları',
    ciz: Yasam,
    yuvalar: {
      orman: { x: 60, y: 80, lx: 100, ly: 128 },
      deniz: { x: 270, y: 70, lx: 300, ly: 128 },
      gol: { x: 105, y: 225, lx: 100, ly: 278 },
      col: { x: 300, y: 235, lx: 300, ly: 278 },
    },
  },
  // --- 4. sınıf için hazır (3. sınıf kitabında yok)
  bitki: {
    ad: 'Bitkinin kısımları',
    ciz: Bitki,
    yuvalar: {
      cicek: { x: 200, y: 72, lx: 320, ly: 50 },
      yaprak: { x: 262, y: 168, lx: 335, ly: 150 },
      govde: { x: 201, y: 205, lx: 75, ly: 200 },
      kok: { x: 196, y: 268, lx: 75, ly: 276 },
    },
  },
  devre: {
    ad: 'Basit elektrik devresi',
    ciz: Devre,
    yuvalar: {
      ampul: { x: 200, y: 58, lx: 200, ly: 16 },
      pil: { x: 200, y: 220, lx: 200, ly: 276 },
      anahtar: { x: 320, y: 150, lx: 362, ly: 112 },
      kablo: { x: 80, y: 150, lx: 38, ly: 112 },
    },
  },
}
