// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('essentielradio', ['ionic','essentielradio.directives', 'essentielradio.controllers',
    'essentielradio.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(device.platform === "iOS") {
          window.plugin.notification.local.promptForPermission();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.live', {
    url: "/live",
    views: {
      'menuContent': {
        templateUrl: "templates/live.html",
        controller: 'LiveCtrl'
      }
    }
  })
  
  .state('app.favorites', {
    url: "/favorites",
    views: {
      'menuContent': {
        templateUrl: "templates/favorites.html",
        controller: 'FavoritesCtrl'
      }
    }
  })
      .state('app.single', {
          url: "/favorites/:favoriteId",
          views: {
              'menuContent': {
                  templateUrl: "templates/favorite.html",
                  controller: 'FavoriteCtrl'
              }
          }
      })

  .state('app.podcasts', {
    url: "/podcasts",
    views: {
      'menuContent': {
        templateUrl: "templates/podcasts.html",
          controller: 'PodcastsCtrl'
      }
    }
  })
      .state('app.podcast', {
          url: "/podcasts/:podcastId",
          views: {
              'menuContent': {
                  templateUrl: "templates/podcast.html",
                  controller: 'PodcastCtrl'
              }
          }
      })
  
  .state('app.alarms', {
    url: "/alarms",
    views: {
      'menuContent': {
        templateUrl: "templates/alarms.html",
          controller: 'AlarmsCtrl'
      }
    }
  })
  
  .state('app.followus', {
    url: "/followus",
    views: {
      'menuContent': {
        templateUrl: "templates/followus.html",
        controller: 'FollowUsCtrl'

      }
    }
  })
  
  .state('app.knowus', {
    url: "/knowus",
    views: {
      'menuContent': {
        templateUrl: "templates/knowus.html",
          controller: 'KnowUsCtrl'
      }
    }
  })

      .state('app.letransformeur', {
          url: "/letransformeur",
          views: {
              'menuContent': {
                  templateUrl: "templates/letransformeur.html",
                  controller: 'LetransformeurCtrl'
              }
          }
      })

      .state('app.supportus', {
          url: "/supportus",
          views: {
              'menuContent': {
                  templateUrl: "templates/supportus.html",
                  controller: 'SupportUsCtrl'
              }
          }
      })

  ;

  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/live');

    $ionicConfigProvider.tabs.position('bottom'); //other values: top

    });
