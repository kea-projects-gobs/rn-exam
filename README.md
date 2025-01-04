# Recipe & Shopping List App

A React Native mobile application that helps users plan their weekly meals and generate shopping lists automatically. Built with Expo / React Native and TypeScript.

## Features

- Weekly meal planning
- Automatic shopping list generation
- Basic ingredients management
- Recipe browsing and details
- Shopping list with check-off functionality
- Dark mode support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

### Backend setup

1. See the README.md in the backend repository for instructions on how to set up the backend.
- Located here: https://github.com/kea-projects-gobs/rn-exam-backend

### Frontend setup

1. Clone the repository:
```bash
git clone https://github.com/kea-projects-gobs/rn-exam
```
2. Navigate to the project directory:
```bash
cd rn-exam
```
3. Install dependencies:
```bash
npm install
```
4. Start the Expo development server:
```bash
npx expo start
```
5. Run the app on your simulator or device:
- Press "a" to run on Android simulator
- Scan QR code with Expo Go to run on local device.
    - Remember to change the url in the /app/lib/api/settings.ts file to the local ip address of your device, so that you can run it with the backend running on your computer.

