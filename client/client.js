setInterval(function() {
    if (Meteor.user()) {
        navigator.geolocation.getCurrentPosition(
            function(pos) {
                var p = {latitude: pos.coords.latitude, longitude: pos.coords.longitude};
                                console.log(p);
                //console.log("updating pos: " + p.latitude + "," + p.longitude);
                Session.set('pos', p);
                Meteor.call('updatePos', {lat:p.latitude, lng: p.longitude});
            },
            function() {
               console.log('Position could not be determined.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
}, 3000);

Template.follow.events({
    'click #follow-button': function(event) {
        var username = $("#follow-user").val();
        Meteor.call('follow', username, function(err, result) {
            if (result) {
                console.log("followed user!");
            }
            else {
                console.log("sorry no");
            }
        });
    },
    'keyup #follow-user': function(e) {
        console.log('checking username');
        var username = $("#follow-user").val();
        Meteor.call("exists", username, function(error, result) {
            console.log("exists result: " + result);
            if (result) {
                $("#follow-button").prop("disabled", false);
            }
            else {
                $("#follow-button").prop("disabled", true);
            }
        });
    }
});

Template.index.helpers({
    'numNearby': function() {
        return Meteor.users.find({}).count()-1;
    }
});

Template.list.helpers({
    'inRange': function() {
        if (Meteor.user() && Meteor.user().profile.lastPos && Meteor.user().profile.follow) {
            return Meteor.users.find({
                _id: {
                    $ne: Meteor.userId()
                }
            });
        }
        return null;
    },
    'printContext': function() {
        //console.log(this);
    },
    'distTo': function(pos) {
        var myPos = Session.get('pos');
        if (myPos) {
            var fixedLoc = {
                latitude: pos.lat,
                longitude: pos.lng
            };
            //console.log(fixedLoc);
            //console.log(myPos);
            return geolib.getDistance(myPos, fixedLoc, 1, 8);
        }
    },
    'friendlyDist': function(pos) {
        var myPos = Session.get('pos');
        if (myPos) {
            var fixedLoc = {
                latitude: pos.lat,
                longitude: pos.lng
            };
            var dist = geolib.getDistance(myPos, fixedLoc, 1, 8);
            
            if(dist<15) return '<p class="text-success">Very close! (<15m)</p>';
            if(dist>=15 && dist<50) return '<p class="text-warning">Somewhat close... (~'+ (5*Math.round(dist/5))+'m)</p>';
            else return '<p class="text-danger">Far away (~'+ (5*Math.round(dist/5))+'m)</p>';
        }
    },
    'cleanCoord': function(coord) {
        if(coord)
        return coord.toFixed(6);
    },
    'latPos': function() {
        var pos = Session.get('pos');
        if(pos) return pos.latitude;
    },
    'lngPos': function() {
        var pos = Session.get('pos');
        if(pos) return pos.longitude;
    }
});
if (Meteor.isCordova) {
    Template.arrow.onCreated(function() {
        var watchID = navigator.compass.watchHeading(compassSuccess, compassError, {
            frequency: 20
        });
        Session.set("compassWatcher", watchID);
    });

    function compassSuccess(heading) {
        console.log("angle: " + heading.trueHeading);
        Session.set("angle", heading.trueHeading);
        Session.set("logs", Session.get("logs") + " succeeded ");
    };

    Template.arrow.helpers({
        angle: function() {
            return Session.get("angle");
        },
        
        logs: function() {
            return Session.get("logs");
        }
    });

    function compassError(error) {
        Session.set("logs", Session.get("logs") + error.code);
    };

    Template.arrow.onDestroyed(function() {
        navigator.compass.clearWatch(Session.get("compassWatcher"));
    });
}

Template.applicationLayout.onCreated(function(){
    var title = $("#title").text();
    if (title) {
        $("#page-title").text(title)
    }
});

Meteor.startup(function() {
   if(Meteor.isCordova) {
        Session.set("logs", "isCord");
   }  else {
       Session.set("logs", "isNotCordova");
   }
});