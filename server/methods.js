Meteor.methods({
    updatePos: function(pos) {
        pos.time = Date.now();
        Meteor.users.update(Meteor.userId(), {$set: {'profile.lastPos': pos}});
        console.log("user pos updated.");
    }
});