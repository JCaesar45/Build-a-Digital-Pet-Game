# 🐾 Digital Pet Game

A virtual pet simulation game built with React, TypeScript, and love! Take care of your digital companion by feeding, playing, and letting it rest.

## 🎮 Game Overview

Welcome to the Digital Pet Game! This interactive web application lets you adopt and care for a virtual pet. Your pet has three core stats that you need to manage:

- **🍔 Hunger** (0-100): Keep it low by feeding your pet
- **⚡ Energy** (0-100): Manage through eating and sleeping
- **😊 Happiness** (0-100): Boost by playing with your pet

## ✨ Features

### 🎯 Core Mechanics
- **Dynamic Pet Stats**: Real-time tracking of Hunger, Energy, and Happiness
- **Interactive Actions**: Feed, play, and let your pet sleep
- **Mood System**: 7 different emotional states based on stat combinations
- **Idle Effects**: Stats change over time when you're not interacting
- **Responsive Design**: Works on desktop and mobile devices

### 🎭 Pet Moods
Your pet displays different emotions based on its current state:

| Mood | Condition | Emoji |
|------|-----------|-------|
| 😊 Happy | Happiness > 60 | 😀 |
| 🤩 Excited | Happiness > 80 & Energy > 70 | 🤩 |
| 😌 Content | Default state | 😊 |
| 😢 Sad | Happiness < 30 | 😢 |
| 😴 Tired | Energy < 30 | 😴 |
| 🍽️ Hungry | Hunger > 70 | 🍽️ |
| 🤒 Sick | Extreme conditions | 🤒 |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/digital-pet-game.git
cd digital-pet-game
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## 🎯 How to Play

1. **Name Your Pet**: Enter a name in the initial form
2. **Monitor Stats**: Watch your pet's Hunger, Energy, and Happiness levels
3. **Take Actions**:
   - **EAT**: Reduces hunger, increases energy
   - **PLAY**: Reduces energy, increases happiness
   - **SLEEP**: Increases hunger, increases energy
4. **Watch the Mood**: Your pet's emoji changes based on its stats
5. **Stay Vigilant**: Stats change over time even without interaction!

## 💻 Technical Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: CSS3 with Flexbox
- **Testing**: Built-in test suite

## 📁 Project Structure

```
digital-pet-game/
├── src/
│   ├── index.tsx          # Main application component
│   ├── index.html         # HTML template
│   └── styles.css         # Styling
├── java/
│   └── DigitalPetGame.java # Java implementation
├── python/
│   └── digital_pet_game.py # Python implementation
├── README.md
└── package.json
```

## 🧪 Running Tests

```bash
npm test
```

## 🌟 Pro Tips

- **Balance is Key**: Try to keep all stats in the middle range
- **Watch the Clock**: Idle time affects your pet's wellbeing
- **Quick Actions**: Respond quickly to mood changes
- **Experiment**: Different action combinations yield different results

## 🔧 Customization

You can easily customize the game by modifying:
- Action effects in the handle functions
- Idle timer intervals in useEffect
- Mood thresholds in getPetMood()
- Emoji mappings in moodEmojiMap

## 📚 Additional Implementations

This project also includes:
- **Java Implementation**: Console-based version
- **Python Implementation**: Interactive terminal version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Built as part of the FreeCodeCamp Front-End Development Libraries Certification
- Inspired by classic virtual pet games like Tamagotchi
- Special thanks to the React and TypeScript communities

---

**Happy pet parenting! 🐾**
