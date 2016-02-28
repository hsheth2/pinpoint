Meteor.publish("inRange", function() {
    if(!this.userId) return [];
    var user = Meteor.users.findOne(this.userId);
    if(user && user.profile.follow) {
        var myLoc = user.profile.lastPos;
        var myFixedLoc = {latitude: myLoc.lat, longitude: myLoc.lng};
        //find users whose ids are in user.profile.friends and geolib.getDistance(start, end) < 100
        //find all following
        
        
        return Meteor.users.find({_id: {$in: user.profile.follow}, $where: function() {
            var lastLoc = this.profile.lastPos;
            var fixedLoc = {latitude: lastLoc.lat, longitude: lastLoc.lng};
            var distance = geolib.getDistance(myFixedLoc, fixedLoc);
            return distance < 15;
        }}, {fields: {'username': 1, 'profile.lastPos': 1}  });
    }
    return [];
});