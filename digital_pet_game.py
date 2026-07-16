#!/usr/bin/env python3
"""
Digital Pet Game - Python Implementation

A console-based virtual pet simulation where players nurture
a digital companion by managing its hunger, energy, and happiness.
"""

import time
import threading
from enum import Enum
from typing import Dict, Optional
import os
import sys

# ==================== Enumerators ====================

class Action(Enum):
    """Available actions for the pet"""
    EAT = "EAT"
    PLAY = "PLAY"
    SLEEP = "SLEEP"


class PetMood(Enum):
    """Pet emotional states based on stat combinations"""
    HAPPY = "HAPPY"
    EXCITED = "EXCITED"
    CONTENT = "CONTENT"
    SAD = "SAD"
    TIRED = "TIRED"
    SICK = "SICK"
    HUNGRY = "HUNGRY"


# ==================== Mood Mappings ====================

class MoodDisplay:
    """Handles the visual representation of pet moods"""
    
    EMOJI_MAP: Dict[PetMood, str] = {
        PetMood.HAPPY: "😀",
        PetMood.EXCITED: "🤩",
        PetMood.CONTENT: "😊",
        PetMood.SAD: "😢",
        PetMood.TIRED: "😴",
        PetMood.SICK: "🤒",
        PetMood.HUNGRY: "🍽️",
    }
    
    DESCRIPTION_MAP: Dict[PetMood, str] = {
        PetMood.HAPPY: "feeling happy and content",
        PetMood.EXCITED: "bouncing with excitement",
        PetMood.CONTENT: "peacefully content",
        PetMood.SAD: "feeling a bit down",
        PetMood.TIRED: "struggling to stay awake",
        PetMood.SICK: "not feeling well",
        PetMood.HUNGRY: "starving for food",
    }
    
    @classmethod
    def get_emoji(cls, mood: PetMood) -> str:
        """Get the emoji for a given mood"""
        return cls.EMOJI_MAP.get(mood, "❓")
    
    @classmethod
    def get_description(cls, mood: PetMood) -> str:
        """Get the description for a given mood"""
        return cls.DESCRIPTION_MAP.get(mood, "unknown state")


# ==================== Pet Class ====================

class Pet:
    """
    Represents a digital pet with stats and behaviors
    
    Attributes:
        name (str): The pet's name
        hunger (int): Hunger level (0-100, 0 is best)
        energy (int): Energy level (0-100, 100 is best)
        happiness (int): Happiness level (0-100, 100 is best)
        current_mood (PetMood): Current emotional state
    """
    
    def __init__(self, name: str):
        """
        Initialize a new pet with default stats
        
        Args:
            name (str): The pet's name
        """
        self.name = name
        self.hunger = 0
        self.energy = 100
        self.happiness = 100
        self.current_mood = PetMood.CONTENT
        self._update_mood()
    
    def perform_action(self, action: Action) -> None:
        """
        Execute an action on the pet
        
        Args:
            action (Action): The action to perform
        """
        if action == Action.EAT:
            self.hunger = max(0, self.hunger - 15)
            self.energy = min(100, self.energy + 15)
            print(f"🍖 {self.name} enjoyed a delicious meal!")
            
        elif action == Action.PLAY:
            self.energy = max(0, self.energy - 15)
            self.happiness = min(100, self.happiness + 15)
            print(f"🎾 {self.name} had so much fun playing!")
            
        elif action == Action.SLEEP:
            self.hunger = min(100, self.hunger + 15)
            self.energy = min(100, self.energy + 15)
            print(f"💤 {self.name} took a refreshing nap!")
        
        self._update_mood()
    
    def apply_idle_effects(self) -> None:
        """Apply passive stat changes to simulate time passing"""
        self.hunger = min(100, self.hunger + 5)
        self.energy = max(0, self.energy - 5)
        self.happiness = max(0, self.happiness - 5)
        self._update_mood()
    
    def _update_mood(self) -> None:
        """Update pet's mood based on current stat values"""
        if self.hunger > 70:
            self.current_mood = PetMood.HUNGRY
        elif self.energy < 30:
            self.current_mood = PetMood.TIRED
        elif self.happiness < 30:
            self.current_mood = PetMood.SAD
        elif self.happiness > 80 and self.energy > 70:
            self.current_mood = PetMood.EXCITED
        elif self.happiness > 60:
            self.current_mood = PetMood.HAPPY
        else:
            self.current_mood = PetMood.CONTENT
    
    def get_status_display(self) -> str:
        """
        Generate a formatted status display string
        
        Returns:
            str: Formatted status information
        """
        emoji = MoodDisplay.get_emoji(self.current_mood)
        description = MoodDisplay.get_description(self.current_mood)
        
        status = f"""
{'='*50}
🐾 {self.name}'s Status {emoji}
{'='*50}
Mood: {self.current_mood.value} {emoji}
      {self.name} is {description}

🍔 Hunger:    {self._get_progress_bar(self.hunger)} {self.hunger}%
⚡ Energy:    {self._get_progress_bar(self.energy)} {self.energy}%
😊 Happiness: {self._get_progress_bar(self.happiness)} {self.happiness}%
{'='*50}
"""
        
        # Add warning messages
        warnings = []
        if self.hunger > 70:
            warnings.append(f"⚠️  {self.name} is very hungry!")
        if self.energy < 30:
            warnings.append(f"⚠️  {self.name} is getting tired!")
        if self.happiness < 30:
            warnings.append(f"⚠️  {self.name} is feeling sad!")
        
        if warnings:
            status += "\n".join(warnings) + "\n"
        
        return status
    
    @staticmethod
    def _get_progress_bar(value: int) -> str:
        """
        Create a visual progress bar
        
        Args:
            value (int): Current value (0-100)
            
        Returns:
            str: Progress bar string
        """
        filled = value // 10
        empty = 10 - filled
        return f"[{'█' * filled}{'░' * empty}]"


