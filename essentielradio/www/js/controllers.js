angular.module('essentielradio.controllers', [])

.controller('AppCtrl', function($scope,$rootScope,config) {

        $rootScope.menuPicto=config.menu_picto;


})
    .controller("PodcastsCtrl", function($scope, podcastsServices){
        $scope.podcasts=podcastsServices.getPodcasts();


    })

    .controller("PodcastCtrl", function($scope,$sce, $stateParams,podcastsServices){
        $scope.podcast=podcastsServices.getPodcastById($stateParams.podcastId);

        // because of security matters to previne xss attacks
        $scope.iframeSrc=$sce.trustAsResourceUrl($scope.podcast.iframeSrc);
        $scope.startOrStop=function(){

        };

    })

    .controller("FollowUsCtrl", function($scope, followUsServices){
        $scope.socialMedia=followUsServices.getSocialMediaData();
        $scope.followUsOn=function(link){
            window.open(link, '_system', 'location=yes');
        };
    })

.controller('FavoritesCtrl', function($scope, $ionicPopup, $cordovaToast, favoritesServices) {
        $scope.shouldShowDelete = false;
        $scope.listCanSwipe = true;

        $scope.favorites = favoritesServices.getFavorites();

        $scope.doRefresh=function(){
            $scope.favorites = favoritesServices.getFavorites();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.$on('favoriteAdded', function(e) {
            $scope.doRefresh();
        });

        $scope.$on('favoriteDeleted', function(e) {
            $scope.doRefresh();
        });


        $scope.deleteFavorite = function(id){
            favoritesServices.deleteFavorite(id);
            $cordovaToast.showShortCenter("Favorite has been deleted ");
            $scope.favorites = favoritesServices.getFavorites();
        };
})

.controller('FavoriteCtrl', function($scope,$cordovaToast,favoritesServices ,$stateParams) {
        $scope.favorite = favoritesServices.getFavoriteById(parseInt($stateParams.favoriteId));

        $scope.deleteFromDetailView=function(id){
            favoritesServices.deleteFavorite(id);
            $cordovaToast.showShortCenter("Favorite has been deleted ");
            $scope.$emit("favoriteDeleted", {});
        };
})


.controller('LiveCtrl', function ($scope, $http,$rootScope, $timeout,$ionicPopup, $cordovaToast,
                                  $cordovaSocialSharing, radioServices, dataServices, favoritesServices,
                                  socialMediaSharingServices,$sce,$ionicSideMenuDelegate,config) {

    $scope.navBar_image = radioServices.getCurrentHeader();
    $scope.picto_webradio_fr=config.picto_webradio_fr;
    $scope.picto_webradio_er=config.picto_webradio_er;

    $scope.setErrorImg=function(){
            //this.onerror=null;
            $scope.title_image=radioServices.getErrorImg();
    };

    moment.tz.add(config.PackedZoneString);
    var media;
    var songs={};
    $scope.currentSong={};
    $scope.nextSong={};

    $scope.onError=function(){
        if(radioServices.getCurrentRadio()==config.frId){
            return config.onErrorEr;
        }else if(radioServices.getCurrentRadio()==config.frId){
            return config.onErrorFr;
        }
    };

    var setTimer=function(node){
        var milliseconds=0;
        if (node==$scope.currentSong){
            milliseconds = dataServices.calculateTimeDiff(
                moment().tz(config.tz),
                moment.tz(dataServices.getStartTime($scope.nextSong),config.tz)
            );
        }else if (node==$scope.nextSong){
            milliseconds = dataServices.calculateTimeDiff(
                moment.tz(dataServices.getStartTime(node),config.tz),
                moment.tz(dataServices.getStartTime($scope.theSongAfter),config.tz));
                newRequest(false);
        }

        $timeout(function() {
            whenTimerExpire();
        }, milliseconds);


    };
    var whenTimerExpire=function(){
        $scope.artist_name = $scope.nextSong.artiste_nom;
        $scope.title_image = $scope.nextSong.titre_image;
        setTimer($scope.nextSong);
    };

    var newRequest=function(first){
        var request = dataServices.fetchSongsData();
        request.success(function(data, status, headers, config){
            songs=data;
            $scope.artist_name=data.songOnAir.artiste_nom;
            $scope.title_image=data.songOnAir.titre_image;
            $scope.currentSong=data.songOnAir;
            $scope.nextSong=data.nextSong1;
            $scope.theSongAfter=data.nextSong2;

            $rootScope.current_lyrics=$sce.trustAsHtml(data.songOnAir.titre_paroles);
            $rootScope.current_song_info=data.songOnAir.artiste_nom +' - ' + data.songOnAir.titre_nom;

             $scope.nextCouple=[
                $scope.nextSong
            ];

            if(first){
                setTimer($scope.currentSong);
            }
        });
    };

    newRequest(true);

    
   $scope.startOrStop = function() {

       if (radioServices.isPlaying() == true){
           //The user want to stop the radio
           radioServices.stop(media);
       }else{
           //The user want to play
           $scope.createAndPlay();
       }
   };
   
   $scope.createAndPlay = function(){
           media = new Media(radioServices.getCurrentRadioUrl(), function(){
            //Success
            }, function(){
                    //Error
            }, function(){
                    //Status
            });
           
           radioServices.play(media);
   };

   
   $scope.switchRadioTo = function(radioId) {
       var status = radioServices.switchTo(radioId, media);
       if(status){
           newRequest(true);
           $scope.createAndPlay();
           $scope.navBar_image = radioServices.getCurrentHeader();

           $scope.setErrorImg=function(){
               //this.onerror=null;
               $scope.title_image=radioServices.getErrorImg();
           };
       }
   };

   $scope.addFavorite = function(){
       var songOnAir = $scope.currentSong;

       var favorite = {
           id: favoritesServices.getIdCounter(),
           title : songOnAir.titre_nom,
           artist : songOnAir.artiste_nom,
           image : songOnAir.titre_image,
           date : new Date(),
           radio : radioServices.getCurrentRadioFullName()
       };
       $scope.$emit('favoriteAdded',{});
       favoritesServices.addFavorite(favorite);
       $cordovaToast.showShortCenter("Favorite has been added ");
   };

   $scope.shareOnTwitter=function(){
       var message=socialMediaSharingServices.getTwitterMessage($scope.currentSong.artiste_nom,
            $scope.currentSong.titre_nom);
       var image=null;
       var link="http://www.essentielradio.com"; //TODO put this in a service

       $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
           $cordovaSocialSharing.shareViaTwitter(message, image, link);
       }, function(error) {
           alert("Cannot share on Twitter");
       });
   };

   $scope.shareOnOther=function(){
       $cordovaSocialSharing
           .share(socialMediaSharingServices.getDefaultMessage($scope.currentSong.artiste_nom,
                            $scope.currentSong.titre_nom), null, null, "http://www.essentielradio.com") // Share via native share sheet //TODO put this in a service
           .then(function(result) {
                            // Success!
           }, function(err) {
                            // An error occured. Show a message to the user
           });
   };

   $scope.toggleLeftSideMenu=function(){
       $ionicSideMenuDelegate.toggleRight();
       //$rootScope.current_lyrics=$scope.currentSong.titre_paroles;
   };

   
       
 });



