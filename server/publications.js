Meteor.publish("inRange", function() {
    if(!this.userId) return [];
    var user = Meteor.users.findOne(this.userId);
    console.log("inRange for:"+user.username);
    if(user && user.profile.follow) {
        var myLoc = user.profile.lastPos;
        var myFixedLoc = {latitude: myLoc.lat, longitude: myLoc.lng};
        //find users whose ids are in user.profile.friends and geolib.getDistance(start, end) < 100
        //find all following
        
        
        /*return Meteor.users.find({_id: {$in: user.profile.follow}, $where: function() {
            var lastLoc = this.profile.lastPos;
            var fixedLoc = {latitude: lastLoc.lat, longitude: lastLoc.lng};
            var distance = geolib.getDistance(myFixedLoc, fixedLoc, 1, 8);
            return distance < 50;
        }}, {fields: {'username': 1, 'profile.lastPos': 1}  });*/
        
        return Meteor.users.find({_id: {$in: user.profile.follow}});
    }
    return [];
});