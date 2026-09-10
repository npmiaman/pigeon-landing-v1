import { useEffect, useRef, useState } from 'react'

/**
 * The pigeon from the logo, on the ground under the composer.
 *
 * On the first paint it pops up out of the logo in the nav, growing from the
 * logo's size to its own where it stands and opening its wings once, to
 * full, as it does; it holds them there a moment, a few feathers come loose
 * and drift down, it folds them, hops on the spot and comes down where it
 * left, then walks down the page in two diagonals, out to the right and
 * back to the left, onto the ground under the composer. From then on it
 * walks about pecking at seed: it claims the nearest seed, walks to it
 * facing the way it will peck, pecks three times and the seed is gone.
 * When the ground runs low another handful lands and it walks over. Idle,
 * it turns to look at nothing, as pigeons do.
 *
 * The sprite is the logo itself: its pixels, sampled at its own grid, in its
 * own colours. The head with its neck ring and the feet are moved as pieces,
 * and for the stretch both wings are laid on the same body, half open and
 * full, the far one behind it and the near one in front, on a taller sheet
 * so a raised wing has somewhere to go.
 * Nothing here is a library. Under `prefers-reduced-motion` the bird is
 * already on the ground and stands still.
 */

// The logo's own colours, read by sampling public/workwithpigeon_logo.png at
// the centre of each of its pixels. Seventeen of them, because the mark was
// drawn with shading, not a flat palette.
const PALETTE: Record<string, string> = {
  a: '#b4aaa0',
  b: '#858176',
  c: '#5f605b',
  d: '#896072',
  e: '#1f292a',
  f: '#a19d91',
  g: '#030000',
  h: '#3a4541',
  i: '#6a7a70',
  j: '#f4f4ec',
  k: '#3a2f35',
  l: '#131917',
  m: '#953738',
  n: '#cdc6be',
  o: '#fbffff',
  p: '#643138',
  q: '#7b3d42',
}

const SPRITE_W = 34
const SPRITE_H = 23
const SCALE = 2
const PIXELS_W = SPRITE_W * SCALE
const PIXELS_H = SPRITE_H * SCALE

