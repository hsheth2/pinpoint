var loggedIn = FlowRouter.group({
  //prefix: '/',
  name: 'loggedIn',
  triggersEnter: [function(context, redirect) {
    if(!Meteor.loggingIn() && !Meteor.userId()) {
        var route = FlowRouter.current();
        if(route.route.name!=='login') {
            Session.set('redirectAfterLogin', route.path);
        }
        console.log("redirect to login");
        redirect('login');
    }
  }]
});

loggedIn.route('/', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "index"});
        Session.set("pageTitle", "Pinpoint");
    }
});

FlowRouter.route('/login', {
    name: 'login',
    action: function() {
        BlazeLayout.render("loginLayout", {main: "atForm"});
        Session.set("pageTitle", "Pinpoint");
    }
});

loggedIn.route('/list', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "list"});
        Session.set("pageTitle", "Nearby");
    }
});

loggedIn.route('/follow', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "follow"});
        Session.set("pageTitle", "Follow");
    }
});

loggedIn.route('/arrow', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "arrow"});
    }
});