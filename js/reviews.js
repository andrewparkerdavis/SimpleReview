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


  /* Home Content View */
 var HomeContentView = Parse.View.extend( {
  el: "#main-content",

  initialize: function() {
    var self = this;
    self.render();
  },

  render: function() {
    this.$el.html(_.template($("#home-content-template").html()));
    new CallToActionView();
    new BestOfView();
    new BlogView();
    new AddBusinessPromptView();
  }

 });

 var LoggedInContentView = Parse.View.extend( {
  el: "#main-content",

  initialize: function() {
    var self = this;
    self.render();
  },

  render: function() {
    this.$el.html(_.template($("#logged-in-content-template").html()));

    new BestOfView();
    new AddBusinessPromptView();
    new BlogView();
  }

 });

 var BusinessFormContentView = Parse.View.extend( {
  el: "#main-content",

  initialize: function() {
    var self = this;
    self.render();
  },

  render: function() {
    this.$el.html(_.template($("#add-business-form-content-template").html()));
    new BusinessFormComponent();
    new BlogView();
  }

});

 var BusinessFormComponent = Parse.View.extend( {
    el: "#add-business-component",

    initialize: function() {
      var self = this;
      self.render();
    },
    render: function() {
      this.$el.html(_.template($("#add-business-template").html()));
        var categories = new CategoryList();
        var subCategories = new CategoryList();
        var subSubCategories = new CategoryList();
        this.topView = new CategoriesView({ el: $("#topCategories"), collection: categories, topLevel: true});
        this.secondView = new CategoriesView({ el: $("#subCategories"), collection: subCategories});
        this.thirdView = new CategoriesView({ el: $("#subSubCategories"), collection: subSubCategories});
        this.topView.childView = this.secondView;
        this.secondView.childView = this.thirdView;      
    }
 });


  /* Main Page */

  var MainView = Parse.View.extend({
    el: ".content",

   events: {
      "click .log-out": "logOut",
      "click .login-link": "displayLogin",
      "click .signup-link": "displaySignup",
      "click #add-business-button" : "displayAddBusinessForm"
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

    displayAddBusinessForm: function(e) {
      if (Parse.User.current()) {
        //this.contentView.remove();
        this.contentView = new BusinessFormContentView();
      } else {
        this.displaySignup(e);
      }

    },

    render: function() {
      this.$el.html(_.template($("#main-template").html())); 
      new SearchNavView();
      if (Parse.User.current()) {
        new LoggedInNavView();
        this.contentView = new LoggedInContentView();
      } else {
        new NotLoggedInNavView();
        this.contentView = new HomeContentView();
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

 /* Call To Action */
 var CallToActionView = Parse.View.extend( {
  el: "#call-to-action",

  initialize: function() {
    var self = this;
    self.render();
  },

    render: function() {
      this.$el.html(_.template($("#call-to-action-template").html()));
    }

 });
 

 /* Best of Per Category */

 var BestOfView = Parse.View.extend( {
  el: "#best-of-per-category",

  initialize: function() {
    var self = this;
    self.render();
  },

    render: function() {
      this.$el.html(_.template($("#best-of-per-category-template").html()));
    }

 });

 var BlogView = Parse.View.extend( {
  el: "#blog",

  initialize: function() {
    var self = this;
    self.render();
  },

    render: function() {
      this.$el.html(_.template($("#blog-template").html()));
    }

 });

 var AddBusinessPromptView = Parse.View.extend({

  el: "#add-business-prompt",
  
  initialize: function() {
    this.render();
  },


  remove: function() {
    // Empty the element and remove it from the DOM while preserving events
    $(this.el).empty().detach();

    return this;
  },

  render: function() {
    this.$el.html(_.template($("#add-business-prompt-template").html()));
    this.delegateEvents();
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
      "submit form.login-form": "logIn",
      "click #signup-from-login": "displaySignup"
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
          new MainView();
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
    },
    displaySignup: function(e) {
      new SignUpView();
      this.undelegateEvents();
      delete this;
    }    
  });

var SignUpView = Parse.View.extend({
    events: {
      "submit form.signup-form": "signUp",
      "click #login-from-signup-button": "displayLogin"
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
         new MainView();
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
    },
   displayLogin: function(e) {
      new LogInView();
      this.undelegateEvents();
      delete this;
    },

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


          this.collection = new CategoryList();

          this.collection.bind('add',     this.addOne);
          this.collection.bind('reset',   this.addAll);
          this.collection.bind('all',     this.render);
          
          if(!$(this.el).attr('disabled')) {
            var query = new Parse.Query(Category);
            if(this.parentId) {
                var parent = new Category();
                parent.id = this.parentId;
                query.equalTo("Parent", parent);
            } else {
                query.doesNotExist("Parent");
            }
            query.ascending("name");
            this.collection.query = query;
            this.collection.fetch();
          }
      },
      addOne: function(category){
          var categoryView = new CategoryView({ model: category });
          this.categoryViews.push(categoryView);
          $(this.el).append(categoryView.render().el);
      },        
      addAll: function(){
          _.each(this.categoryViews, function(categoryView) { categoryView.remove(); });
          this.categoryViews = [];
          this.collection.each(this.addOne);
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
              if(!this.collection.query)
                  this.collection.query = new Parse.Query(Category);
              var parent = new Category();
              parent.id = this.parentId;
              this.collection.query.equalTo("Parent", parent);
              this.collection.query.ascending("name");
              this.collection.fetch( );
              if(this.childView.childView) {
                  this.childView.childView.collection.reset();
                  this.childView.childView.setDisabled(true);
              }
              this.render();
          }
      },
      setSelectedId: function(objectId) {
          if(this.childView) {
              this.childView.selectedId = null;
              this.childView.setParentId(objectId);
              this.childView.setDisabled(false);
              if(this.childView.childView) {
                  this.childView.childView.collection.reset();
                  this.childView.childView.setDisabled(true);
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
      new MainView();
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
