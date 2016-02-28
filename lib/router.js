FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "index"});
    }
});

FlowRouter.route('/login', {
    action: function() {
        BlazeLayout.render("loginLayout", {main: "atForm"});
    }
});

FlowRouter.route('/list', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "list"});
    }
});

FlowRouter.route('/follow', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "follow"});
    }
});

FlowRouter.route('/map', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "map"});
    }
});