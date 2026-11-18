/**
 * Görsel üretim tarifleri (raster-art-pipeline skill).
 * Her tarif aynı STİL başlığını kullanır; referans görseller stil örneği olarak eklenir.
 * 'raw:' referansları: daha önce üretilip onaylanmış karakter → aynı karakterin tutarlı pozları.
 * Görsellere YAZI konmaz (yazılar arayüzde kodla çizilir → Türkçe karakterler hatasız).
 */

export const STYLE = `Premium 3D cartoon render for a children's educational game, matching the art style of the attached reference images:
warm Pixar-like animated-film look, soft global illumination, gentle subsurface scattering, glossy expressive eyes, soft rim light from the top-right,
vibrant but soft saturated colors (turquoise, sky blue, lush green, sunny yellow, orange, purple), rounded friendly shapes, high detail, clean edges.
Original design — do not copy any existing franchise character. Absolutely no text, letters, numbers, logos, watermarks or UI elements in the image.`

const FINDIK = `The mascot "Fındık": an original cute fox explorer, chibi proportions (large head, small body), orange fur with cream-white muzzle, chest and tail tip,
big glossy dark-brown eyes with two white highlights, small black nose, pink cheeks, brass aviator goggles with turquoise lenses resting on the forehead,
a turquoise scarf, a small brown leather backpack with straps, brown boots, a big fluffy tail.`

const KASIF = `A cheerful original child explorer, about 7 years old, chibi proportions, warm light-tan skin, big glossy brown eyes, messy wavy brown hair,
brass explorer goggles with turquoise lenses on the head, mustard-orange jacket over a white t-shirt, brown backpack straps, rolled-up blue trousers, brown boots.`

const CHAR_TAIL = `Full body, centered, entire character visible with a small margin, facing the viewer at a slight three-quarter angle,
isolated on a fully transparent background, no ground, no shadow on the floor, no other objects.`

const BG_TAIL = `Wide landscape game background, rich depth (hazy far layer, detailed midground, darker framing foliage in the corners with soft depth of field),
warm sunbeams from the top-right, floating light bokeh. Keep the central area calm and uncluttered so game UI can be placed on top.
No characters, no animals in the foreground, no text, no signs with writing, no UI.`

const SAME_FOX = 'Keep EXACTLY the same character as the attached fox image (same face, fur colors, goggles, scarf, backpack, boots, proportions).'
const SAME_KID = 'Keep EXACTLY the same child as the attached image (same face, hair, goggles, clothes, proportions).'
const SAME_STYLE_KID = 'Same art style, rendering and proportions as the attached child, but a different original child:'
const SAME_ROBO = 'Keep EXACTLY the same robot as the attached image (same shape, colors, visor, antenna).'

const fox = (id, pose, desc) => ({ id, type: 'character', char: 'findik', pose, refs: ['raw:findik-wave.png'], prompt: `${SAME_FOX} ${FINDIK} Pose: ${desc} ${CHAR_TAIL}` })
const kid = (id, pose, desc) => ({ id, type: 'character', char: 'kasif', pose, refs: ['raw:kasif-wave.png'], prompt: `${SAME_KID} ${KASIF} Pose: ${desc} ${CHAR_TAIL}` })
const gradeKid = (n, desc) => ({ id: `sinif${n}`, type: 'character', char: `sinif${n}`, pose: 'idle', refs: ['raw:kasif-wave.png'], prompt: `${SAME_STYLE_KID} ${desc} ${CHAR_TAIL}` })
const robo = (id, pose, desc) => ({ id, type: 'character', char: 'robo', pose, refs: ['raw:robo-idle.png'], prompt: `${SAME_ROBO} Pose: ${desc} ${CHAR_TAIL}` })
const bg = (id, key, ref, desc) => ({ id, type: 'background', bg: key, refs: [ref], prompt: `${desc} ${BG_TAIL}` })

