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

## Angular information

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
