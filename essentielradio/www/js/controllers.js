angular.module('essentielradio.controllers', [])

.controller('AppCtrl', function($scope,$rootScope,IMAGE_URLS) {
        $rootScope.menuPicto=IMAGE_URLS.BANDEAU_MENU;
})

.controller("PodcastsCtrl", function($scope, podcastsServices){
        $scope.podcasts=podcastsServices.getPodcasts();
    })

.controller("PodcastCtrl", function($scope,$sce, $stateParams,podcastsServices){
        $scope.podcast=podcastsServices.getPodcastById($stateParams.podcastId);

        // because of security matters to previne xss attacks
        $scope.iframeSrc=$sce.trustAsResourceUrl($scope.podcast.iframeSrc);

    })

.controller("FollowUsCtrl", function($scope, followUsServices,$cordovaInAppBrowser,$ionicPlatform){
        $scope.socialMedia=followUsServices.getSocialMediaData();
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
        };

        $scope.followUsOn=function(link){
            $ionicPlatform.ready(function() {
                $cordovaInAppBrowser.open(link, '_system', options)
                    .then(function(event) {
                        // success
                    })
                    .catch(function(event) {
                        // error
                    });
            });
        };
    })

.controller("KnowUsCtrl", function($scope, IMAGE_URLS,$ionicSideMenuDelegate){
        $scope.essentiel_bandeau=IMAGE_URLS.BADEAU_PRESENTATION;
        $scope.onSwipeRight=function(){
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.$on('$ionicView.enter', function(){
            $ionicSideMenuDelegate.canDragContent(false);
        });
        $scope.$on('$ionicView.leave', function(){
            $ionicSideMenuDelegate.canDragContent(true);
        });
})

.controller("AlarmsCtrl", function($scope, config,alarmsServices,$ionicModal,$cordovaToast,$ionicPlatform){
        $scope.allAlarms=alarmsServices.getAll();

        // Form data for the creation modal
        $scope.alarmData = config.default_alarm;

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/createalarm.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the creation modal to close it
        $scope.close= function() {
            $scope.modal.hide();
        };

        // Open the creation modal
        $scope.create = function() {
            $scope.modal.show();
        };

        function createLocalNotification(newAlarm,currentDateWhenAlarmWasSpecified) {
            if (newAlarm.repeat){
                var date_=new Date();
                date_.setHours(newAlarm.date.getHours());
                date_.setMinutes(newAlarm.date.getMinutes());
                //date_.setSeconds(newAlarm.date.getSeconds());
                date_.setSeconds(0);
                newAlarm.date=date_;

                newAlarm.days.forEach(function(value, index, array){
                    var notificationDate = null;
                    var notificationId=null;

                    function nextDay(date, weekDay) {
                        var ret = new Date(date || new Date());
                        ret.setDate(ret.getDate() + (weekDay - 1 - ret.getDay() + 7) % 7 + 1);
                        return ret;
                    }

                    function setNotificationIdAndDate(weekDayId){
                        if(newAlarm.date.getDay() === weekDayId &&
                            newAlarm.date.getTime() > currentDateWhenAlarmWasSpecified.getTime()){
                            notificationDate = newAlarm.date;
                        }else{
                            notificationDate = nextDay(newAlarm.date, weekDayId);
                        }
                        notificationId = alarmsServices.getNotifIdFromCounter();
                        newAlarm.notifIds.push(notificationId);
                        //localStorage.setItem(newAlarm.id.toString(), JSON.stringify(newAlarm));
                    }

                    switch (value){
                        case "Dimanche":
                            setNotificationIdAndDate(0);
                            break;
                        case "Lundi":
                            setNotificationIdAndDate(1);
                            break;
                        case "Mardi":
                            setNotificationIdAndDate(2);
                            break;
                        case "Mercredi":
                            setNotificationIdAndDate(3);
                            break;
                        case "Jeudi":
                            setNotificationIdAndDate(4);
                            break;
                        case "Vendredi":
                            setNotificationIdAndDate(5);
                            break;
                        case "Samedi":
                            setNotificationIdAndDate(6);
                            break;
                    }

                    cordova.plugins.notification.local.schedule({
                        id: notificationId,
                        title: "ESSENTIEL radio",
                        text: "Bien + que de la radio !",
                        firstAt: notificationDate,
                        every: "week"
                    });
                });
            }else{
                // Reset the alarm date
                var date=new Date();
                date.setHours(newAlarm.date.getHours());
                date.setMinutes(newAlarm.date.getMinutes());
                //date.setSeconds(newAlarm.date.getSeconds());
                date.setSeconds(0);

                if (currentDateWhenAlarmWasSpecified > newAlarm.date){
                    newAlarm.date.setDate(currentDateWhenAlarmWasSpecified.getDate()+1);
                }

                var id = alarmsServices.getNotifIdFromCounter();
                cordova.plugins.notification.local.schedule({
                    id: id,
                    title: "ESSENTIEL radio",
                    text: "Bien + que de la radio !",
                    firstAt: date,
                    every: "day"
                });

                newAlarm.notifIds.push(id);
            }

        }

        function deleteLocalNotification(alarmObject){
            cordova.plugins.notification.local.cancel(alarmObject.notifIds, function() {
                //alert("done");
            });
        }

        $scope.saveAlarm = function() {
            //console.log('Doing login', $scope.alarmData); //TODO Delete this line

            createLocalNotification($scope.alarmData, new Date());
            alarmsServices.addAlarm($scope.alarmData);
            $scope.doRefresh();
            $scope.close();
        };

        $scope.deleteAlarm = function(id){
            deleteLocalNotification(alarmsServices.getAlarmById(id));
            alarmsServices.deleteAlarm(id);
            $cordovaToast.showShortCenter("Alarm has been deleted");
            $scope.doRefresh();
        };
        $scope.editAlarm =function(id){
            $scope.modal.show();
            $scope.alarmData=alarmsServices.getAlarmById(id);

        };

        $scope.doRefresh=function(){
            $scope.allAlarms = alarmsServices.getAll();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        };

    })

.controller('FavoritesCtrl', function($scope, $ionicPopup, $cordovaToast, favoritesServices,TOAST_STRINGS) {
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

        $scope.deleteFavorite = function(id){
            favoritesServices.deleteFavorite(id);
            $cordovaToast.showShortCenter(TOAST_STRINGS.FAVORITE_DELETED);
            $scope.favorites = favoritesServices.getFavorites();
        };
})

.controller('FavoriteCtrl', function($scope, $cordovaToast, favoritesServices ,$stateParams,$rootScope) {
        $scope.favorite = favoritesServices.getFavoriteById(parseInt($stateParams.favoriteId));

        $scope.deleteFromDetailView=function(id){
            favoritesServices.deleteFavorite(id);
            $cordovaToast.showShortCenter("Favorite has been deleted ");
            $rootScope.$broadcast("favoriteDeleted", {});
        };
})

.controller('LetransformeurCtrl', function($scope,$sce, podcastsServices) {
        $scope.iframeSrc = $sce.trustAsResourceUrl(podcastsServices.getPodcastById("letransformeur").iframeSrc);
})

.controller('SupportUsCtrl', function($scope,IMAGE_URLS,$window,$ionicPlatform,$cordovaInAppBrowser){

        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
        };

        $scope.banniere = IMAGE_URLS.BANNIERE_SOUTENIR_RADIO;
        $scope.abonnementList=[
            {text: "5 euros mensuels", value: "1 ballon",ballons:['1']},
            {text: "10 euros mensuels", value: "2 ballons",ballons:['1','2'] },
            {text: "15 euros mensuels", value: "3 ballons",ballons:['1','2','3'] }
        ];
        $scope.abonnement={
            choix:""
        };

        $scope.open_paypal=function(){
            $ionicPlatform.ready(function() {
                $cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options)
                    .then(function(event) {
                        // success
                    })
                    .catch(function(event) {
                        // error
                    });
            });
        };

        $scope.open_paypal_don_unique=function(){
            $ionicPlatform.ready(function() {
                $cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options)
                    .then(function(event) {
                        // success
                    })
                    .catch(function(event) {
                        // error
                    });
            });
        };

})