export const JOBS = [
  // ---------------- FINDIK ----------------
  { id: 'findik-wave', type: 'character', char: 'findik', pose: 'wave', refs: ['menta-referans-3.png'], prompt: `${FINDIK} Pose: happily waving with the right paw raised, big open smile. ${CHAR_TAIL}` },
  fox('findik-idle', 'idle', 'standing relaxed, friendly closed-mouth smile, paws at the sides.'),
  fox('findik-cheer', 'cheer', 'jumping with joy, both arms raised high, eyes happily closed, wide open laughing mouth.'),
  fox('findik-think', 'think', 'thinking, one paw touching the chin, eyes looking up, small curious mouth.'),
  fox('findik-surprised', 'surprised', 'surprised, ears up, eyes wide, small round open mouth, paws slightly raised.'),
  fox('findik-sad', 'sad', 'gently sad but encouraging, ears drooping, small soft frown, tail down.'),
  fox('findik-clap', 'clap', 'clapping paws in front of the chest, big happy smile.'),

  // ---------------- ÇOCUK KAŞİF ----------------
  { id: 'kasif-wave', type: 'character', char: 'kasif', pose: 'wave', refs: ['minik-kasifler-referans.png'], prompt: `${KASIF} Pose: waving with one hand, presenting with the other hand, big open smile. ${CHAR_TAIL}` },
  kid('kasif-think', 'think', 'thinking with one finger on the chin, looking up curiously.'),
  kid('kasif-cheer', 'cheer', 'celebrating with one fist raised, eyes closed with joy, big smile.'),

  // ---------------- SINIF KARAKTERLERİ ----------------
  gradeKid(1, 'a 6-year-old boy with short dark-brown hair, a green baseball cap, green t-shirt and small backpack, holding a pencil, big happy smile. Pose: standing, cheerful slight wave.'),
  gradeKid(2, 'a 7-year-old girl with light-brown hair in a ponytail and a pink flower clip, pink hoodie, holding a red storybook, big happy smile. Pose: standing, cheerful.'),
  gradeKid(3, 'an 8-year-old boy with dark curly hair, brass explorer goggles on the head, orange explorer vest and backpack, confident smile. Pose: standing, thumbs up.'),
  gradeKid(4, 'a 9-year-old girl with dark-brown hair in two braids, round purple glasses, purple cardigan, holding a book, warm smart smile. Pose: standing, cheerful.'),

  // ---------------- ROBOT (matematik asistanı) ----------------
  { id: 'robo-idle', type: 'character', char: 'robo', pose: 'idle', refs: ['menta-referans-2.png'], prompt: `An original cute friendly helper robot for a math game: round glossy white body and helmet-like head, dark visor face showing two big glowing cyan smiling eyes, a small turquoise antenna with a glowing tip, short arms, turquoise accents, a plain round turquoise badge on the chest, hovering slightly. Pose: friendly wave. ${CHAR_TAIL}` },
  robo('robo-cheer', 'cheer', 'celebrating, both arms up, visor eyes shaped like happy arcs, small sparkles around.'),
  robo('robo-think', 'think', 'thinking, one hand at the chin, visor eyes looking up.'),

  // ---------------- ANA DÜNYA ----------------
  {
    id: 'bg-world', type: 'background', bg: 'world', refs: ['menta-referans-3.png', 'minik-kasifler-referans.png'],
    prompt: 'Main hub world of a childrens educational game, seen from a high three-quarter isometric angle: a lush floating island archipelago in a bright sky with soft clouds below. Exactly five distinct, clearly separated buildings, each on its own area with open space around it: ' +
      '(1) LEFT-CENTER: a cozy cottage whose roof is a giant open book (reading and language house), red and cream colors; ' +
      '(2) TOP-CENTER: a purple house decorated with colorful toy cubes and simple plus and minus shapes (math house); ' +
      '(3) RIGHT-CENTER: a white science observatory with a glass dome, a big telescope and a glowing purple flask (science lab); ' +
      '(4) BOTTOM-LEFT on a smaller island connected by a wooden bridge: a friendly blue-roofed family house with a small garden and a traffic light (life skills house); ' +
      '(5) BOTTOM-RIGHT on a smaller island connected by a wooden bridge: a small sandstone castle with towers and a glowing golden ring (history castle). ' +
      'In the middle: a round stone plaza with a glowing blue crystal fountain. Waterfalls pouring off the island edges, a winding river, stone paths, flowers, mushrooms, round trees, hot air balloons in the sky. Keep the top-left and bottom-left corners relatively calm for UI. No characters, no text, no signs with writing.',
  },

  // ---------------- ARKA PLANLAR ----------------
  bg('bg-forest', 'forest', 'minik-kasifler-referans.png', 'Enchanted storybook forest clearing for a reading and language game: a giant old tree on the right with bookshelves full of colorful books built into its trunk, hanging warm lanterns, a few floating colorful toy blocks high in the air (blank faces), red-capped mushrooms, flowers, a winding brick path into the distance.'),
  bg('bg-park', 'park', 'menta-referans-2.png', 'Sunny math adventure park: green rolling hills, a colorful ferris wheel in the distance, giant colorful geometric toy shapes (cube, cone, sphere, pyramid) on the meadow, balloons in the sky, distant mountains.'),
  bg('bg-meadow', 'meadow', 'minik-kasifler-referans.png', 'Magical forest meadow game stage: soft grass clearing in the center, tall lush trees framing the sides, glowing fireflies, colorful flowers and mushrooms, gentle light rays.'),
  bg('bg-orchard', 'orchard', 'menta-referans-2.png', 'Apple orchard on a sunny hill: apple trees full of shiny red apples on both sides, green grass, a wooden fence, blue sky with soft clouds.'),
  bg('bg-glade', 'glade', 'minik-kasifler-referans.png', 'Bright forest glade framed by big trees and leaves, warm golden light, flowers, soft bokeh, ideal behind a row of selection cards.'),
  bg('bg-lab', 'lab', 'menta-referans-3.png', "Cozy children's science discovery lab inside a glass-dome observatory: a telescope, colorful flasks with glowing liquids, potted plants, planet models hanging from the ceiling, warm light."),
  bg('bg-town', 'town', 'menta-referans-3.png', 'Happy little neighborhood street for a life-skills game: colorful houses, a park with trees, a zebra crossing and a traffic light, bicycles, flowers, sunny day.'),
  bg('bg-history', 'history', 'minik-kasifler-referans.png', 'Warm exploration and history world: a friendly stone castle and a small museum among green hills, an old map table, a glowing golden time-machine ring, golden-hour light.'),
]