// Facing right. Every sheet is 34 wide and 23 tall; `stand` is the logo
// verbatim, the others move its feet or its head. The logo draws one foot;
// the far foot stands exactly behind it, shaded, and the two step frames
// swing them past each other, so a walk goes near-forward, stand,
// far-forward, stand.
const BODY = {
  stand: [
    '.....................gggl.........',
    '....................hbbbbh........',
    '..................egbbbbbe........',
    '..................cbbbmbbe........',
    '................lcibbbbbnhl.......',
    '..............geffjiibbbceg.......',
    '............ecfffafjjjjjjhi.......',
    '...........cffaaaaajjjjiicdk......',
    '..........hffaaaaaaaiccdddddg.....',
    '.........kfffaaaaaaabdddddddg.....',
    '........khbffaaaaaaafddddddde.....',
    '.......kchhffaaaaaaaalbbbbbk......',
    '......hhcchbfaaaaaaaflbbbbbh......',
    '......khhbhcffaaaaaacibbbbb.......',
    '.....glfhhfhhffaaaaahbbbbbg.......',
    '...heklfchcchbffffckibbbch........',
    '..lkkkkgfchckifffghibbbcc.........',
    '..kkkkeeeihcekccecciihhhh.........',
    'ekkkkgh..gghcccccccckop...........',
    'eeell......hlcccccelhpmp..........',
    '..................pmpppppp........',
    '.................cqqqpqi..........',
    '.................cccccc...........',
  ],
  stepA: [
    '.....................gggl.........',
    '....................hbbbbh........',
    '..................egbbbbbe........',
    '..................cbbbmbbe........',
    '................lcibbbbbnhl.......',
    '..............geffjiibbbceg.......',
    '............ecfffafjjjjjjhi.......',
    '...........cffaaaaajjjjiicdk......',
    '..........hffaaaaaaaiccdddddg.....',
    '.........kfffaaaaaaabdddddddg.....',
    '........khbffaaaaaaafddddddde.....',
    '.......kchhffaaaaaaaalbbbbbk......',
    '......hhcchbfaaaaaaaflbbbbbh......',
    '......khhbhcffaaaaaacibbbbb.......',
    '.....glfhhfhhffaaaaahbbbbbg.......',
    '...heklfchcchbffffckibbbch........',
    '..lkkkkgfchckifffghibbbcc.........',
    '..kkkkeeeihcekccecciihhhh.........',
    'ekkkkgh..gghcccccccckop...........',
    'eeell......hlcccccelhpmp..........',
    '................kpkkpmpppppp......',
    '...............lpppcqqqpqi........',
    '...............llllcccccc.........',
  ],
  stepB: [
    '.....................gggl.........',
    '....................hbbbbh........',
    '..................egbbbbbe........',
    '..................cbbbmbbe........',
    '................lcibbbbbnhl.......',
    '..............geffjiibbbceg.......',
    '............ecfffafjjjjjjhi.......',
    '...........cffaaaaajjjjiicdk......',
    '..........hffaaaaaaaiccdddddg.....',
    '.........kfffaaaaaaabdddddddg.....',
    '........khbffaaaaaaafddddddde.....',
    '.......kchhffaaaaaaaalbbbbbk......',
    '......hhcchbfaaaaaaaflbbbbbh......',
    '......khhbhcffaaaaaacibbbbb.......',
    '.....glfhhfhhffaaaaahbbbbbg.......',
    '...heklfchcchbffffckibbbch........',
    '..lkkkkgfchckifffghibbbcc.........',
    '..kkkkeeeihcekccecciihhhh.........',
    'ekkkkgh..gghcccccccckop...........',
    'eeell......hlcccccelhpmp..........',
    '................pmppppppkkkk......',
    '...............cqqqpqipkpc........',
    '...............ccccccllll.........',
  ],
  peck: [
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..................................',
    '..............ge..................',
    '............ecfffafcc.............',
    '...........cffaaaaaaac...cdk......',
    '..........hffaaaaaaaaccdddddg.....',
    '.........kfffaaaaaaabdddddddg.....',
    '........khbffaaaaaaafddddddde.....',
    '.......kchhffaaaaaaaalbbbbbk......',
    '......hhcchbfaaaaaaaflbbbgggl.....',
    '......khhbhcffaaaaaacibbhbbbbh....',
    '.....glfhhfhhffaaaaahbegbbbbbe....',
    '...heklfchcchbffffckibcbbbmbbe....',
    '..lkkkkgfchckifffghilcibbbbbnhl...',
    '..kkkkeeeihcekccecciffjiibbbceg...',
    'ekkkkgh..gghccccccccfafjjjjjjhi...',
    'eeell......hlcccccelaaajjjjii.....',
    '..................pmpppppp........',
    '.................cqqqpqi..........',
    '.................cccccc...........',
  ],
}

type Sheet = readonly string[]
type FrameName = keyof typeof BODY
// A sheet drawn in strokes: row, column, and the run of pixels laid there.
type Stroke = readonly [row: number, col: number, run: string]
function sheet(w: number, h: number, strokes: readonly Stroke[]): string[] {
  const rows = Array.from({ length: h }, () => Array<string>(w).fill('.'))
  for (const [y, x, run] of strokes) [...run].forEach((ch, i) => { rows[y][x + i] = ch })
  return rows.map((r) => r.join(''))
}
// `over` lays a sheet on top of another; `behind` shows it only where the
// other is empty. The near wing goes over the body, the far wing behind it.
const over = (base: Sheet, layer: Sheet) => base.map((row, y) => [...row].map((ch, x) => (layer[y][x] === '.' ? ch : layer[y][x])).join(''))
const behind = (base: Sheet, layer: Sheet) => base.map((row, y) => [...row].map((ch, x) => (ch === '.' ? layer[y][x] : ch)).join(''))
// A small sheet placed on a bigger one.
const placed = (small: Sheet, w: number, h: number, dx: number, dy: number): string[] =>
  Array.from({ length: h }, (_, y) => {
    const row = small[y - dy]
    return row === undefined ? '.'.repeat(w) : '.'.repeat(dx) + row + '.'.repeat(w - dx - row.length)
  })

