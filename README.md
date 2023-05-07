# Worker Demo

## Introduction

The aim of this sample project is to show how workers could be used to implement a typical offline
application problem.

This kind of problem is very common in mobile apps, desktop apps or even in PWA, in fact whenever you
want your customer to store data in a persistent way, but you're not very sure whether remote server
is available or not.

This example tries to be as simple as possible, that means that there is no REDUX involved. Persistency involves
local IndexedDB (using Dexie as a high-level API) and workers which are responsible for communicating with
the remote server.

This example only includes frontend code, at the present moment there isn't any backend.

## Structure

This app is structured into three main folders:

* `src/storage`: All logic and local persistence models are implemented in this folder. I've tried to implement a common infrastructure, independent of actual model and data. Using this approach, could allow you to use it in any of your projects.
* `src/workers`: All logic related to worker support, and a hook intended to make easier how worker could be used from your app
* `src/app`: Sample APP (very simple indeed) using `storage` and `worker` common logic.

## Testing

Tests are provided for storage and workers code, demo app hasn't got its own tests.

## Available scripts
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
