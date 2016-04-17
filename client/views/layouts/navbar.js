Template.navbar.helpers({
    pageTitle: function() {
        Session.setDefault("pageTitle", "Pinpoint");
        return Session.get("pageTitle");
    }
})