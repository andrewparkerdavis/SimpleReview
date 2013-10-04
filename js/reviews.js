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

  /* Models */
  var Category = Parse.Object.extend("Categories");
  var Rating = Parse.Object.extend("Ratings");


  /* Collections */
  var CategoryList = Parse.Collection.extend( {
    model: Category
  });



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

/* Category Dropdown */


  var CategoryView = Parse.View.extend({
      tagName: "option",
      
      initialize: function(){
          _.bindAll(this, 'render');
      },       
      render: function(){
          $(this.el).attr('value', this.model.id).html(this.model.get('name'));
          return this;
      }
  });
  
 var CategoriesView = Parse.View.extend({
      events: {
          "change": "changeSelected"
      },
      
      initialize: function(){
          _.bindAll(this, 'addOne', 'addAll');


          this.categories = new Categories();

          this.categories.bind('add',     this.addOne);
          this.categories.bind('reset',   this.addAll);
          this.categories.bind('all',     this.render);

          var query = new Parse.Query(Category);
          if(this.parentId) {
              var parent = new Category();
              parent.id = this.parentId;
              query.equalTo("Parent", parent);
          } else {
              query.doesNotExist("Parent");
          }
          query.ascending("name");
          this.categories.query = query;
          this.categories.fetch();
      },
      addOne: function(category){
          var categoryView = new CategoryView({ model: category });
          this.categoryViews.push(categoryView);
          $(this.el).append(categoryView.render().el);
      },        
      addAll: function(){
          _.each(this.categoryViews, function(categoryView) { categoryView.remove(); });
          this.categoryViews = [];
          this.categories.each(this.addOne);
          if (this.selectedId) {
              $(this.el).val(this.selectedId);
          }
      },
      changeSelected: function(){
          this.setSelectedId($(this.el).val());
      },
      setDisabled: function(disabled) {
          $(this.el).attr('disabled', disabled);
      },
      setParentId: function(objectId) {
          this.parentId = objectId;
          if(!this.parentId && !this.topLevel) {
              this.setDisabled(true);
          } else if(!this.topLevel) {
              var parent = new Category();
              parent.id = this.parentId;
              this.categories.query.equalTo("Parent", parent);
              this.categories.fetch( {
                  success: function(objects) {
                      console.log("HELLO");
                  }
              });
              if(this.childView.childView) {
                  this.childView.childView.categories.reset();
                  this.childView.childView.setDisabled(true);
              }
              this.render();
          }
      },
      setSelectedId: function(objectId) {
          if(this.childView) {
              this.childView.selectedId = null;
              this.childView.setDisabled(false);
              this.childView.setParentId(objectId);
              if(this.childView.childView) {
                  this.childView.childView.categories.reset();
                  this.childView.childView.setDisabled();
              }
          }
      }        
  });
    
    
  /* Usage
    
    var categories = new Categories();
    var subCategories = new Categories();
    var subSubCategories = new Categories();
    var topView = new CategoriesView({ el: $("#topCategories"), collection: categories, topLevel: true});
    var secondView = new CategoriesView({ el: $("#subCategories"), collection: subCategories});
    var thirdView = new CategoriesView({ el: $("#subSubCategories"), collection: subSubCategories});
    topView.childView = secondView;
    secondView.childView = thirdView;

  */

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
