Tracker.autorun(function() {
    if(Meteor.user()) {
        var pos = Geolocation.latLng();
        if(pos) {
            console.log(pos.lat);
            console.log(pos.lng);
        }
        else {
            console.log("ERR-POSITION IS NULL");
        }
    }
});