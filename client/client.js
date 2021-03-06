Meteor.startup(function() {
    //Session.set('pos', {latitude: 0, longitude: 0});
});


setInterval(function() {
    if (Meteor.user()) {
        navigator.geolocation.getCurrentPosition(
            function(pos) {
                var p = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };
                //console.log(p);
                //console.log("updating pos: " + p.latitude + "," + p.longitude);
                Session.set('pos', p);
                Meteor.call('updatePos', {
                    lat: p.latitude,
                    lng: p.longitude
                });
            },
            function() {
                console.log('Position could not be determined.');
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
}, 3000);

Template.follow.events({
    /*'click #follow-button': function(event) {
        var username = $("#follow-user").val();
        Meteor.call('follow', username, function(err, result) {
            if (result) {
                console.log("followed user!");
            }
            else {
                console.log("sorry no");
            }
        });
    },*/
    'submit #follow-form': function(e) {
        e.preventDefault();
        var username = $("#follow-user").val();
        var followcode = $("#follow-code").val();
        console.log("request to follow user: " + username);
        Meteor.call('follow', username, followcode, function(err, result) {
            if (err) console.log(err);
            if (result) {
                console.log("followed user!");
                FlowRouter.go('/list')
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
        return Meteor.users.find({}).count() - 1;
    },
    'numFriends': function() {
        if (!Meteor.user()) return 0;
        return Meteor.user().profile.follow.length;
    },
    'friendCode': function() {
        if(!Meteor.user()) return "Loading...";
        return Meteor.userId().substr(0,5);
    }
});

Template.list.helpers({
    'inRange': function() {
        if (Meteor.user() && Meteor.user().profile.lastPos && Meteor.user().profile.follow) {
            var myPos = Session.get('pos');
            if (myPos) {
                var users = Meteor.users.find({
                    _id: {
                        $ne: Meteor.userId()
                    }
                }).fetch();
                users.forEach(function(u) {
                    var fixedLoc = {
                        latitude: u.profile.lastPos.lat,
                        longitude: u.profile.lastPos.lng
                    };
                    u.distTo = geolib.getDistance(myPos, fixedLoc, 1, 8);
                });
                users.sort(function(a, b) {
                    return a.distTo - b.distTo;
                });
                return users;
            }
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
    'shouldDisp': function(pos) {
        var myPos = Session.get('pos');
        if (myPos) {
            var fixedLoc = {
                latitude: pos.lat,
                longitude: pos.lng
            };
            //console.log(fixedLoc);
            //console.log(myPos);
            var dist = geolib.getDistance(myPos, fixedLoc, 1, 8);

            return dist >= 15;
        }
        return false;
    },
    'friendlyDist': function(pos) {
        var myPos = Session.get('pos');
        if (myPos) {
            var fixedLoc = {
                latitude: pos.lat,
                longitude: pos.lng
            };
            var dist = geolib.getDistance(myPos, fixedLoc, 1, 8);

            if (dist < 15) return '<p class="text-success">Very close! (<15m)</p>';
            if (dist >= 15 && dist < 50) return '<p class="text-warning">Somewhat close... (~' + (5 * Math.round(dist / 5)) + 'm)</p>';
            else return '<p class="text-danger">Far away (~' + (5 * Math.round(dist / 5)) + 'm)</p>';
        }
    },
    'cleanCoord': function(coord) {
        if (coord)
            return coord.toFixed(6);
    },
    'latPos': function() {
        var pos = Session.get('pos');
        if (pos) return pos.latitude;
    },
    'lngPos': function() {
        var pos = Session.get('pos');
        if (pos) return pos.longitude;
    },
    'logs': function() {
        return Session.get('logs');
    }
});

if (Meteor.isCordova) {
    Template.navbar.events({
        'click .nav a': function(e) {
            $('.navbar-toggle').click();
        }
    });

    Template.list.onCreated(function() {
        var watchID = navigator.compass.watchHeading(compassSuccess, compassError, {
            frequency: 20
        });
        Session.set("compassWatcher", watchID);
    });

    Template.arrow.onCreated(function() {
        Template.instance().angle = new ReactiveVar(0);
    });

    function compassSuccess(heading) {
        console.log("angle: " + heading.magneticHeading);
        Session.set("angle", heading.magneticHeading);
    };

    Template.arrow.helpers({
        angle: function() {
            return Session.get("angle");
        },

        logs: function() {
            return Session.get('angle') - Session.get('pos').latitude + " " + Session.get('pos').longitude + " " + Template.currentData().lastPos.lat + " " + Template.currentData().lastPos.lng;
        },

        angleArrow: function() {
            console.log("start of angleArrow helper");

            function bearing(lat1, lng1, lat2, lng2) {
                var dLon = (lng2 - lng1);
                var y = Math.sin(dLon) * Math.cos(lat2);
                var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                var brng = _toDeg(Math.atan2(y, x));
                return 360 - ((brng + 360) % 360);
            }

            /**
             * Since not all browsers implement this we have our own utility that will
             * convert from degrees into radians
             *
             * @param deg - The degrees to be converted into radians
             * @return radians
             */
            function _toRad(deg) {
                return deg * Math.PI / 180;
            }

            /**
             * Since not all browsers implement this we have our own utility that wi ll
             * convert from radians into degrees
             *
             * @param rad - The radians to be converted into degrees
             * @return degrees
             */
            function _toDeg(rad) {
                return rad * 180 / Math.PI;
            }
            //Template.instance().data.lastPos;
            var angle = Session.get('angle');
            var place = Session.get('pos');
            var bear = -bearing(place.latitude, place.longitude, Template.currentData().lastPos.lat, Template.currentData().lastPos.lng);
            Session.set('logs', angle + " bear: " + bear);
            var b = bear - angle;
            return b;
        }
    });

    function compassError(error) {
        // Session.set("logs", Session.get("logs") + error.code);
    }

    Template.list.onDestroyed(function() {
        navigator.compass.clearWatch(Session.get("compassWatcher"));
    });
}
else {
    Template.arrow.helpers({
        angleArrow: function() {
            function bearing(lat1, lng1, lat2, lng2) {
                var dLon = (lng2 - lng1);
                var y = Math.sin(dLon) * Math.cos(lat2);
                var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                var brng = _toDeg(Math.atan2(y, x));
                return 360 - ((brng + 360) % 360);
            }

            /**
             * Since not all browsers implement this we have our own utility that will
             * convert from degrees into radians
             *
             * @param deg - The degrees to be converted into radians
             * @return radians
             */
            function _toRad(deg) {
                return deg * Math.PI / 180;
            }

            /**
             * Since not all browsers implement this we have our own utility that wi ll
             * convert from radians into degrees
             *
             * @param rad - The radians to be converted into degrees
             * @return degrees
             */
            function _toDeg(rad) {
                return rad * 180 / Math.PI;
            }
            //Template.instance().data.lastPos;
            var place = Session.get('pos');
            var bear = -bearing(place.latitude, place.longitude, Template.currentData().lastPos.lat, Template.currentData().lastPos.lng);
            Session.set('logs', "bear: " + bear);
            return bear;
        }
    });
}

var setPageTitle = function setPageTitle() { // TODO remove this
    var title = $("#title").text();
    console.log("Title is " + title);
    $("#page-title").text(title);
};

Meteor.startup(function() {
    if (Meteor.isCordova) {
        Session.set("logs", "isCord");
    }
    else {
        Session.set("logs", "isNotCordova");
    }
});