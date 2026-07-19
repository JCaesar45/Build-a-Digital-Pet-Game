const { useState, useEffect } = React;

interface StatBarProps {
  label: string;
  value: number;
  icon: string;
  reverse?: boolean;
}

function getStatColorClass(value: number): string {
  if (value >= 70) return "high";
  if (value >= 40) return "medium";
  return "low";
}

function StatBar({ label, value, icon, reverse = false }: StatBarProps) {
  // `reverse` only affects color semantics (e.g. high Hunger = bad = red),
  // it must NEVER change the displayed/actual value.
  const colorClass = getStatColorClass(reverse ? 100 - value : value);
  return (
    <div className="stat-bar stat">
      <div className="stat-header">
        <div className="stat-label">
          <span className="stat-icon">{icon}</span>
          <span className="stat-name">{label}</span>
        </div>
        <span className="stat-value">{Math.round(value)}%</span>
      </div>
      <div className="stat-progress">
        <div
          className={`stat-fill ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

enum PetAction {
  NONE,
  EAT,
  PLAY,
  SLEEP,
}

interface Pet {
  name: string;
  happiness: number;
  hunger: number;
  energy: number;
  species: string;
}

enum PetMood {
  HAPPY,
  EXCITED,
  CONTENT,
  SAD,
  TIRED,
  SICK,
  HUNGRY,
}

export const STAT_DECAY_RATES = {
  hunger: 10,
  happiness: 5,
  energy: 5,
};

const UPDATE_INTERVAL = 30000;

export function calculatePetMood(pt: Pet): PetMood {
  const { hunger, happiness, energy } = pt;
  if (hunger > 70) return PetMood.HUNGRY;
  if (energy < 30) return PetMood.TIRED;
  if (happiness < 30) return PetMood.SAD;
  if (happiness > 80 && energy > 70) return PetMood.EXCITED;
  if (happiness > 60) return PetMood.HAPPY;
  return PetMood.CONTENT;
}

const moodEmojiMap: Record<PetMood, string> = {
  [PetMood.HAPPY]: "😺",
  [PetMood.EXCITED]: "😻",
  [PetMood.CONTENT]: "😸",
  [PetMood.SAD]: "😿",
  [PetMood.TIRED]: "🥱",
  [PetMood.SICK]: "🤢",
  [PetMood.HUNGRY]: "😹",
};

function usePet({ isGameStarted }: { isGameStarted: boolean }) {
  const [pet, setPet] = useState<Pet>({
    name: "",
    happiness: 100,
    hunger: 0,
    energy: 100,
    species: "Luxora Cat",
  });

  useEffect(() => {
    if (!isGameStarted) return;
    const interval = setInterval(() => {
      setPet((prev) => ({
        ...prev,
        happiness: Math.max(prev.happiness - 5, 0),
        hunger: Math.min(prev.hunger + 8, 100),
        energy: Math.min(prev.energy + 5, 100), // idle pet rests -> energy climbs toward 100
      }));
    }, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isGameStarted]);

  const doAction = (action: PetAction) => {
    setPet((prev) => {
      let newPet = { ...prev };
      switch (action) {
        case PetAction.EAT:
          newPet.hunger = Math.max(newPet.hunger - STAT_DECAY_RATES.hunger, 0);
          newPet.energy = Math.min(newPet.energy + STAT_DECAY_RATES.energy, 100);
          break;
        case PetAction.PLAY:
          newPet.energy = Math.max(newPet.energy - STAT_DECAY_RATES.energy, 0);
          newPet.happiness = Math.min(newPet.happiness + STAT_DECAY_RATES.happiness, 100);
          break;
        case PetAction.SLEEP:
          newPet.hunger = Math.min(newPet.hunger + STAT_DECAY_RATES.hunger, 100);
          newPet.energy = Math.min(newPet.energy + STAT_DECAY_RATES.energy * 1.5, 100);
          break;
      }
      return newPet;
    });
  };

  const setName = (name: string) => {
    setPet((prev) => ({ ...prev, name }));
  };

  return { pet, doAction, setName };
}

export function PetGame() {
  const [isGameStarted, setGameStarted] = useState(false);
  const { pet, doAction, setName } = usePet({ isGameStarted });
  const [fact, setFact] = useState("Loading a luxurious fact for your companion...");

  useEffect(() => {
    fetch("https://cat-facts-api.freecodecamp.rocks/api/catfacts/random")
      .then(res => res.json())
      .then(data => setFact(data.fact || "Every pet deserves a palace."))
      .catch(() => setFact("In the realm of digital elegance, care is eternal."));
  }, []);

  const startGame = () => {
    const input = document.getElementById("pet-name") as HTMLInputElement;
    const name = input?.value.trim();
    if (!name) return;
    setName(name);
    setGameStarted(true);
  };

  const currentMood = calculatePetMood(pet);

  return React.createElement('main', null,
    React.createElement('header', null,
      React.createElement('h1', null, 'LUXORA'),
      React.createElement('p', null, 'Where digital souls find eternal elegance')
    ),
    isGameStarted && React.createElement('section', { className: "base-container game-container" },
      React.createElement('div', { className: "pet-screen" },
        React.createElement('div', { className: "pet-sprite" }, moodEmojiMap[currentMood]),
        React.createElement('h2', { className: "pet-name" }, pet.name)
      ),
      React.createElement('div', { className: "pet-buttons" },
        React.createElement('button', {
          id: "eat-action",
          className: "pet-button",
          onClick: () => doAction(PetAction.EAT)
        }, "FEED"),
        React.createElement('button', {
          id: "play-action",
          className: "pet-button",
          onClick: () => doAction(PetAction.PLAY)
        }, "PLAY"),
        React.createElement('button', {
          id: "sleep-action",
          className: "pet-button",
          onClick: () => doAction(PetAction.SLEEP)
        }, "REST")
      )
    ),
    isGameStarted && React.createElement('section', { className: "stats-grid" },
      React.createElement(StatBar, { label: "Hunger", value: pet.hunger, icon: "🍖", reverse: true }),
      React.createElement(StatBar, { label: "Happiness", value: pet.happiness, icon: "💎" }),
      React.createElement(StatBar, { label: "Energy", value: pet.energy, icon: "🌟" })
    ),
    React.createElement('section', { className: "base-container info-panel" },
      !isGameStarted ?
        React.createElement('form', { className: "start-questions" },
          React.createElement('label', { htmlFor: "pet-name" }, "Bestow a name upon your eternal companion"),
          React.createElement('input', {
            id: "pet-name",
            type: "text",
            placeholder: "Fitzgerald",
            required: true
          }),
          React.createElement('button', {
            id: "set-name-btn",
            type: "button",
            onClick: startGame
          }, "Begin the Legacy")
        ) :
        React.createElement('div', { id: "hud" },
          React.createElement('p', null, `Species: ${pet.species}`),
          React.createElement('p', { id: "pet-fact" },
            React.createElement('strong', null, "Whispers from the Realm: "), fact
          )
        )
    )
  );
}