# ==================== Game Controller ====================

class GameController:
    """Main game controller handling UI and game loop"""
    
    def __init__(self):
        """Initialize the game controller"""
        self.pet: Optional[Pet] = None
        self.running = True
        self.idle_thread: Optional[threading.Thread] = None
    
    def start(self) -> None:
        """Start the game"""
        self._clear_screen()
        self._display_welcome()
        self._create_pet()
        self._start_idle_timer()
        self._game_loop()
    
    def _clear_screen(self) -> None:
        """Clear the terminal screen"""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def _display_welcome(self) -> None:
        """Display welcome message"""
        print("\n" + "🌟" * 30)
        print("       Welcome to Digital Pet Game!")
        print("🌟" * 30)
        print("\n🎮 A virtual pet is waiting for your care!")
        print("   Feed, play, and rest your pet to keep it happy.\n")
    
    def _create_pet(self) -> None:
        """Create a new pet with user-provided name"""
        while True:
            name = input("What would you like to name your pet? ").strip()
            if name:
                break
            print("❌ Please enter a valid name!")
        
        self.pet = Pet(name)
        print(f"\n🎉 Congratulations! {name} is now your pet!")
        print(self.pet.get_status_display())
    
    def _start_idle_timer(self) -> None:
        """Start background thread for idle effects"""
        def idle_loop():
            while self.running:
                time.sleep(30)  # Apply every 30 seconds
                if self.running and self.pet:
                    self.pet.apply_idle_effects()
        
        self.idle_thread = threading.Thread(target=idle_loop, daemon=True)
        self.idle_thread.start()
    
    def _game_loop(self) -> None:
        """Main game interaction loop"""
        while self.running:
            self._display_menu()
            choice = self._get_user_choice()
            self._process_choice(choice)
    
    def _display_menu(self) -> None:
        """Display action menu"""
        print("\n🎮 What would you like to do?")
        print("1. 🍖 Feed your pet")
        print("2. 🎾 Play with your pet")
        print("3. 💤 Let your pet sleep")
        print("4. 📊 Check pet's status")
        print("5. 💡 Show game tips")
        print("6. 🚪 Quit game")
    
    def _get_user_choice(self) -> int:
        """
        Get validated user menu choice
        
        Returns:
            int: User's menu choice (1-6)
        """
        while True:
            try:
                choice = int(input("\nEnter your choice (1-6): "))
                if 1 <= choice <= 6:
                    return choice
                print("❌ Please enter a number between 1 and 6!")
            except ValueError:
                print("❌ Please enter a valid number!")
    
    def _process_choice(self, choice: int) -> None:
        """
        Process user's menu choice
        
        Args:
            choice (int): Menu choice
        """
        if choice == 1:
            self.pet.perform_action(Action.EAT)
            print(self.pet.get_status_display())
        elif choice == 2:
            self.pet.perform_action(Action.PLAY)
            print(self.pet.get_status_display())
        elif choice == 3:
            self.pet.perform_action(Action.SLEEP)
            print(self.pet.get_status_display())
        elif choice == 4:
            print(self.pet.get_status_display())
        elif choice == 5:
            self._display_tips()
        elif choice == 6:
            self._quit_game()
    
    def _display_tips(self) -> None:
        """Display game tips and strategies"""
        tips = f"""
{'='*50}
💡 Game Tips & Strategies
{'='*50}

🎯 STAT MANAGEMENT:
• Keep all stats balanced for a happy pet
• Stats change over time even when idle
• Each action affects multiple stats

📊 STAT RANGES:
• Hunger: 0 (full) to 100 (starving)
• Energy: 100 (energetic) to 0 (exhausted)
• Happiness: 100 (joyful) to 0 (miserable)

🎭 MOOD TRIGGERS:
• Hungry: Hunger > 70
• Tired: Energy < 30
• Sad: Happiness < 30
• Excited: Happiness > 80 & Energy > 70
• Happy: Happiness > 60
• Content: Default state

⚡ PRO TIPS:
• Feed when hunger gets high
• Play regularly to maintain happiness
• Let pet sleep to restore energy
• Watch for warning signs in status display
• Respond quickly to mood changes

🔄 IDLE EFFECTS (every 30 seconds):
• Hunger: +5
• Energy: -5
• Happiness: -5

{'='*50}
"""
        print(tips)
        input("Press Enter to continue...")
    
    def _quit_game(self) -> None:
        """Quit the game gracefully"""
        print(f"\n👋 Thanks for playing! {self.pet.name} will miss you!")
        print("Come back soon to take care of your pet!\n")
        self.running = False


# ==================== Entry Point ====================

def main():
    """Main entry point for the game"""
    try:
        game = GameController()
        game.start()
    except KeyboardInterrupt:
        print("\n\n👋 Game interrupted. Goodbye!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