// The pop and the hop play on a taller, wider sheet, with the standing bird
// bottom-centred on it, so its raised wings have room.
const STAGE_W = 44
const STAGE_H = 34
const PERCH_DX = 5
const PERCH_DY = STAGE_H - SPRITE_H
const PERCH_TOP_ROW = 7 // the highest row any winged frame draws: the tips of the raised wings
const STAGE_PIXELS_W = STAGE_W * SCALE
const STAGE_PIXELS_H = STAGE_H * SCALE

// Both wings, rooted at the standing bird's shoulder, in the body's own
// light with a dark edge; the far one is the same wing in shadow, set back
// so a band of it shows past the near wing. Half open (level, cut to the
// sheet's width) and full.
const WINGS = {
  up: {
    near: sheet(STAGE_W, STAGE_H, [
      [9, 10, 'hhhh'], [10, 11, 'hanh'], [11, 12, 'hanh'], [12, 12, 'haanh'], [13, 13, 'haanh'], [14, 13, 'haaanh'], [15, 14, 'haaanhh'],
      [16, 15, 'haaaanh'], [17, 15, 'hhhhhhhh'],
    ]),
    far: sheet(STAGE_W, STAGE_H, [
      [8, 18, 'kk'], [9, 18, 'kck'], [10, 18, 'kck'], [11, 18, 'khck'], [12, 18, 'khck'], [13, 18, 'khhck'], [14, 18, 'khhck'], [15, 18, 'khhhck'],
      [16, 18, 'kkkkkk'],
    ]),
  },
  level: {
    near: sheet(STAGE_W, STAGE_H, [
      [12, 4, 'hhhh'], [13, 3, 'hnnnnhhh'], [14, 4, 'haaannnhhh'], [15, 5, 'hhhaaannnhhh'], [16, 8, 'hhaaaannnhh'], [17, 10, 'hhhaaaannhhh'],
      [18, 13, 'hhhaaannnhh'], [19, 16, 'hhaaaah'], [20, 18, 'hhhh'],
    ]),
    far: sheet(STAGE_W, STAGE_H, [
      [7, 6, 'kkk'], [8, 5, 'kccck'], [9, 5, 'khhhckk'], [10, 6, 'khhhcckk'], [11, 7, 'kkhhhcck'], [12, 9, 'kkkhhckk'], [13, 12, 'kkhcckkk'],
      [14, 14, 'kkhccckkk'], [15, 16, 'kkkhcck'], [16, 19, 'kkk'],
    ]),
  },
}
const winged = (base: Sheet, wing: { near: Sheet; far: Sheet }) => over(behind(base, wing.far), wing.near)
const onStage = (frame: FrameName) => placed(BODY[frame], STAGE_W, STAGE_H, PERCH_DX, PERCH_DY)
const STAGE = {
  stand: onStage('stand'),
  stepA: onStage('stepA'),
  stepB: onStage('stepB'),
  wingsHalf: winged(onStage('stand'), WINGS.level),
  wingsFull: winged(onStage('stand'), WINGS.up),
}
type StageFrame = keyof typeof STAGE

// One stride: near foot forward, together, far foot forward, together.
const WALK_CYCLE: readonly FrameName[] = ['stepA', 'stand', 'stepB', 'stand']
// The stride again, on the stage sheet, for the walk down.
const STAGE_WALK: readonly StageFrame[] = ['stepA', 'stand', 'stepB', 'stand']

