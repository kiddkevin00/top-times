# TopTimes

This is a web application for TopTimes, maintained by _Marcus Hsu_. This repository is separated in 2 parts:

1. Backend core server: All the codes are in /backend-core folder. Please refer to the README in _/backend-core/README.md_ for all the information related to the backend core server.
2. Frontend core server: The codes are in the rest of the files under this folder. This README documents all the information related to the frontend core server

## Goal of the repository
To house a react/redux application for end user experience.

## Getting started
1. `npm install`
2. `npm start`
3. Navigate to the browser where webpack development server is running at [http://localhost:8088](http://localhost:8088)

## Contributing
### Pull Requests (Step-by-Step Process)
  * Pull requests should be made to the master branch
  * The change in the pull request should not contain package version bump until the pull request is approved
  * All commits should pass the pre-push hook which can be ran with `npm run prepush`. It should be automatically run when you run `git push`; it is setup after you run `npm install`
  * Pull requests should not be merged if any of the comments addressed by peer review is still not resolved
  * Make sure the pull request is always up-to-date with master branch by running `git pull -r origin master` even during the peer review interval. Follow the response in command line to finish the rebase pull (if there is a conflict, then solve the conflict by modifying the codes and run `git add .; git rebase --continue` to continue)
  * After peer review is done and the pull request is approved, all the commits in the pull request can now be squashed into one commit using `git rebase -i HEAD~10` or a similar git strategy. Hence, there should be only one commit for the pull request at this point
  * The commit message should be in this format: `<ticket number where applicable>: Useful commit message in the imperative and present tense`
  * Now, you can bump the package version by simply running `npm version patch`. This command will generate a commit message in the format of `X.X.X` and tag the version for you
  * Whenever there is a commit history change caused by either `git pull -r` or `git rebase -i`, force push to your branch with `-f` option
  * Make sure you should only have 2 commits in your pull request; then you are good to merge to your pull request

### Unit Tests
  * We use [jest](https://facebook.github.io/jest/) and [enzyme](https://github.com/airbnb/enzyme/blob/master/docs/guides/jest.md)
  * There is a strict coverage rule in this repository provided by [istanbul](https://github.com/gotwarlost/istanbul)
  * All commits are subject to be passing all the coverage thresholds, including `jest snapshot` comparison testing

### Linting
  * Javascript is subject to [airbnb](https://www.npmjs.com/package/eslint-config-airbnb) eslint rules and [prettier](https://prettier.io/) formatting rules
  * SCSS is subject to [stylelint](https://github.com/stylelint/stylelint) rules

### Author
  * Marcus Hsu
