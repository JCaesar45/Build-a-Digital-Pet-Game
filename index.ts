// ===================================================================
// Pixel Pal — a tiny digital pet
// ===================================================================

/** Actions the player can perform on the pet. */
enum Action {
  EAT = "EAT",
  PLAY = "PLAY",
  SLEEP = "SLEEP",
}

/** Every mood the pet can be in. */
enum PetMood {
  HAPPY = "HAPPY",
  EXCITED = "EXCITED",
  CONTENT = "CONTENT",
  SAD = "SAD",
  TIRED = "TIRED",
  SICK = "SICK",
  HUNGRY = "HUNGRY",
}

/** One emoji per mood, keyed by the PetMood enum. */
const moodEmojiMap: Record<PetMood, string> = {
  [PetMood.HAPPY]: "😊",
  [PetMood.EXCITED]: "🤩",
  [PetMood.CONTENT]: "🙂",
  [PetMood.SAD]: "😢",
  [PetMood.TIRED]: "🥱",
  [PetMood.SICK]: "🤒",
  [PetMood.HUNGRY]: "🍽️",
};

/** A friendly label per mood, keyed by the PetMood enum. */
const moodLabelMap: Record<PetMood, string> = {
  [PetMood.HAPPY]: "Happy",
  [PetMood.EXCITED]: "Excited",
  [PetMood.CONTENT]: "Content",
  [PetMood.SAD]: "Sad",
  [PetMood.TIRED]: "Tired",
  [PetMood.SICK]: "Sick",
  [PetMood.HUNGRY]: "Hungry",
};

interface PetStats {
  hunger: number;
  energy: number;
  happiness: number;
}

// ---------------------------------------------------------------
// State
// ---------------------------------------------------------------

let petName = "";

const stats: PetStats = {
  hunger: 0,
  energy: 100,
  happiness: 100,
};

const STAT_STEP = 10;
const IDLE_TICK_MS = 4000; // how often the pet drifts while idle
const IDLE_DRIFT = 6; // amount it drifts per tick

let idleTimer: ReturnType<typeof setInterval> | undefined;

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** Determine the pet's current mood from its stats. */
function computeMood(s: PetStats): PetMood {
  if (s.hunger > 90 && s.energy < 15) return PetMood.SICK;
  if (s.hunger > 70) return PetMood.HUNGRY;
  if (s.energy < 30) return PetMood.TIRED;
  if (s.happiness < 30) return PetMood.SAD;
  if (s.happiness > 80 && s.energy > 70) return PetMood.EXCITED;
  if (s.happiness > 60) return PetMood.HAPPY;
  return PetMood.CONTENT;
}

// ---------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------

const introView = document.getElementById("intro-view") as HTMLElement;
const gameView = document.getElementById("game-view") as HTMLElement;
const nameForm = document.getElementById("name-form") as HTMLFormElement;
const nameInput = document.getElementById("pet-name") as HTMLInputElement;

const petNameEl = document.querySelector(".pet-name") as HTMLElement;
const moodEmojiEl = document.getElementById("mood-emoji") as HTMLElement;
const moodTextEl = document.getElementById("mood-text") as HTMLElement;

const hungerStatEl = document.getElementById("hunger-stat") as HTMLElement;
const energyStatEl = document.getElementById("energy-stat") as HTMLElement;
const happinessStatEl = document.getElementById("happiness-stat") as HTMLElement;

const eatBtn = document.getElementById("eat-action") as HTMLButtonElement;
const playBtn = document.getElementById("play-action") as HTMLButtonElement;
const sleepBtn = document.getElementById("sleep-action") as HTMLButtonElement;

// ---------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------

function updateStatEl(container: HTMLElement, value: number): void {
  const valueEl = container.querySelector(".stat-value") as HTMLElement;
  const fillEl = container.querySelector(".stat__fill") as HTMLElement | null;
  valueEl.textContent = String(value);
  if (fillEl) fillEl.style.width = `${value}%`;
}

function render(): void {
  updateStatEl(hungerStatEl, stats.hunger);
  updateStatEl(energyStatEl, stats.energy);
  updateStatEl(happinessStatEl, stats.happiness);

  const mood = computeMood(stats);
  moodEmojiEl.textContent = moodEmojiMap[mood];
  moodTextEl.textContent = moodLabelMap[mood];
}

// ---------------------------------------------------------------
// Actions
// ---------------------------------------------------------------

function applyAction(action: Action): void {
  switch (action) {
    case Action.EAT:
      stats.hunger = clamp(stats.hunger - STAT_STEP);
      stats.energy = clamp(stats.energy + STAT_STEP);
      break;
    case Action.PLAY:
      stats.energy = clamp(stats.energy - STAT_STEP);
      stats.happiness = clamp(stats.happiness + STAT_STEP);
      break;
    case Action.SLEEP:
      stats.hunger = clamp(stats.hunger + STAT_STEP);
      stats.energy = clamp(stats.energy + STAT_STEP);
      break;
  }
  render();
}

// ---------------------------------------------------------------
// Idle drift — the pet's needs change if you leave it alone
// ---------------------------------------------------------------

function startIdleDrift(): void {
  if (idleTimer) clearInterval(idleTimer);
  idleTimer = setInterval(() => {
    stats.hunger = clamp(stats.hunger + IDLE_DRIFT);
    stats.energy = clamp(stats.energy + IDLE_DRIFT);
    stats.happiness = clamp(stats.happiness - IDLE_DRIFT);
    render();
  }, IDLE_TICK_MS);
}

// ---------------------------------------------------------------
// View transition
// ---------------------------------------------------------------

function startGame(name: string): void {
  petName = name;
  petNameEl.textContent = petName;

  introView.classList.add("view--hidden");
  gameView.classList.remove("view--hidden");

  eatBtn.disabled = false;
  playBtn.disabled = false;
  sleepBtn.disabled = false;

  render();
  startIdleDrift();
}

// ---------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------

nameForm.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  startGame(name);
});

eatBtn.addEventListener("click", () => applyAction(Action.EAT));
playBtn.addEventListener("click", () => applyAction(Action.PLAY));
sleepBtn.addEventListener("click", () => applyAction(Action.SLEEP));
