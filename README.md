# TopTimes

This is a web application for TopTimes, maintained by _Marcus Hsu_. This repository is separated in 2 parts:

1. Backend Server: All the codes are in /backend-core folder. Please refer to the README in _/backend-core/README.md_ for all the information related to backend.
2. Frontend Server: The codes are in the rest of the files under this directory. This README documents all the information related to frontend.

## Goal of the repository
To house a react/redux application for end user experience.

## Getting started
1. `$ npm install`
2. `$ npm run dev`
3. Navigate to your preferred browser where webpack development server is running at [http://localhost:8088](http://localhost:8088)

## Contributing
### Unit Tests
  * Run all the tests and show the test coverage report: `$ npm run test`
  * Use [Jest](https://facebook.github.io/jest/) and [Enzyme](https://github.com/airbnb/enzyme/blob/master/docs/guides/jest.md) for the unit testing framework
  * There is a strict coverage rule in this repository provided by [Jest](https://facebook.github.io/jest/)
  * All commits are subject to pass all the coverage thresholds, including Jest snapshot comparison testing

### Linting
  * Run the latest coding standard check: `$ npm run lint`
  * Javascript is subject to [airbnb](https://www.npmjs.com/package/eslint-config-airbnb) eslint rules and [prettier](https://prettier.io/) formatting rules
  * SCSS is subject to [stylelint](https://github.com/stylelint/stylelint) rules

### Author
  * Marcus Hsu
