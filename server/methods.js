Meteor.methods({
    updatePos: function(pos) {
        if(Meteor.user()) {
            pos.time = Date.now();
            Meteor.users.update(Meteor.userId(), {$set: {'profile.lastPos': pos}});
            //console.log("user pos updated.");
        }
    },
    
    exists: function(name) {
        console.log('calling exists with name=' + name);
      if(Meteor.user()) {
          var exists = Meteor.users.findOne({"username": name});
          console.log(JSON.stringify(exists));
          return !!exists;
      }
      return false;
    },

    follow: function(name) {
        console.log("calling follow with name="+name);
        if(Meteor.user()) {
            var target = Meteor.users.findOne({"username": name});
            if(target) {
                Meteor.users.update(Meteor.userId(), {$addToSet: {"profile.follow": target._id}});
                return true;
            }
        }
        return false;
    }
});