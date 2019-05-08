# Virksa Time Manager Mobile App
X by 2 utility, manage multiple client billable hours with a stopwatch like app.  Uses Ionic Framework.

## [Install Mobile App](https://play.google.com/store/apps/details?id=virksa.jeffsallans)

## Changelog

v1.3.0 - Changed to side menu navigation and added Settings page
v1.2.0 - Initial open release to app store

## Technology

* [Ionic Framework](https://ionicframework.com/)
* [Angular 6 (using TypeScript)](https://angular.io/)
* [Node.js](https://nodejs.org)
* [Karma](https://karma-runner.github.io/latest/index.html)
  * [jasmine-snapshot](https://www.npmjs.com/package/jasmine-snapshot)
* NPM modules
  * [Moment](https://momentjs.com/docs/)
  * [Lodash](https://lodash.com/docs/4.17.11)

## Install

1) Pull this repository

2) Download and install Node 10.15.0 or higher

3) Globablly install ionic (https://ionicframework.com/getting-started#cli)
```
npm install -g ionic
```
3) Install all npm modules
```
$ npm install
```

5) (Optional) Download the IonicDev mobile app

## Local Development

1) Navigate to project directory
```
$ ionic serve
```

2) View application at [http://localhost:8100](http://http://localhost:8100)


## Deployment

1) Navigate to project directory
```
$ ionic capacitor copy android
```

2) Open `./android` in Android Studio

3) Go to Build > Generate Signed Bundle / API...

4) Select *APK* option

5) Setup a keystore

6) Select `release` and `V2 full signature`

7) Move API to phone with file transer

8) Open and install on phone

## Conventions

* CSS - BEM (https://css-tricks.com/bem-101/)

## Contributing Guide

Reach out to me.

## To Do

- [x] Switch Activity Screen
- [x] Ionic APK Build
- [x] Review Activities Screen
- [x] Add icons https://www.joshmorony.com/adding-icons-splash-screens-launch-images-to-capacitor-projects/
- [ ] Activity Summary Screen
- [ ] Improved Review Activities Screen
- [ ] Notification Bar Easy Entry
- [ ] (Review Screen) Push to X by 2 task tracking
- [x] User configure activity types
- [x] CI/CD configuration with Ionic AppFlow
- [ ] Set slack status
- [ ] Import Outlook Calendar data

## Contributors

[Jeff Sallans](https://github.com/JeffSallans)
