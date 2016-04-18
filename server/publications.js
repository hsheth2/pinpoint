Meteor.publish("inRange", function() {
    if (!this.userId) return [];

    //console.log("inRange publish..");
    /*Meteor.users.findOne({_id: this.userId}, function(err, user) {
        console.log("inside findone");
        if(!err) {
            if(user && user.profile.lastPos) {
                var myLoc = user.profile.lastPos;
                var myFixedLoc = {latitude: myLoc.lat, longitude: myLoc.lng};
                
                
                /*return Meteor.users.find({_id: {$in: user.profile.follow}, $where: function() {
            var lastLoc = this.profile.lastPos;
            var fixedLoc = {latitude: lastLoc.lat, longitude: lastLoc.lng};
            var distance = geolib.getDistance(myFixedLoc, fixedLoc, 1, 8);
            return distance < 50;
        }}, {fields: {'username': 1, 'profile.lastPos': 1}  });
                
                return Meteor.users.find({_id: {$in: user.profile.follow}})
            }
        }
    });*/

    // return Meteor.users.find({});
    var user = this.userId;
    if (user) {
        var userObj = Meteor.users.findOne({
            _id: user
        });
        if(!userObj) return [];
        var follow = userObj.profile.follow;
        if(!follow) return [];
        
        var myLoc = userObj.profile.lastPos;
        var myFixedLoc = {
            latitude: myLoc.lat,
            longitude: myLoc.lng
        };
        //find users whose ids are in user.profile.friends and geolib.getDistance(start, end) < 100
        //find all following


        return Meteor.users.find({
            _id: {
                $in: follow
            },
            $where: function() {
                var lastLoc = this.profile.lastPos;
                var fixedLoc = {
                    latitude: lastLoc.lat,
                    longitude: lastLoc.lng
                };
                var distance = geolib.getDistance(myFixedLoc, fixedLoc, 1, 8);
                return distance < 500;
                //return true; // TODO fix this later
            }
        }, {
            fields: {
                'username': 1,
                'profile.lastPos': 1
            }
        });
    }
    return [];
});
