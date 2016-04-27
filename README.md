# Spartify-Backend

To install:
- install node + npm
- install mongodb
- checkout code to a directory
- in directory run 'npm install'

To run server :
- run 'mongo' to see if mongo is running,
  - if not run 'npm run mongo'
- run 'npm start'


## API Docs
### Development functions
#### GET:/dev/:id
Development function for getting a JSON representing the party with :id

#### GET:/dev/all
Development function for getting a JSON representing all of the parties info

#### PUT:/dev/update/:id
Development function for updating an entire party by sending a JSON in the body

#### DELETE:/dev/delete/:id
Development function for deleting an entire party

### Production functions
#### POST:/parties/add
Adds an entire party from a JSON in the body

#### GET:/parties/uniqueName/:id
Gets a boolean value true if the :id available for use and false if it is not

#### PUT:/parties/:id/updatePlaylist
Updates the playlist for the party :id, pass this an array of song JSONs, overwrites the current playlist

#### PUT:/parties/:id/updateNowPlaying
Updates the currently playing song in the playlist for the party :id, pass in a JSON including the URI for the song to play now.
 
#### GET:/parties/requiresPin/:id
Returns a boolean dipicting whether a pin is required or not.

#### PUT:/parties/:id/joinParty
Adds a user to party :id, user is defined by a property called guestName in a JSON

#### PUT:/parties/:id/leaveParty
Removes a user from a party :id, user is defined by a property called guestName in a JSON

Host actions:
+ Check name is unique
+ Create party
- Update playlist
- Update now-playing song

Guest Actions:
- Check if name requires Pin
- Join Party
- request song
- vote on song
- Get current party details

