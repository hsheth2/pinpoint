FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render("applicationLayout", {main: "index"});
    }
});