.controller('LiveCtrl', function ($scope, $http,$rootScope, $timeout,$ionicPopup, $cordovaToast,
                                  $cordovaSocialSharing, radioServices, dataServices, favoritesServices,
                                  socialMediaSharingServices,$sce,$ionicSideMenuDelegate,$cordovaSpinnerDialog,
                                  $ionicPlatform,IMAGE_URLS,GENERAL_CONFIG,TOAST_STRINGS) {


    $scope.navBar_image = radioServices.getCurrentHeader();
    $scope.picto_webradio_fr=IMAGE_URLS.PICTO_WEBRADIO_FR;
    $scope.picto_webradio_er=IMAGE_URLS.PICTO_WEBRADIO_ER;
    $scope.picto_webradio_kidz=IMAGE_URLS.PICTO_WEBRADIO_KIDZ;

    $scope.play_pause=IMAGE_URLS.PLAY_IMAGE;
    $scope.carre_noir=IMAGE_URLS.CARRE_NOIR;

    $scope.setErrorImg=function(){
            //this.onerror=null;
            $scope.title_image=radioServices.getErrorImg();
    };

    moment.tz.add(GENERAL_CONFIG.PACKED_ZONE_STRING);
    var media;
    var songs={};
    $scope.currentSong={};
    $scope.nextSong={};

    $scope.onError=function(){
        if(radioServices.getCurrentRadio()==GENERAL_CONFIG.ER_ID){
            return IMAGE_URLS.ON_ERROR_ER;
        }else if(radioServices.getCurrentRadio()==GENERAL_CONFIG.FR_ID){
            return IMAGE_URLS.ON_ERROR_FR;
        }else if(radioServices.getCurrentRadio()==GENERAL_CONFIG.KIDZ_ID){
            return IMAGE_URLS.ON_ERROR_KIDZ;
        }
    };

    var setTimer=function(node){
        var milliseconds=0;
        if (node==$scope.currentSong){
            milliseconds = dataServices.calculateTimeDiff(
                moment().tz(GENERAL_CONFIG.TZ),
                moment.tz(dataServices.getStartTime($scope.nextSong),GENERAL_CONFIG.TZ)
            );
        }else if (node==$scope.nextSong){
            milliseconds = dataServices.calculateTimeDiff(
                moment.tz(dataServices.getStartTime(node),GENERAL_CONFIG.TZ),
                moment.tz(dataServices.getStartTime($scope.theSongAfter),GENERAL_CONFIG.TZ));
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

            var lyrics = data.songOnAir.titre_paroles==""?"Pas de paroles disponibles !":data.songOnAir.titre_paroles;
            $rootScope.current_lyrics=$sce.trustAsHtml(lyrics);
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
           $scope.play_pause=IMAGE_URLS.PLAY_IMAGE;
       }else{
           //The user want to play
           $ionicPlatform.ready(function() {
               $cordovaSpinnerDialog.show(null,null, true);
           });
           $scope.createAndPlay();
       }
   };
   
   $scope.createAndPlay = function(){
           media = new Media(radioServices.getCurrentRadioUrl(), function(){
                    //Success
               $ionicPlatform.ready(function() {
                   $cordovaSpinnerDialog.hide();
               });

            }, function(){
                    //Error

            }, function(status){
                    //Status
               // Media.MEDIA_RUNNING = 2;
               if(status==2){
                   $ionicPlatform.ready(function() {
                       $cordovaSpinnerDialog.hide();
                   });
               }
            });
           
           radioServices.play(media);
           $scope.play_pause=IMAGE_URLS.PAUSE_IMAGE;
   };
        /*$scope.$on('$ionicView.loaded', function(){
            $ionicPlatform.ready(function() {
                //$cordovaToast.showShortCenter("$ionicView.loaded fired !!!");
                $scope.startOrStop();
            });

        });*/

        $scope.$on('$ionicView.afterEnter', function(){
            $ionicPlatform.ready(function() {
                //$cordovaToast.showShortCenter("$ionicView.loaded fired !!!");
                $scope.startOrStop();
            });

        });

   
   $scope.switchRadioTo=function(radioId) {
       var status = radioServices.switchTo(radioId, media);
       if(status){
           $ionicPlatform.ready(function() {
               $cordovaSpinnerDialog.show(null,null, true);
           });
           newRequest(true);
           $scope.createAndPlay();
           $scope.navBar_image = radioServices.getCurrentHeader();

           $scope.setErrorImg=function(){
               //this.onerror=null;
               $scope.title_image=radioServices.getErrorImg();
           };
       }
   };

   $scope.addFavorite=function(){
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
       $cordovaToast.showShortCenter(TOAST_STRINGS.FAVORITE_ADDED);
   };

   $scope.shareOnTwitter=function(){
       var message=socialMediaSharingServices.getTwitterMessage($scope.currentSong.artiste_nom,
            $scope.currentSong.titre_nom);
       var image=null;
       var link=GENERAL_CONFIG.RADIO_URL;

       $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
           $cordovaSocialSharing.shareViaTwitter(message, image, link);
       }, function(error) {
           alert("Cannot share on Twitter");//TODO put this in a config
       });
   };

   $scope.shareOnOther=function(){
       $cordovaSocialSharing
           .share(socialMediaSharingServices.getDefaultMessage($scope.currentSong.artiste_nom,
                            $scope.currentSong.titre_nom), null, null, GENERAL_CONFIG.RADIO_URL)
                            // Share via native share sheet
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



