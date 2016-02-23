# tracker
A tracker for the P2PSP live streaming system.

# Install

Run `npm install` in order to install the tracker and its dependencies.

# Run

Run `npm start` in order to start the local server

or

Run `npm run watch` in order to start the local server and listen to changes in code to restart the server again.

**Note:** Default PORT is 8080.

# API

The API is located under `/api`

## /channels

* `GET` - Obtains the list of channels
* `PUT` - Creates a new channel 

## /channels/:id

* `GET` - Obtains the details of `id` channel

The results are currently returned using the JSON format.
