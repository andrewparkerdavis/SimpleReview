// An example Parse.js Backbone application based on the todo app by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses Parse to persist
// the todo items and provide user authentication and sessions.

$(function() {

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("t0PIynmyht1hN0ORLTYPKKL8OFVuAVYFbzd25V12",
                   "BhGFfHKdLl4mL0lc1AFmv43aWknXc1fbTDSYt1Jg");

  


  // The Application
  // ---------------

 

  /* Main Page */

  var HomeView = Parse.View.extend({
    el: ".content",

   events: {
      "click .log-out": "logOut",
      "click .login-link": "displayLogin",
      "click .signup-link": "displaySignup"
    },

 

    initialize: function() {
      var self = this;
      self.render();

      return self;
    },


    displayLogin: function(e) {
      new LogInView();
      this.undelegateEvents();
      delete this;
    },
    displaySignup: function(e) {
      new SignUpView();
      this.undelegateEvents();
      delete this;
    },

    render: function() {
      this.$el.html(_.template($("#home-template").html())); 
      new SearchNavView();
      if (Parse.User.current()) {
        new LoggedInNavView();
      } else {
        new NotLoggedInNavView();
      }     
    },
    remove: function() {
      // Empty the element and remove it from the DOM while preserving events
      $(this.el).empty().detach();

      return this;
    },

    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      this.render();      
    }    


  });


 
 /* Login and Signup */

  var NotLoggedInNavView = Parse.View.extend ({
    el: "#nav-login-signup",

    initialize: function() {
      var self = this;
      this.render();
    },

    render: function() {
      this.$el.html(_.template($("#not-logged-in-nav-template").html()));
    }

  });


  var LoggedInNavView = Parse.View.extend ({
    el: "#nav-login-signup",

    initialize: function() {
      var self = this;
      this.render();
    },

    render: function() {
      this.$el.html(_.template($("#logged-in-nav-template").html()));
    }

  });

   var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logIn");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          new HomeView();
          self.undelegateEvents();
          delete self;

        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          this.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    remove: function() {
      // Empty the element and remove it from the DOM while preserving events
      $(this.el).empty().detach();

      return this;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });

var SignUpView = Parse.View.extend({
    events: {
      "submit form.signup-form": "signUp"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "signUp");
      this.render();
    },

    

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();
      
      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
         new HomeView();
          self.undelegateEvents();
          delete self;
      },

        error: function(user, error) {
          self.$(".signup-form .error").html(error.message).show();
          this.$(".signup-form button").removeAttr("disabled");
        }
      });

      this.$(".signup-form button").attr("disabled", "disabled");

      return false;
    },
    remove: function() {
      // Empty the element and remove it from the DOM while preserving events
      $(this.el).empty().detach();

      return this;
    },

    render: function() {
      this.$el.html(_.template($("#signup-template").html()));
      this.delegateEvents();
    }
  });

/* End login and signup */


/* Site Functionality */


/* Search */

var SearchNavView = Parse.View.extend ({
    el: "#nav-search",

    initialize: function() {
      var self = this;
      self.render();
    },
    remove: function() {
      // Empty the element and remove it from the DOM while preserving events
      $(this.el).empty().detach();

      return this;
    },

    render: function() {
      this.$el.html(_.template($("#home-nav-search-template").html()));
    }

  });


/* App and Routers */

 var AppState = Parse.Object.extend("AppState", {
    defaults: {
      filter: "all"
    }
  });

  // The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#mainapp"),

    initialize: function() {
      this.render();
    },

    render: function() {
      new HomeView();
    }
  });
  
  var AppRouter = Parse.Router.extend({
    routes: {
      "all": "all",
      "active": "active",
      "completed": "completed"
    },

    initialize: function(options) {
    },

    all: function() {
      state.set({ filter: "all" });
    },

    active: function() {
      state.set({ filter: "active" });
    },

    completed: function() {
      state.set({ filter: "completed" });
    }
  });

  var state = new AppState;

  new AppRouter;
  new AppView;
  Parse.history.start();
});
