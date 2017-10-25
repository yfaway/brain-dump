# brain-dump
## Set up Development Environment
1. Checkout this Git project.
2. Change to the project folder, ./brain-dump.
3. Install [Gas](https://www.npmjs.com/package/google-apps-script) by running
   `npm i -g google-apps-script`
4. Run: `gas auth`
5. Run: `gas list` to find the list of script projects on Google Drive
6. While in ./brain-dump, run `gas link <projectName|projectId>`
7. gas link will overwrite the current folder content with whatever currently
   in the Google Drive script project, we need to undo that using
   `git reset --hard HEAD`

After a change has been made locally, the change can be sync'ed up with the 
Google Drive project by runing `gas push`.
 
## Running the Unit Tests
While in ./brain-dump, install the following modules:
```
npm install --save-dev mocha
npm install --save-dev chai
npm install --save-dev sinon
```

Run the tests using `npm test`.
