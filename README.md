# DiAM - Digital Asset Manager

## Requirements
- Node.js
- Homebrew
- MongoDB

## Setup
To set up the local development environment run:
```
git clone https://github.com/tapiwan/dam-on14.git
npm install
brew install exiftool
```

## Starting the app
To start the app run:
```
npm start
```

## Troubleshooting
- On windows machines the module ```sharp`` will potentially not compile properly and lead to an error.
- Ìf the asset upload fails for some reason check the console. Maybe ```brew install exiftool``` wasn't run.

