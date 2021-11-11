## Today I Learned

I use this project as a space to learn and explore new toys. This is a summary of what I did and have learned

Prettify and Eslint

Personal Access Tokens in Git

Cypress CI

Setting up Environment Variables for Github Actions
I wanted to use continous integration for cypress tests, but ran into difficulties bc I couldnt use my secret api key.

In order to use environment variables in your _code_ for CI, you need to add your secrets to github:
!Important! You must add the secret as a _repository secret_ and not an environment secret.
https://github.com/gecko25/show-me-the-music/settings/secrets/actions
https://github.com/facebook/create-react-app/discussions/9064

To use cypress environment variables in _tests_ use cypress env variables
https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/
