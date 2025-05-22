# WOD Generator

A React Native/Expo application that generates custom workout of the day (WOD) routines based on available equipment. Built for CrossFit enthusiasts and fitness practitioners who want to create varied and effective workouts with the equipment they have on hand.

## Features

- **Equipment-based workout generation**: Select from various equipment options and get workouts tailored to what you have available
- **Multiple workout types**: Generates different formats including For Time, AMRAP, EMOM, Tabata, and Ladder workouts
- **Save favorite workouts**: Store generated workouts for later use
- **React Native Expo**: Cross-platform compatibility for iOS and Android
- **Modern UI**: Clean interface with gradient backgrounds and custom SVG icons

## Screenshots

[App Logo](assets/app-logo.png)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wod-generator.git
cd wod-generator

Install dependencies:

bashnpm install
# or
yarn install

Start the development server:

bashexpo start

Run on your device:

Press i for iOS simulator
Press a for Android emulator
Scan the QR code with Expo Go app on your physical device



Project Structure
WodGenerator/
├── assets/                    # Images and icons
│   ├── icons/                # SVG equipment icons
│   └── app-logo.png         # App logo
├── components/               # React components
│   ├── HomeScreen.js        # Main landing page
│   ├── EquipmentScreen.js   # Equipment selection
│   ├── WodGenerator.js      # Workout generation logic
│   ├── WorkoutDisplay.js    # Display generated workout
│   └── ...
├── utils/                    # Utility functions
│   ├── workoutGeneratorUtils.js  # Workout generation logic
│   └── workoutStorageUtils.js    # AsyncStorage functions
├── static/                   # Static data files
│   ├── exercises.json       # Exercise database
│   └── wod_types.json       # Workout type definitions
├── App.js                    # App entry point
└── package.json             # Dependencies and scripts
Equipment Options
The app supports the following equipment:

Barbell
Dumbbell
Dumbbells (pair)
Kettlebell
Jump Box
Gymnastic Rings
Medicine Ball
Jump Rope

Workout Types

For Time: Complete the workout as fast as possible
AMRAP: As Many Rounds As Possible in a set time
EMOM: Every Minute On the Minute
Tabata: High-intensity interval training
Ladder: Ascending or descending rep schemes

Technology Stack

React Native 0.71.14: Mobile app framework
Expo 48.0.18: Development and build tooling
React Navigation 6: Navigation between screens
AsyncStorage: Local storage for saved workouts
React Native SVG: Custom equipment icons
Expo Linear Gradient: UI gradient effects

Development
Running in development
bashnpm start
Linting
bashnpm run lint
npm run lint:fix
Building for Production
For iOS:
bashexpo build:ios
For Android:
bashexpo build:android
Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

SVG icons custom designed for the application
Exercise database curated from CrossFit movements
Built with React Native and Expo for cross-platform compatibility

Version
Current version: 1.0.0
Contact
For questions or support, please open an issue in the GitHub repository.