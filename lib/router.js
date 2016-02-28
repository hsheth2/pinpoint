var loggedIn = FlowRouter.group({
  prefix: '/',
  name: 'loggedIn',
  triggersEnter: [function(context, redirect) {
    if(!Meteor.user()) {
        FlowRouter.go('/login');
    }
  }]
});

loggedIn.route('/', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "index"});
    }
});

FlowRouter.route('/login', {
    action: function() {
        BlazeLayout.render("loginLayout", {main: "atForm"});
    }
});

loggedIn.route('/list', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "list"});
    }
});

loggedIn.route('/follow', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "follow"});
    }
});

loggedIn.route('/map', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "map"});
    }
});