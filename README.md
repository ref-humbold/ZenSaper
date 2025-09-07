# ZenSaper
![Release](https://img.shields.io/github/v/release/ref-humbold/ZenSaper?style=plastic)
![License](https://img.shields.io/github/license/ref-humbold/ZenSaper?style=plastic)

Saper game in Angular

## About
ZenSaper is a small single-player game written in Angular framework. The player should find all 32 bombs hidden among fields in a 16x16 board to win the game. Each field can either contain a bomb, be blank or show total number of bombs in neighbouring fields (by side or by corner).

## How to play?
+ left click on field - show field's content
+ right click on field - toggle possible bomb mark
+ left click on face - start new game

-----

## How to manage Docker images?

### Development image

1. Build an image using **`Dockerfile.dev`** in project's directory
```
cd path/to/project
docker build -f Dockerfile.dev -t zen-saper:dev .
```
2. Run a container mapping container's port **4200** to host's free port (e.g. 8080)
```
docker run -p 8080:4200 zen-saper:dev
```

### Production image

1. Build an image using **`Dockerfile`** in project's directory
```
cd path/to/project
docker build -f Dockerfile -t zen-saper:prod .
```
2. Run a container mapping container's port **80** to host's free port (e.g. 8080)
```
docker run -p 8080:80 zen-saper:prod
```

-----

## Development information

### Available Scripts

#### `npm start`

Start the development server. The app will be available at  [http://localhost:4200](http://localhost:4200).

The page will automatically reload if you change any of the source files.

#### `npm run build`

Build the project. The build artifacts will be stored in the `dist/` directory.

#### `npm run build-prod`

Build the project with production configuration. The build artifacts will be stored in the `dist/` directory.

#### `npm run test`

Execute the unit tests via [Karma](https://karma-runner.github.io).

#### `npm run e2e`

Execute the end-to-end tests via a platform of your choice.

To use this command, you need to first add a package that implements end-to-end testing capabilities.
