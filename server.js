var config = require('./config'); 
var test = require('./tests/run-tests');
var gf = require('./generic_functions'); 
var bodyParser = require('body-parser'); 
var express = require('express'),
    party = require('./routes/parties');
    
var app = express();

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/parties/add', party.addParty);
app.get('/parties/uniqueName/:id', party.uniqueName);
app.get('/parties/requiresPin/:id', party.requiresPin);

app.put('/parties/:id/updatePlaylist', party.updatePlaylist);
app.put('/parties/:id/updateNowPlaying', party.updateNowPlaying);
app.put('/parties/:id/joinParty', party.joinParty);
app.put('/parties/:id/leaveParty', party.leaveParty);
app.put('/parties/:id/requestSong', party.requestSong);
app.put('/parties/:id/voteSong', party.voteSong);
app.get('/parties/:id/getInfo', party.getInfo);

app.get('/dev/all', party.findAll);
app.get('/dev/:id', party.findById);
app.put('/dev/update/:id', party.updateParty);
app.delete('/dev/delete/:id', party.deleteParty);

app.listen(config.serverPort);
gf.log('Server up and listening on port ' + config.serverPort + '...')