function Sprite({ rows }: { rows: Sheet }) {
  return (
    <g>
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PALETTE[ch]} />,
        ),
      )}
    </g>
  )
}

type Mode = 'walk' | 'peck' | 'idle'
type Bird = {
  x: number
  dir: 1 | -1
  mode: Mode
  target: number | null // seed index, or a wander x when seed is null
  /** Which way the bird faces when it gets to the seed: chosen once, so it does not dither. */
  approach: 1 | -1
  wanderTo: number | null
  ticks: number // ticks spent in the current mode
  pecks: number
  frame: FrameName
  speed: number
  idleFor: number
}
type Seed = { x: number; alive: boolean }

// The way down from the logo, in the ground's coordinates. First the bird
// pops up in place, from the logo's size to its own, opening its wings once
// as it grows; holds them; lets a few feathers go; folds; hops on the spot;
// then walks two diagonals, one leg down and to the right to a turning
// point, one leg down and to the left onto the ground. Each leg takes as
// long as its length at walking pace.
type Point = { x: number; y: number }
type Feather = { from: Point; born: number; phase: number }
type Descent = {
  startedAt: number
  startScale: number
  from: Point
  rise: number // how high the hop goes, given the room above the logo
  legs: Point[] // the walk, from the spot to the ground
  legMs: number[] // how long each leg takes
  feathers: Feather[] // the ones that have come loose so far
}
type Pose = { x: number; y: number; scale: number; dir: 1 | -1; frame: StageFrame; origin: string }
type FeatherPose = { key: number; x: number; y: number; tilt: number; opacity: number }

const TICK_MS = 100
const PECKS_PER_SEED = 3
const PECK_DOWN_TICKS = 3
const PECK_UP_TICKS = 2
const POP_MS = 420 // growing from the logo to full size, in place
const OPEN_AT = 0.45 // of the pop: the wings start to open
const FULL_AT = 0.65 // of the pop: the wings are at full
const STRETCH_MS = 520 // held open at full, after the pop
const FOLD_MS = 160 // half open, then folded
const HOP_MS = 520 // the jump on the spot
const HOP_RISE = 26 // how high the hop goes, when there is room for it
const HOP_HEADROOM = 4 // clear air left above the raised wing tips at the top of the hop
const HOP_RISE_MIN = 6 // a hop this small still reads as one; below it, nothing happens
// It walks down at about four times its amble on the ground (36 px/s), which
// is a bird with somewhere to be rather than one falling: the whole way down
// takes about ten seconds. At the 210 it started with, it arrived before the
// eye could follow it; at 85 the page waited fifteen seconds for a pigeon.
const DESCENT_SPEED = 135 // px per second along each diagonal
const DESCENT_STEP_MS = 200 // one footstep, the ground's cadence
const DEPART_DELAY_MS = 700

// The feathers that come loose when the wings are at full: where on the
// sheet they let go (the wing tips, in cells), how many, how far apart,
// and how they fall, which is slowly, sliding sideways and rocking.
const FEATHER_TIPS: readonly Point[] = [{ x: 9, y: 8 }, { x: 17, y: 7 }, { x: 12, y: 10 }]
const FEATHER_STAGGER_MS = 140
const FEATHER_FALL = 26 // px per second
const FEATHER_DRIFT = -14 // px per second sideways: a falling feather slides, back the way the wing points, clear of the body
const FEATHER_SWAY = 10 // px either side
const FEATHER_SWAY_MS = 1400 // one rock
const FEATHER_TILT = 35 // degrees either way, in time with the sway
const FEATHER_LIFE_MS = 2600
const FEATHER_FADE_MS = 900 // the last part of that, fading
const FEATHER_W = 8
const FEATHER_H = 4
// A feather: a dark quill from the lower left, the vane to the upper right,
// in the body's own colours with the light edge the logo uses.
const FEATHER: Sheet = ['.....anj', '...aannn', '.hhaan..', 'hh......']

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

