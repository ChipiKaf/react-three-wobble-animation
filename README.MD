# Wobbly Sphere Animation

This project demonstrates a morph animation effect using React, Three.js, and `@react-three/fiber`. The animation includes custom shader materials and allows for dynamic control of various parameters.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [License](#license)

## Demo

[Link to live demo]()

## Features

- Morph animation using custom shader materials
- Dynamic control of material properties and uniforms
- Interactive environment with orbit controls and lighting

## Installation

1. Clone the repository:

      ```git clone https://github.com/your-username/wobbly-sphere-animation.git
      cd wobbly-sphere-animation

2. Install dependencies:

      ```npm install

## Usage

1. Start the development server:

      ```npm run dev

2. Open your browser and navigate to `http://localhost:3000` to see the morph animation demo in action.

## Scripts

- `dev`: Starts the development server.
- `build`: Builds the project for production.

## Project Structure

      .
      ├── node_modules
      ├── public
      ├── src
      │   ├── shaders
      │   │   └── wobble
      │   │       ├── fragment.glsl
      │   │       └── vertex.glsl
      │   ├── utils
      │   │   └── objectUtils.js
      │   ├── Experience.jsx
      │   ├── index.html
      │   ├── index.jsx
      │   ├── style.css
      ├── .gitignore
      ├── package-lock.json
      ├── package.json
      ├── README.md
      └── vite.config.js

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Three.js**: A JavaScript 3D library.
- **@react-three/fiber**: React renderer for Three.js.
- **@react-three/drei**: Useful helpers for `@react-three/fiber`.
- **Leva**: A GUI for React to control parameters.
- **Vite**: A build tool that aims to provide a faster and leaner development experience.

## License

This project is licensed under the MIT License.
