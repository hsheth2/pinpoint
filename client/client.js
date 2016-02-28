var lastPos = {lng: 0, lat: 0};

setInterval(function() {
    if(Meteor.user()) {
        var pos = Geolocation.latLng();
        
        if(pos) {
            if(pos.lng!==lastPos.lng || pos.lat!==lastPos.lat) {
                console.log("updating pos: "+pos.lat+","+pos.lng);
                Meteor.call('updatePos', pos);
            }
        }
        else {
            console.log("ERR-POSITION IS NULL");
        }
    }
}, 3000);