function throwSeeds(width: number, count: number): Seed[] {
  // A handful lands in a cluster, the way seed thrown from one hand does.
  const centre = rand(width * 0.15, width * 0.85)
  return Array.from({ length: count }, () => ({ x: Math.max(4, Math.min(width - 4, centre + rand(-90, 90))), alive: true }))
}

function makeBird(x: number, dir: 1 | -1): Bird {
  return {
    x,
    dir,
    mode: 'idle',
    target: null,
    approach: 1,
    wanderTo: null,
    ticks: 0,
    pecks: 0,
    frame: 'stand',
    speed: rand(30, 42) * (TICK_MS / 1000),
    idleFor: Math.floor(rand(3, 12)),
  }
}

// The beak sits in from the sprite's leading edge: seven cells standing, three
// with the head down. Five splits the difference, so the seed ends up under
// the lowered beak rather than in front of it.
const BEAK_INSET = 5 * SCALE

function tick(bird: Bird, seeds: Seed[], width: number): void {
  bird.ticks += 1

  if (bird.mode === 'idle') {
    bird.frame = 'stand'
    // Look the other way now and then, for no reason, as pigeons do.
    if (bird.ticks % 9 === 0 && Math.random() < 0.3) bird.dir = bird.dir === 1 ? -1 : 1
    if (bird.ticks < bird.idleFor) return

    // Nearest seed, else a wander.
    let best: number | null = null
    let bestD = Infinity
    seeds.forEach((seed, index) => {
      if (!seed.alive) return
      const d = Math.abs(seed.x - (bird.x + PIXELS_W / 2))
      if (d < bestD) { bestD = d; best = index }
    })
    if (best !== null) {
      bird.target = best
      bird.wanderTo = null
      // Which side to peck from, chosen so the walk there is forwards: face
      // right if the seed is far enough right that walking right reaches it,
      // face left if the mirror holds, and for a seed under the body take
      // the shorter shuffle. The bird faces where it is going and turns to
      // the seed only when it gets there.
      const seedX = seeds[best].x
      const fromLeft = seedX - (PIXELS_W - BEAK_INSET) // x when facing right, beak on the seed
      const fromRight = seedX - BEAK_INSET // x when facing left
      bird.approach = fromLeft >= bird.x ? 1 : fromRight <= bird.x ? -1 : Math.abs(fromLeft - bird.x) <= Math.abs(fromRight - bird.x) ? 1 : -1
    } else {
      bird.target = null
      bird.wanderTo = rand(0, width - PIXELS_W)
    }
    bird.mode = 'walk'
    bird.ticks = 0
    return
  }

  if (bird.mode === 'walk') {
    const seed = bird.target !== null ? seeds[bird.target] : null
    if (bird.target !== null && (!seed || !seed.alive)) {
      bird.target = null
      bird.mode = 'idle'
      bird.ticks = 0
      bird.idleFor = Math.floor(rand(2, 6))
      return
    }
    // Where the bird's x must be for its beak to land on the goal.
    const goalX = seed ? seed.x : (bird.wanderTo ?? bird.x)
    const wantX = seed ? (bird.approach === 1 ? goalX - (PIXELS_W - BEAK_INSET) : goalX - BEAK_INSET) : goalX
    const delta = wantX - bird.x
    if (Math.abs(delta) <= bird.speed) {
      bird.x = wantX
      if (seed) {
        bird.dir = bird.approach
        bird.mode = 'peck'
        bird.ticks = 0
        bird.pecks = 0
      } else {
        bird.mode = 'idle'
        bird.ticks = 0
        bird.idleFor = Math.floor(rand(6, 20))
      }
      return
    }
    // Always walk forwards. A pigeon that faces one way and moves the other
    // is what this line was, before it was this line.
    bird.dir = delta > 0 ? 1 : -1
    bird.x += Math.sign(delta) * bird.speed
    bird.frame = WALK_CYCLE[Math.floor(bird.ticks / 2) % WALK_CYCLE.length]
    return
  }

  // peck
  const cycle = PECK_DOWN_TICKS + PECK_UP_TICKS
  const phase = bird.ticks % cycle
  bird.frame = phase < PECK_DOWN_TICKS ? 'peck' : 'stand'
  if (phase === 0 && bird.ticks > 0) bird.pecks += 1
  if (bird.pecks >= PECKS_PER_SEED) {
    if (bird.target !== null && seeds[bird.target]) seeds[bird.target].alive = false
    bird.target = null
    bird.mode = 'idle'
    bird.ticks = 0
    bird.idleFor = Math.floor(rand(4, 14))
  }
}