// ---------------- KARAKTER ÖZELLEŞTİRME: hazır kaşifler (karakter-referans.png) ----------------
const PRESET = `Same art style, rendering quality and chibi proportions (large head, big glossy expressive eyes, small body) as the children in the attached references, but a NEW original child, about 7 years old:`
const PRESET_TAIL = `Pose: standing confidently and relaxed, weight on one leg, friendly big smile, arms natural (one hand may rest on a backpack strap). ${CHAR_TAIL}`
const preset = (id, desc) => ({ id: `kasif-${id}`, type: 'character', char: `kasif-${id}`, pose: 'idle', refs: ['karakter-referans.png', 'raw:kasif-wave.png'], prompt: `${PRESET} ${desc} ${PRESET_TAIL}` })
JOBS.push(
  preset('pembe', 'a girl with long voluminous wavy brown hair in a high ponytail, light freckles, brass explorer goggles on her head, purple over-ear headphones around her neck, pastel-pink zip jacket over a white t-shirt, beige cargo trousers, pink-and-white high-top sneakers, a small lavender backpack.'),
  preset('lacivert', 'a boy with messy chestnut-brown hair, brass explorer goggles on his head, navy-blue and white varsity-style jacket (no letters) over a white t-shirt, khaki cargo shorts, navy high-top sneakers with white socks, a brown backpack.'),
  preset('mor', 'a girl with dark-brown skin and black curly hair in two puffy buns with little star clips, purple hoodie, denim skirt with white leggings, white sneakers with purple laces.'),
  preset('bilim', 'a girl with fair skin and a golden-blond bob haircut with straight bangs, round turquoise glasses, a white lab coat over a turquoise t-shirt, light-blue trousers, white sneakers.'),
  preset('sporcu', 'a girl with warm tan skin and a long ginger ponytail with a red headband, red sports jersey (no numbers or letters), navy sports shorts, white knee socks, red sneakers.'),
  preset('kis', 'a girl with light-olive skin and long dark-brown hair in two braids, a light-blue puffy winter coat with a white fur hood trim, a pink knitted beanie with a pompom, a striped scarf, pink rain boots.'),
  preset('okul', 'a boy with fair skin and neatly side-parted black hair, round dark-rim glasses, a sky-blue polo shirt, navy trousers, navy-and-white sneakers, a red school backpack.'),
  preset('doga', 'a boy with dark-brown skin and short curly black hair, an olive-green explorer vest with many pockets over a cream t-shirt, a safari bucket hat, brown cargo shorts, brown hiking boots, binoculars around the neck.'),
  preset('uzay', 'a boy with light-tan skin and spiky blond hair, a white-and-orange astronaut suit (no helmet, no flags, no text) with a small chest control panel, white space boots.'),
  { id: 'pets', type: 'sheet', char: 'pet', size: '1536x1024', grid: [4, 2], names: ['kopek', 'kedi', 'tavsan', 'civciv', 'tilki', 'kaplumbaga', 'panda', 'ejderha'], refs: ['karakter-referans.png'],
    prompt: `A sticker sheet of eight original cute baby pet companions in the same 3D cartoon style as the pets in the attached reference, arranged in a strict evenly spaced grid of 4 columns and 2 rows, each pet fully inside its own cell, centered, with generous empty space between them, all facing the viewer and sitting: top row left to right: a beagle puppy, a grey tabby kitten, a white bunny, a yellow chick; bottom row left to right: a little orange fox cub, a green turtle, a baby panda, a tiny friendly blue baby dragon with small wings. Isolated on a fully transparent background, no shadows, no text.` },
)
