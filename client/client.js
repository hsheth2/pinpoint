var lastPos = {
    lng: 0,
    lat: 0
};

setInterval(function() {
    if (Meteor.user()) {
        var pos = Geolocation.latLng();

        if (pos) {
            if (pos.lng !== lastPos.lng || pos.lat !== lastPos.lat) {
                console.log("updating pos: " + pos.lat + "," + pos.lng);
                Meteor.call('updatePos', pos);
            }
        }
        else {
            console.log("ERR-POSITION IS NULL");
        }
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
        console.log(this);
    },
    'distTo': function(pos) {
        var myPos = Geolocation.latLng();
        if (myPos) {
            var myFixedLoc = {
                latitude: myPos.lat,
                longitude: myPos.lng
            };
            var fixedLoc = {
                latitude: pos.lat,
                longitude: pos.lng
            };
            return geolib.getDistance(myFixedLoc, fixedLoc);
        }
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
        Session.set("angle", heading.trueHeading)
    };

    Template.myTemplate.helpers({
        angle: function() {
            return Session.get("angle");
        }
    });

    function compassError(error) {
        console.log('compass error ' + error.code);
    };

    Template.arrow.onDestroyed(function() {
        navigator.compass.clearWatch(Session.get("compassWatcher"));
    });
}