// Overshoots past 1 and settles: a pop, not a fade.
const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

// The pop grows from the standing bird's right edge, at its middle, so it
// swells out to the left into the margin and never over the wordmark.
const POP_ORIGIN = `${(PERCH_DX + SPRITE_W) * SCALE}px ${(PERCH_DY + SPRITE_H / 2) * SCALE}px`

/**
 * Where the bird is on its way down: position in the ground's coordinates,
 * scale, which way it faces, which frame, and whether it is done.
 */
function descentPose(d: Descent, now: number): Pose & { done: boolean } {
  const elapsed = now - d.startedAt
  if (elapsed < POP_MS) {
    // Grows, and opens its wings on the way up: folded, half, full.
    const t = elapsed / POP_MS
    const scale = d.startScale + (1 - d.startScale) * easeOutBack(t)
    const frame: StageFrame = t < OPEN_AT ? 'stand' : t < FULL_AT ? 'wingsHalf' : 'wingsFull'
    return { done: false, x: d.from.x, y: d.from.y, scale, dir: 1, frame, origin: POP_ORIGIN }
  }
  const stretchEnd = POP_MS + STRETCH_MS
  if (elapsed < stretchEnd) return { done: false, x: d.from.x, y: d.from.y, scale: 1, dir: 1, frame: 'wingsFull', origin: 'center' }
  const foldEnd = stretchEnd + FOLD_MS
  if (elapsed < foldEnd) {
    const frame: StageFrame = elapsed < stretchEnd + FOLD_MS / 2 ? 'wingsHalf' : 'stand'
    return { done: false, x: d.from.x, y: d.from.y, scale: 1, dir: 1, frame, origin: 'center' }
  }
  const hopEnd = foldEnd + HOP_MS
  if (elapsed < hopEnd) {
    // Straight up and straight back down onto the same spot, wings folded.
    // A hop that put the bird somewhere else read as a cut, not a jump.
    const t = (elapsed - foldEnd) / HOP_MS
    const y = d.from.y - Math.sin(Math.PI * t) * d.rise
    return { done: false, x: d.from.x, y, scale: 1, dir: 1, frame: 'stand', origin: 'center' }
  }
  // Walk the legs in turn, at one pace: no easing, because a pigeon does not
  // accelerate.
  const walking = elapsed - hopEnd
  let left = walking
  for (let i = 0; i < d.legMs.length; i++) {
    const from = d.legs[i]
    const to = d.legs[i + 1]
    if (left < d.legMs[i]) {
      const t = left / d.legMs[i]
      const frame = STAGE_WALK[Math.floor(walking / DESCENT_STEP_MS) % STAGE_WALK.length]
      return { done: false, x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, scale: 1, dir: to.x >= from.x ? 1 : -1, frame, origin: 'center' }
    }
    left -= d.legMs[i]
  }
  const last = d.legs[d.legs.length - 1]
  const before = d.legs[d.legs.length - 2]
  return { done: true, x: last.x, y: last.y, scale: 1, dir: last.x >= before.x ? 1 : -1, frame: 'stand', origin: 'center' }
}

/**
 * Lets feathers go while the wings are at full, one every stagger, from the
 * wing tips; and says where each one is now. A feather falls slowly, slides
 * sideways, rocks, and fades out before it is gone.
 */
