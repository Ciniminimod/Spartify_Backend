var mongo = require('mongodb');
var gf = require('../generic_functions');
var _ = require('lodash');

var Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('partydb', server);

db.open(function(err, db) {
    if(!err) {
        gf.log("Connected to 'partydb' database");
        db.collection('parties', {strict:true}, function(err, collection) {
            if (err) {
                gf.log("Cannot find the 'parties' collection.");
            }
        });
    }
});


// GET:/dev/:id
exports.findById = function(req, res) {
    var id = req.params.id;
    db.collection('parties', function(err, collection) {
        if (err) {
            throw err;
        } else {
            collection.findOne({'_id': id}, function(err, item) {
                res.send(item);
            });
        }
    });
};

// GET:/dev/all
exports.findAll = function(req, res) {
    db.collection('parties', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

// PUT:/dev/update/:id
exports.updateParty = function(req, res) {
    var id = req.params.id;
    var party = req.body;
    db.collection('parties', function(err, collection) {
        collection.update({'_id': id}, party, {safe:true}, function(err, result) {
            if (err) {
                throw err;
            } else {
                gf.log('' + result + ' document(s) updated');
                res.send(party);
            }
        });
    });
};

// DELETE:/dev/delete/:id
exports.deleteParty = function(req, res) {
    var id = req.params.id;
    gf.log('Deleting party: ' + id);
    db.collection('parties', function(err, collection) {        
        collection.remove({'_id': id}, {safe:true}, function(err, result) {
            if (err) {
                throw err;
            } else {
                gf.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};


// POST:/parties/add
exports.addParty = function(req, res) {
    var party = req.body;
    gf.log('Adding party: ' + party._id);
    db.collection('parties', function(err, collection) {
        collection.insert(party, {safe:true}, function(err, result) {
            if (err) {
                gf.log('Failed to add ' + party._id)
                res.send({'error':'An error has occurred ' + err});
            } else {
                gf.log('Successfully added ' + party._id);
                res.send(result[0]);
            }
        });
    });
};

// GET:/parties/uniqueName/:id
exports.uniqueName = function(req, res) {
    var id = req.params.id;
    db.collection('parties', function(err, collection) {
        if (err) {
            throw err;
        } else {
            collection.findOne({'_id': id}, function(err, item) {
                if (item == null)
                {
                    res.send(true);
                }
                else
                {
                    res.send(false);
                }
            });
        }
    });
};

// PUT:/parties/:id/updatePlaylist
exports.updatePlaylist = function(req, res) {
    var id = req.params.id;
    var playlistToSet = req.body;
    db.collection('parties', function(err, collection) {
        collection.update(
            {'_id': id}, 
            {$set :{ playlist : playlistToSet }}, 
            {safe:true},            
            function(err, result) {
                if (err) {
                    gf.log('Error updating playlist: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    gf.log('' + result + ' document(s) updated');
                    res.send(playlistToSet);
                }
            }
        );
    });
};

// PUT:/parties/:id/updateNowPlaying
exports.updateNowPlaying = function(req, res) {
    var id = req.params.id;
    var songToPlay = req.body;
    var currentPlaylist = {};
    db.collection('parties', function(err, collection) {
        if (err) {
            throw err;
        } else {
            collection.findOne({'_id': id}, function(err, item) {
                
                // NOTE: Collection.findOne is ASync hence this is all nested.
                currentPlaylist = item.playlist;
                
                if (typeof currentPlaylist === 'undefined' || currentPlaylist.length < 1)
                {
                    throw Error('No playlist found, please set a playlist before updating Now Playing.');    
                }
            
                // delete the old now playing and change status of new now playing
                for (var i=0; i < currentPlaylist.length; i++)
                {
                    gf.log('current: ' + currentPlaylist[i].uri);
                    gf.log('song: ' + songToPlay.uri);
                    if (currentPlaylist[i].uri === songToPlay.uri)
                    {
                        currentPlaylist[i].status = 'now playing';
                    }    
                    else if (currentPlaylist[i].status == 'now playing')
                    {
                        // splice(x,y) removes y elements starting at index x 
                        currentPlaylist.splice(i, 1);
                    }    
                }
                
                collection.update(
                    {'_id': id}, 
                    {$set :{ playlist : currentPlaylist }}, 
                    {safe:true},            
                    function(err, result) {
                        if (err) {
                            gf.log('Error updating playlist: ' + err);
                            res.send({'error':'An error has occurred'});
                        } else {
                            gf.log('' + result + ' document(s) updated');
                            res.send(currentPlaylist);
                        }
                    }
                );                 
            });            
    }});
};

// GET:/parties/requiresPin/:id
exports.requiresPin = function(req, res) {
    var id = req.params.id;
    db.collection('parties', function(err, collection) {
        if (err) {
            res.send('An error has occured: Could not determine Pin status.')
        } else {
            collection.findOne({'_id': id}, function(err, item) {
                var requiresPin = item.pinRequired;
                res.send(requiresPin);
            });
        }
    });
};

// PUT:/parties/:id/joinParty
exports.joinParty = function(req, res) {
    var id = req.params.id;
    var userToAdd = req.body;
    var allGuests = {};
    db.collection('parties', function(err, collection) {
        if (err) {
            throw err;
        } else {
            collection.findOne({'_id': id}, function(err, item) {
                allGuests = item;               
                
                if (_.includes(allGuests.guests, userToAdd.guestName))
                {
                    res.send('Guest already exists');
                }
                else
                {
                    allGuests.guests.push(userToAdd.guestName);
                    
                    collection.update(
                        {'_id': id}, 
                        {$set :{ guests : allGuests.guests }}, 
                        {safe:true},            
                        function(err, result) {
                            if (err) {
                                gf.log('Error updating guests: ' + err);
                                res.send({'error':'An error has occurred'});
                            } else {
                                gf.log('' + result + ' document(s) updated');
                                res.send(item.guests);
                            }
                        }
                    );
                }
                
            });
        }
    });
};

// PUT:/parties/:id/leaveParty
exports.leaveParty = function(req, res) {
    var id = req.params.id;
    var userToRemove = req.body;
    var allGuests = {};
    db.collection('parties', function(err, collection) {
        if (err) {
            throw err;
        } else {
            collection.findOne({'_id': id}, function(err, item) {
                allGuests = item;                
                
                if (_.includes(allGuests.guests, userToRemove.guestName))
                {
                    _.pull(allGuests.guests, userToRemove.guestName);
                    
                    collection.update(
                        {'_id': id}, 
                        {$set :{ guests : allGuests.guests }}, 
                        {safe:true},            
                        function(err, result) {
                            if (err) {
                                gf.log('Error updating guests: ' + err);
                                res.send({'error':'An error has occurred'});
                            } else {
                                gf.log('' + result + ' document(s) updated');
                                res.send(item.guests);
                            }
                        }
                    );
                }
                else
                {
                    res.send('Guest does not exist.');
                }                
            });
        }
    });
};

// PUT:/parties/:id/requestSong
exports.requestSong = function(req, res) {

};

// PUT:/parties/:id/voteSong
exports.voteSong = function(req, res) {

};

// GET:/parties/:id/getInfo
exports.getInfo = function(req, res) {

};