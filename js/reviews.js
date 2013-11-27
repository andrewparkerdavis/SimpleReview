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
  var Product = Parse.Object.extend("Products");
  /* Collections */
  var Categories = Parse.Collection.extend( {
    model: Category
  });
  
  var Products = Parse.Collection.extend( {
      model: Product
  });

 var allProducts = new Products();
 
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
    this.ratingsViewActive = false;
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
    events: {
      "click .add-rating-checkbox": "displayAddRatingForm",
      "click  #add-business-submit": "createBusiness"
    },
    initialize: function() {
      var self = this;
      _.bindAll(this, 'displayAddRatingForm', 'createBusiness');
      self.render();
    },
    render: function() {
      this.$el.html(_.template($("#add-business-template").html()));
      var categories = new Categories();
      var subCategories = new Categories();
      var subSubCategories = new Categories();
      var topView = new CategoriesView({ el: $("#topCategories"), collection: categories, topLevel: true});
      var secondView = new CategoriesView({ el: $("#subCategories"), collection: subCategories});
      secondView.setHidden(true);
      var thirdView = new CategoriesView({ el: $("#subSubCategories"), collection: subSubCategories});
      thirdView.setHidden(true);
      topView.childView = secondView;
      secondView.childView = thirdView;
    },
    displayAddRatingForm: function(e) {
        if(this.ratingsViewActive) {
            this.addRatingView.remove();
//            this.addRatingView.unbind();
            this.ratingsViewActive = false;
//            this.addRatingView = null;
//            Backbone.View.prototype.remove.call(this.addRatingView);            
//            console.log(this.addRatingView);
        } else {
            this.addRatingView = new AddRatingView( { el: $("#rating-form") });
            this.ratingsViewActive = true;
        }
    },
  createBusiness: function(e) {
//      if (e.keyCode != 13) return;

      var product = new Product();
      product.ACL = new Parse.ACL(Parse.User.current());
      var categories = product.relation("Categories");
      var category = new Category();
      if($("#subSubCategories").val() && $("#subSubCategories").val() !== 'Select One') {
        category.id = $("#subSubCategories").val();
      } else if($("#subCategories").val() && $("#subCategories").val() !== 'Select One') {
        category.id = $("#subCategories").val();
      } else if ($("#topCategories").val() && $("#topCategories").val() !== 'Select One') {
        category.id = $("#topCategories").val();
      }
      var error = "";
      if(!$('#name').val()) {
          error += "<li>Name required</li>";
      } else {
          product.set("name", $('#name').val());
      }
      if(category.id) {
        categories.add(category);
      } else {
          error += "<li>Category required</li>";
      }
      if(!$('#url').val()) {
          error += "<li>Website required</li>";
      } else {
          product.set("url", $('#url').val());
      }
      product.set("description", $('#description').val());
      if(error !== "") {
          $('.error').html("<ul>" + error + "</ul>");
          $('.error').show();
      } else {
        $('.error').hide();
        product.save(null, {
            success: function(product) {
              console.log("Success! " + product.id);
              allProducts.add(product);
              view.mainView.viewBusiness(product, true);
            },
            error: function(product, error) {
              console.log('Failed to create new object, with error code: ' + error.description);            
              $('.error').html(error).show();
            }
        });
          
      }
  }
 });
 
 var AddRatingView = Parse.View.extend( {
  initialize: function() {
    var self = this;
    self.render();
  },

  render: function() {
    this.$el.html(_.template($("#add-rating-template").html()));
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

    viewBusiness: function(biz, updated) {
        this.contentView = new ProductPageView({model: biz}, updated);
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
  
  
  var ProductPageView = Parse.View.extend( {
  el: "#main-content",

  initialize: function() {
    var self = this;
    self.render();
  },
  template: function() {
      
  },
    render: function() {
      var product = this.model;
      var url = product.get("url");
      var name = product.get("name");
      var description = product.get("description");
      var html = _.template($("#product-page-template").html(), { name: name, url: url, description: description });
      this.$el.html(html);
      if(this.isUpdated) {
          $('.success').text("You did it biatch!");
      } else {
          $('.success').hide();
      }
      displayAllCategories(product, '#topCategory', '#subCategory', '#subSubCategory');
    }
 });
 
 var displayAllCategories = function(product, topDivName, subDivName, subSubDivName) {
    var categories = product.relation("Categories");
    categories.query().first( {
        success: function(category) {
            $(subSubDivName).html(category.get("name"));
            var parent = category.get("Parent");
            if(parent) {
              parent.fetch({
                 success:function(parent) {
                     var uberParent = parent.get("parent");
                     if(uberParent) {
                        uberParent.fetch({
                            success: function(uberParent) {
                                $(topDivName).html(uberParent.get("name") + " > ");
                            }
                        });
                     }
                     $(subDivName).html(parent.get("name") + " > ");
                 },
                 error: function(parent, error) {
                     console.log(error);
                 }
              });
          }
        }
    });
     
 };
 

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


  var Category = Parse.Object.extend("Categories");
  var Categories = Parse.Collection.extend({
      model: Category
  });


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
      
      setHidden: function(hidden) {
          if(hidden) {
            $(this.el).hide();
        } else {
            $(this.el).show();
        }
      },
      setParentId: function(objectId) {
          var self = this;
          this.parentId = objectId;
          if(!this.parentId && !this.topLevel) {
              this.setHidden(true);
          } else if(!this.topLevel) {
              var parent = new Category();
              parent.id = this.parentId;
              this.categories.query.equalTo("Parent", parent);
              this.categories.fetch( {
                  success: function(objects) {
                      if(objects.length === 0) {
                          self.setHidden(true);
                      } else {
                          self.setHidden(false);
                      }
                  }
              });
              if(typeof this.childView!== 'undefined' && typeof this.childView.childView !== 'undefined') {
                  this.childView.childView.categories.reset();
                  this.childView.childView.setHidden(true);
              }
              this.render();
          }
      },
      setSelectedId: function(objectId) {
          if(this.childView) {
              this.childView.selectedId = null;
//              this.childView.setDisabled(false);
              this.childView.setParentId(objectId);
              if(this.childView.childView) {
                  this.childView.childView.categories.reset();
                  this.childView.childView.setHidden(true);
              }
          }
      }        
  });
  
 

/* App and Routers */

 var AppState = Parse.Object.extend("AppState", {
    defaults: {
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
      this.mainView = new MainView();
    }
  });
  
  var AppRouter = Parse.Router.extend({
    routes: {
      "business/add": "addBusiness",
      "business/:id": "viewBusiness",
      "#": "mainView",
      "home": "mainView"
    },

    initialize: function(options) {
    },

    addBusiness: function() {
      view.mainView.displayAddBusinessForm();
    },
    
    viewBusiness: function(id) {
        var query = new Parse.Query(Product);
        query.get(id, {
            success: function(product) {
                view.mainView.viewBusiness(product, false);
            },
            error: function(object, error) {
                console.log("Unable to find product: " + error.description);
            }
        })
    },
    
    mainView: function() {
        if(typeof view.mainView !== MainView)
            view.mainView = new MainView();
    }

  });

  var state = new AppState;

  var router = new AppRouter;
  var view = new AppView;
  Parse.history.start();
});