function feathersAt(d: Descent, now: number): FeatherPose[] {
  const elapsed = now - d.startedAt
  while (d.feathers.length < FEATHER_TIPS.length && elapsed >= POP_MS + d.feathers.length * FEATHER_STAGGER_MS) {
    const tip = FEATHER_TIPS[d.feathers.length]
    d.feathers.push({ from: { x: d.from.x + tip.x * SCALE, y: d.from.y + tip.y * SCALE }, born: now, phase: Math.random() * Math.PI * 2 })
  }
  return d.feathers.flatMap((f, key) => {
    const age = now - f.born
    if (age >= FEATHER_LIFE_MS) return []
    const rock = (2 * Math.PI * age) / FEATHER_SWAY_MS + f.phase
    return [{
      key,
      x: f.from.x + (FEATHER_DRIFT * age) / 1000 + FEATHER_SWAY * Math.sin(rock),
      y: f.from.y + (FEATHER_FALL * age) / 1000,
      tilt: FEATHER_TILT * Math.cos(rock),
      opacity: Math.min(1, (FEATHER_LIFE_MS - age) / FEATHER_FADE_MS),
    }]
  })
}

export function Pigeons({ className = '', fromSelector }: { className?: string; fromSelector?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const bird = useRef<Bird | null>(null)
  const descent = useRef<Descent | null>(null)
  const seeds = useRef<Seed[]>([])
  const width = useRef(0)
  const lowSince = useRef<number | null>(null)
  const [, setFrame] = useState(0)
  const [pose, setPose] = useState<Pose | null>(null)
  const [feathers, setFeathers] = useState<FeatherPose[]>([])

  useEffect(() => {
    const el = host.current
    if (!el) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const logo = fromSelector ? document.querySelector<HTMLElement>(fromSelector) : null

    const layout = () => {
      const w = el.clientWidth
      if (w === width.current) return
      width.current = w
      if (bird.current) bird.current.x = Math.min(bird.current.x, Math.max(0, w - PIXELS_W))
      if (!seeds.current.length) seeds.current = throwSeeds(w, 5)
      setFrame((f) => f + 1)
    }
    layout()
    const observer = new ResizeObserver(layout)
    observer.observe(el)

    const land = (x: number, dir: 1 | -1) => {
      descent.current = null
      setPose(null)
      setFeathers([])
      bird.current = makeBird(Math.max(0, Math.min(width.current - PIXELS_W, x)), dir)
      if (logo) {
        logo.style.transition = 'opacity 600ms ease'
        logo.style.opacity = '1'
      }
    }

    let raf = 0
    let depart = 0
    if (still || !logo) {
      land(rand(0, width.current - PIXELS_W), Math.random() < 0.5 ? 1 : -1)
    } else {
      depart = window.setTimeout(() => {
        const ground = el.getBoundingClientRect()
        const mark = logo.getBoundingClientRect()
        // The standing bird's right edge on the logo's right edge, its feet
        // on the logo's feet; the sheet around it is bigger than that.
        const start = {
          x: mark.right - ground.left - (PERCH_DX + SPRITE_W) * SCALE,
          y: mark.bottom - ground.top - STAGE_PIXELS_H,
        }
        const ey = ground.height - STAGE_PIXELS_H
        // The logo sits near the top of the page, so the hop rises as far as
        // the raised wing tips have room for.
        const rise = Math.min(HOP_RISE, Math.max(HOP_RISE_MIN, mark.bottom - STAGE_PIXELS_H + PERCH_TOP_ROW * SCALE - HOP_HEADROOM))
        // The hop comes down on the spot it left, so the walk starts at the
        // logo and the bird leaves the nav on its feet: down and to the right
        // to a turning point, then down and to the left onto the ground.
        const end = { x: rand(width.current * 0.15, width.current * 0.5), y: ey }
        const turn = { x: Math.min(width.current - STAGE_PIXELS_W, end.x + rand(220, 340)), y: start.y + (ey - start.y) * rand(0.5, 0.62) }
        const legs = [start, turn, end]
        const legMs = legs.slice(1).map((to, i) => (Math.hypot(to.x - legs[i].x, to.y - legs[i].y) / DESCENT_SPEED) * 1000)
        descent.current = { startedAt: performance.now(), startScale: Math.max(0.2, mark.width / PIXELS_W), from: start, rise, legs, legMs, feathers: [] }
        logo.style.transition = 'opacity 150ms ease'
        logo.style.opacity = '0'
        const step = (now: number) => {
          const d = descent.current
          if (!d) return
          const p = descentPose(d, now)
          setPose({ x: p.x, y: p.y, scale: p.scale, dir: p.dir, frame: p.frame, origin: p.origin })
          setFeathers(feathersAt(d, now))
          if (p.done) land(p.x + PERCH_DX * SCALE, p.dir)
          else raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      }, DEPART_DELAY_MS)
    }

    const timer = still ? 0 : window.setInterval(() => {
      const w = width.current
      const b = bird.current
      if (!w || !b) return
      tick(b, seeds.current, w)
      const alive = seeds.current.filter((s) => s.alive).length
      const now = Date.now()
      if (alive <= 1) {
        lowSince.current ??= now
        if (now - lowSince.current > 2500) {
          seeds.current = [...seeds.current.filter((s) => s.alive), ...throwSeeds(w, 5)]
          lowSince.current = null
        }
      } else {
        lowSince.current = null
      }
      setFrame((f) => f + 1)
    }, TICK_MS)

    return () => {
      observer.disconnect()
      window.clearTimeout(depart)
      cancelAnimationFrame(raf)
      if (timer) window.clearInterval(timer)
      if (logo) logo.style.opacity = '1'
    }
  }, [fromSelector])

  const b = bird.current
  const f = descent.current

  return (
    // On its way down the bird passes over the nav and the headline, so the
    // ground sits above them until it lands; afterwards it is ordinary flow.
    <div ref={host} className={`pointer-events-none relative select-none ${pose ? 'z-50' : ''} ${className}`} style={{ height: PIXELS_H + 4 }} aria-hidden>
      {seeds.current.map((seed, index) =>
        seed.alive ? (
          <span
            key={`seed-${index}-${Math.round(seed.x)}`}
            className="absolute rounded-[1px] bg-[#a8834f]"
            style={{ left: seed.x, bottom: 1, width: 3, height: 3 }}
          />
        ) : null,
      )}
      {pose && f && (
        <svg
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          width={STAGE_PIXELS_W}
          height={STAGE_PIXELS_H}
          shapeRendering="crispEdges"
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${Math.round(pose.x)}px, ${Math.round(pose.y)}px) scale(${pose.scale}) scaleX(${pose.dir})`,
            transformOrigin: pose.origin,
          }}
        >
          <Sprite rows={STAGE[pose.frame]} />
        </svg>
      )}
      {feathers.map((feather) => (
        <svg
          key={feather.key}
          viewBox={`0 0 ${FEATHER_W} ${FEATHER_H}`}
          width={FEATHER_W * SCALE}
          height={FEATHER_H * SCALE}
          shapeRendering="crispEdges"
          className="absolute top-0 left-0"
          style={{ transform: `translate(${feather.x}px, ${feather.y}px) rotate(${feather.tilt}deg)`, transformOrigin: 'center', opacity: feather.opacity }}
        >
          <Sprite rows={FEATHER} />
        </svg>
      ))}
      {b && !f && (
        <svg
          viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}
          width={PIXELS_W}
          height={PIXELS_H}
          shapeRendering="crispEdges"
          className="absolute bottom-0 left-0"
          style={{ transform: `translateX(${Math.round(b.x)}px) scaleX(${b.dir})`, transformOrigin: `${PIXELS_W / 2}px 50%` }}
        >
          <Sprite rows={BODY[b.frame]} />
        </svg>
      )}
    </div>
  )
}
