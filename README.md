## Sigh
For unexpected and unanticipated reasons, songkick has revoked my API key. I have written to them and they will not reinstate it and/or tell me why.
So this codebase is unfortunately worthless without that API key. 
So unfortunately the website no longer works.


This app is designed for the _exploration_ of music. 
It allows you to make a playlist from artists that will be coming to see you. 
It is more for a user that doesnt have a band or artist in mind, but rather knows they would like to go out on Saturday and wants to sample the music playing on Saturday. Its also good for traveling.

See progress here --> [https://www.showmemusic.live/](https://www.showmemusic.live/)


## Getting Started
In order to deploy this project locally, you will need to have vercel installed and enviornment variables configured.

## Typescript Configuration
In order to use spotify types, we are using [@types/spotify-api](https://www.npmjs.com/package/@types/spotify-api). This unfortunately does not export the types as a module. So for now, we are copying an pasting the type definitions into our project. Not ideal, but ok for now.

See https://github.com/gecko25/show-me-the-music/issues/14


## Enviroment variables
We use the following environent variables:
- SONGKICK_KEY
- SPOTIFY_CLIENT_SECRET
- SPOTIFY_CLIENT_ID

In order to run on localhost, you will need a `.env` file with those environment variables.
In order to run continuous integration tests, you will need to add each environment variable as a repository secret in the repo settings (Repo settings --> Secrets --> Repository secrets)
In order to deploy to vercel, you will need to add them in the Project Settings. (Settings --> Environment Variables)


## Running Tests
We are using cypress continous integration tests. Everytime you commit to a pull request, the tests will run. 
Note, again, in order to run cypress tests using github actions, you will need to add environment variables as a repository secret.

To run tests:

```yarn cypress```


## Deploying

You can deploy to a staging url by running the following commands:

```bash
now
```

This will stage your app at: [https://show-me-the-music-saratankard.vercel.app/](https://show-me-the-music-saratankard.vercel.app)

To deploy to production, you can deploy using two methods:

1. pushing to the `master` branch
2. running the command

```bash
now --prod
```

## Linting & Type Checkings
Linting is automatically done using prettier and husky. 
In order to check types for now you will need to manually run (TODO: Automate this)
```
yarn ts
```


