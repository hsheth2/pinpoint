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
    }
});

FlowRouter.route('/login', {
    name: 'login',
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

loggedIn.route('/arrow', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "arrow"});
    }
});