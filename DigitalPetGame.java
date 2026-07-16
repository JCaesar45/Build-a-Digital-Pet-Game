
## DigitalPetGame.java

```java
import java.util.Scanner;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Digital Pet Game - Console-based Java Implementation
 * 
 * A virtual pet simulation where players can feed, play with,
 * and let their pet sleep while managing hunger, energy, and happiness.
 */
public class DigitalPetGame {
    
    // ==================== Enumerators ====================
    
    /**
     * Available actions for the pet
     */
    public enum Action {
        EAT, PLAY, SLEEP
    }
    
    /**
     * Pet emotional states based on stat combinations
     */
    public enum PetMood {
        HAPPY("Happy", "😀"),
        EXCITED("Excited", "🤩"),
        CONTENT("Content", "😊"),
        SAD("Sad", "😢"),
        TIRED("Tired", "😴"),
        SICK("Sick", "🤒"),
        HUNGRY("Hungry", "🍽️");
        
        private final String displayName;
        private final String emoji;
        
        PetMood(String displayName, String emoji) {
            this.displayName = displayName;
            this.emoji = emoji;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public String getEmoji() {
            return emoji;
        }
    }
    
    // ==================== Pet Class ====================
    
    /**
     * Represents the digital pet with its stats and behaviors
     */
    static class Pet {
        private String name;
        private int hunger;      // 0-100, 0 is best
        private int energy;      // 0-100, 100 is best
        private int happiness;   // 0-100, 100 is best
        private PetMood currentMood;
        
        /**
         * Creates a new pet with default stats
         */
        public Pet(String name) {
            this.name = name;
            this.hunger = 0;
            this.energy = 100;
            this.happiness = 100;
            updateMood();
        }
        
        /**
         * Performs an action on the pet
         */
        public void performAction(Action action) {
            switch (action) {
                case EAT:
                    hunger = Math.max(0, hunger - 15);
                    energy = Math.min(100, energy + 15);
                    System.out.println(name + " ate some food! 🍖");
                    break;
                case PLAY:
                    energy = Math.max(0, energy - 15);
                    happiness = Math.min(100, happiness + 15);
                    System.out.println(name + " played and had fun! 🎾");
                    break;
                case SLEEP:
                    hunger = Math.min(100, hunger + 15);
                    energy = Math.min(100, energy + 15);
                    System.out.println(name + " took a nap! 💤");
                    break;
            }
            updateMood();
        }
        
        /**
         * Applies idle effects to simulate passage of time
         */
        public void applyIdleEffects() {
            hunger = Math.min(100, hunger + 5);
            energy = Math.max(0, energy - 5);
            happiness = Math.max(0, happiness - 5);
            updateMood();
        }
        
        /**
         * Updates the pet's mood based on current stats
         */
        private void updateMood() {
            if (hunger > 70) {
                currentMood = PetMood.HUNGRY;
            } else if (energy < 30) {
                currentMood = PetMood.TIRED;
            } else if (happiness < 30) {
                currentMood = PetMood.SAD;
            } else if (happiness > 80 && energy > 70) {
                currentMood = PetMood.EXCITED;
            } else if (happiness > 60) {
                currentMood = PetMood.HAPPY;
            } else {
                currentMood = PetMood.CONTENT;
            }
        }
        
        /**
         * Displays the pet's current status
         */
        public void displayStatus() {
            System.out.println("\n" + "=".repeat(40));
            System.out.println("🐾 " + name + "'s Status " + currentMood.getEmoji());
            System.out.println("=".repeat(40));
            System.out.println("Mood: " + currentMood.getDisplayName() + " " + currentMood.getEmoji());
            System.out.println("🍔 Hunger:    " + getProgressBar(hunger) + " " + hunger + "%");
            System.out.println("⚡ Energy:    " + getProgressBar(energy) + " " + energy + "%");
            System.out.println("😊 Happiness: " + getProgressBar(happiness) + " " + happiness + "%");
            System.out.println("=".repeat(40));
            
            // Warning messages
            if (hunger > 70) {
                System.out.println("⚠️  " + name + " is very hungry!");
            }
            if (energy < 30) {
                System.out.println("⚠️  " + name + " is getting tired!");
            }
            if (happiness < 30) {
                System.out.println("⚠️  " + name + " is feeling sad!");
            }
        }
        
        /**
         * Creates a visual progress bar
         */
        private String getProgressBar(int value) {
            int filledBlocks = value / 10;
            int emptyBlocks = 10 - filledBlocks;
            StringBuilder bar = new StringBuilder("[");
            for (int i = 0; i < filledBlocks; i++) {
                bar.append("█");
            }
            for (int i = 0; i < emptyBlocks; i++) {
                bar.append("░");
            }
            bar.append("]");
            return bar.toString();
        }
        
        // Getters
        public String getName() { return name; }
        public int getHunger() { return hunger; }
        public int getEnergy() { return energy; }
        public int getHappiness() { return happiness; }
        public PetMood getCurrentMood() { return currentMood; }
    }
    
    // ==================== Game Controller ====================
    
    /**
     * Main game loop and user interface
     */
    static class GameController {
        private Pet pet;
        private Scanner scanner;
        private Timer idleTimer;
        private boolean isRunning;
        
        public GameController() {
            scanner = new Scanner(System.in);
            isRunning = true;
        }
        
        /**
         * Starts the game
         */
        public void start() {
            displayWelcome();
            createPet();
            startIdleTimer();
            gameLoop();
        }
        
        /**
         * Displays welcome message
         */
        private void displayWelcome() {
            System.out.println("\n" + "🌟".repeat(20));
            System.out.println("   Welcome to Digital Pet Game!");
            System.out.println("🌟".repeat(20));
            System.out.println("\nYour virtual pet is waiting for you!");
        }
        
        /**
         * Creates a new pet with user input
         */
        private void createPet() {
            System.out.print("\nWhat would you like to name your pet? ");
            String name = scanner.nextLine().trim();
            
            while (name.isEmpty()) {
                System.out.print("Please enter a valid name: ");
                name = scanner.nextLine().trim();
            }
            
            pet = new Pet(name);
            System.out.println("\n🎉 Congratulations! " + name + " is now your pet!");
            pet.displayStatus();
        }
        
        /**
         * Starts the idle timer for passive stat changes
         */
        private void startIdleTimer() {
            idleTimer = new Timer();
            idleTimer.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    pet.applyIdleEffects();
                }
            }, 30000, 30000); // Every 30 seconds
        }
        
        /**
         * Main game loop
         */
        private void gameLoop() {
            while (isRunning) {
                displayMenu();
                int choice = getUserChoice();
                processChoice(choice);
            }
        }
        
        /**
         * Displays action menu
         */
        private void displayMenu() {
            System.out.println("\n🎮 What would you like to do?");
            System.out.println("1. 🍖 Feed " + pet.getName());
            System.out.println("2. 🎾 Play with " + pet.getName());
            System.out.println("3. 💤 Let " + pet.getName() + " sleep");
            System.out.println("4. 📊 Check " + pet.getName() + "'s status");
            System.out.println("5. 🚪 Quit game");
            System.out.print("\nEnter your choice (1-5): ");
        }
        
        /**
         * Gets validated user choice
         */
        private int getUserChoice() {
            while (!scanner.hasNextInt()) {
                System.out.print("Please enter a number (1-5): ");
                scanner.next();
            }
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline
            return choice;
        }
        
        /**
         * Processes the user's menu choice
         */
        private void processChoice(int choice) {
            switch (choice) {
                case 1:
                    pet.performAction(Action.EAT);
                    pet.displayStatus();
                    break;
                case 2:
                    pet.performAction(Action.PLAY);
                    pet.displayStatus();
                    break;
                case 3:
                    pet.performAction(Action.SLEEP);
                    pet.displayStatus();
                    break;
                case 4:
                    pet.displayStatus();
                    break;
                case 5:
                    quitGame();
                    break;
                default:
                    System.out.println("❌ Invalid choice! Please enter 1-5.");
            }
        }
        
        /**
         * Quits the game gracefully
         */
        private void quitGame() {
            System.out.println("\n👋 Thanks for playing! " + pet.getName() + " will miss you!");
            isRunning = false;
            if (idleTimer != null) {
                idleTimer.cancel();
            }
            scanner.close();
        }
    }
    
    // ==================== Main Method ====================
    
    public static void main(String[] args) {
        GameController game = new GameController();
        game.start();
    }
}
