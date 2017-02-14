# DiAM - Digital Asset Manager

## Requirements
- Node.js
- Homebrew
- MongoDB

## Setup
To set up the local development environment run:
```
# Clone the repository
git clone https://github.com/tapiwan/dam-on14.git

# Change directory
cd dam-on14

# Intall NPM modules
npm install

# Install nodemon
npm install nodemon -g

# Install exiftool (Homebrew required)
brew install exiftool
```
## Starting Mongo Daemon
To start the mongo daemon run:
```
mongod
```
## Starting the app
To start the app run:
```
npm start
```
Make sure that your MongoDB is up and running.

## Troubleshooting
- On windows machines the module ``sharp`` will potentially not compile properly and lead to an error. Make sure that you have a 64-bit machine and that your Node.js is also the 64-bit version. If it still doesn't work, check the [Sharp](http://sharp.dimens.io/en/stable/) documentation.
- Ìf the asset upload fails for some reason check the console. Maybe ``brew install exiftool`` wasn't run. You might need to install the proper exiftool version for your machine. Check the [exiftool](http://owl.phy.queensu.ca/~phil/exiftool/) website.

