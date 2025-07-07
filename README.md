# 3D Chess Game with React Three Fiber

A modern, interactive 3D chess game built with Next.js, React Three Fiber, and TypeScript. Features both 3D and 2D views, piece animations, sound effects, and a responsive design for all devices.

## Features

- **3D/2D Toggle**: Switch between beautiful 3D and classic 2D board views
- **Smooth Animations**: Fluid piece movements and transitions
- **Sound Effects**: Different sounds for moves and captures
- **Captured Pieces**: Visual display of captured pieces for both players
- **Player Indicators**: Clear visual feedback for current player's turn
- **Mobile Responsive**: Optimized layout for all screen sizes
- **Opening Moves**: Includes animated King's Pawn Game variation sequence

## Tech Stack

- **Framework**: Next.js 14
- **3D Graphics**: React Three Fiber / Three.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd three3d
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
three3d/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── play/        # Game page
│   ├── components/       # React components
│   │   ├── ChessBoard.tsx    # 3D chess board
│   │   ├── ChessBoard2D.tsx  # 2D chess board
│   │   ├── ChessGame.tsx     # Game logic wrapper
│   │   ├── ChessPiece.tsx    # Individual piece component
│   │   ├── GameUI.tsx        # Game controls and UI
│   │   └── PlayerIndicator.tsx # Turn indicator
│   └── hooks/            # Custom React hooks
│       └── useChessGame.ts   # Game state management
├── public/              # Static assets
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Game Features

### 3D View
- Realistic 3D chess pieces
- Dynamic lighting and shadows
- Orbital camera controls
- Piece hover effects

### 2D View
- Traditional chess board layout
- Classic piece designs
- Optimized for quick play

### Gameplay
- Legal move validation
- Piece capture tracking
- Turn-based system
- Move sound effects
- Captured pieces display

### User Interface
- Intuitive controls
- View toggle button
- Player turn indicator
- Responsive design
- Mobile-friendly layout

## Development History

1. Initial setup with Next.js and React Three Fiber
2. Fixed flickering elements on home page
3. Added smooth animations for pieces and board
4. Implemented opening moves sequence
5. Added sound effects for moves and captures
6. Implemented captured pieces tracking
7. Created UI for displaying captured pieces
8. Added player color indicator
9. Made layout responsive for mobile
10. Added 2D/3D view toggle
11. Integrated view toggle into GameUI
12. Matched toggle styling with existing controls

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Three Fiber community
- Next.js team
- Three.js contributors 