# LearnOps Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `docker-compose up`

Runs the app in the container.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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

## Available Tools

### Prettier & ESLint

This project uses a combination of **Prettier** and **ESLint** rules to enforce a consistent code styling, so be sure to have these libraries enabled for this project

### Tailwindcss

Instead of relying on (S)CSS stylesheets, we're using Tailwindcss to style the application; this provides us with some nice CSS resets, a set of responsive utilities, and it also allows us to use the base styling we set up for the Design System

### Synapse's Design System

The goal is to maximize the use of the Design System we'll be building, to provide a consisten design language and have a single source of thruth for UI/UX specifications

### AWS Amplify

We use [AWS Amplify](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html) to interact with Cognito for authenitcation

### Technical considerations

* All imports under `src` can be absolutely imported; for example, if you have a component in `./src/Atoms/Foo/Foo.tsx` and want to use it anywhere in the app, you can use `import Foo from 'Atoms/Foo/Foo';` anywhere and it will work
* **Atomic Design**: Try to create all your components following the Atomic Design pattern we used for the Design System, this can help us avoid having components too nested in the code
* All text used in the application should come from a language file (currently `en.json`), there should be no text hard coded in the components
