var services = angular.module('essentielradio.services', []);

services.constant("config", {
        "dataUrl": "http://www.essentielradio.com/app/playlist_short.php?radioOnAir=",
        "erId": "er",
        "frId": "fr",
        "kidzsId":"kidzs",
        "banniere_soutenir_radio":"http://www.essentielradio.com/media/Page/soutenir/pagesoutien-banniere-630v7.jpg",
        "bandeau_presentation":"img/er-bandeau.jpg",
        "entete_fr":"img/en-tete_LOGO_fr.svg",
        "entete_kidz":"img/en-tete_LOGO_kidz.svg",
        "entete_er":"img/en-tete_LOGO_er.svg",
        "menu_picto":"img/er-bandeau.jpg",
        "picto_webradio_fr":"img/picto_webradio_fr.svg",
        "picto_webradio_er":"img/picto_webradio_kidz.svg",
        "picto_webradio_kidz":"img/picto_webradio_kidz.svg",
        "default_alarm":{
            repeat: false,
            days:[
                {text: "Lundi", checked: false},
                {text: "Mardi", checked: false},
                {text: "Mercredi", checked: false},
                {text: "Jeudi", checked: false},
                {text: "Vendredi", checked: false},
                {text: "Samedi", checked: false},
                {text: "Dimanche", checked: false}
            ]
        },
        "carre_noir":"img/carre_noir.svg",
        "onErrorEr":"http://www.essentielradio.com/flux/notfound/er_258x258.jpg",
        "onErrorFr":"http://www.essentielradio.com/flux/notfound/fr_258x258.jpg",
        "onErrorKidz":"http://www.essentielradio.com/flux/notfound/kidz_258x258.jpg",
        "play_image":"img/play_pause/boutonPlay.png",
        "pause_image":"img/play_pause/boutonPause.png",
        "streamUrl":{"er":"http://str81.streamakaci.com:80/",
                     "fr":"http://essentielradioing.streamakaci.com/essentielfr.mp3",
                     "kidzs":"http://essentielradioing.streamakaci.com/essentielsweet.mp3"},
        "soutenirER":{
          "lien_don_unique":"",
          "abonnement":{
                "1_ballon":"",
                "2_ballon":"",
                "3_ballon":""
            }
        },
        "tz":"Europe/Paris",
        "PackedZoneString":"Europe/Paris|PMT WET WEST CEST CET WEMT|-9.l 0 -10 -20 -10 -20|0121212121212121212121212121212121212121212121212123434352543434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434|-2nco8.l cNb8.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 Ik0 5M30 WM0 1fA0 1cM0 Vx0 hB0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00"
        
    });

services.factory('imgOnError', function(config, radioServices){
        return {
            getErrorImg:function(){
                var currentRadio=radioServices.getCurrentRadio();
                if(currentRadio=='er'){
                    return config.onErrorEr;
                }else if (currentRadio=="fr"){
                    return config.onErrorFr;
                }else if(currentRadio=="kidz"){
                    return config.onErrorKidz;
                }
            }
        };
    }

);

services.factory('radioServices', function(config){
    var currentRadio = 'er';
    var playingState = false ;
    var currentStreamUrl = config.streamUrl.er;
    var tim;

    var hours;
    var minutes;
    var seconds;
    
    return {
        getCurrentHeader:function(){
          if(currentRadio=='er'){
              return config.entete_er;
          }else if (currentRadio=="fr"){
              return config.entete_fr;
          }else if(currentRadio=="kidzs"){
              return config.entete_kidz;
          }
        },

        runcounter:function(milliseconds){
            this.convert(Math.floor(milliseconds/1000));

            /*tim = setInterval(function(){
                if(seconds<=0){
                    --minutes;
                    seconds=60;
                }
                if (minutes<0){
                    clearInterval(tim);
                    document.getElementById('audio_duration').innerHTML = "0 sec";
                    return;
                }
                document.getElementById('audio_duration').innerHTML = minutes + " min "+ (seconds--) + " sec";
            },1000);*/

        },

        stopcounter:function(){
            clearInterval(tim);
        },

        convert:function(totalSeconds){
            hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            minutes = Math.floor(totalSeconds / 60);
            seconds = totalSeconds % 60;
        },
        getCurrentRadio:function(){
          return currentRadio;
        },

        getCurrentRadioFullName:function(){
            if(currentRadio=="er"){
                return "ESSENTIEL radio";
            }else if(currentRadio=="fr"){
                return "ESSENTIEL fr";
            }else if (currentRadio=="kidzs"){
                return "ESSENTIEL kidzs";
            }
        },
        
        isPlaying: function(){
          return playingState;  
        },
        
        getCurrentRadioUrl : function(){
            if(currentRadio == "er"){
                currentStreamUrl=config.streamUrl.er;
            }else if(currentRadio=="fr"){
                currentStreamUrl= config.streamUrl.fr;
            }else if(currentRadio=="kidzs"){
                currentStreamUrl=config.streamUrl.kidzs;
            }
            return currentStreamUrl;
        },
        
        play : function(media){
            media.play();
            playingState=true;
        },
        
        stop : function(media){
            media.stop();
            media.release();
            playingState=false;
        },
        
        switchTo : function(radioId, media){
            if (radioId != currentRadio){
                media.stop();
                media.release();
                currentRadio=radioId;          
                return true;
            }
            return false;
        }
    }
});

services.factory('dataServices', function(config,radioServices,$http){
    var songsData = {};

    return {
            fetchSongsData : function(){
                return $http.get(config.dataUrl+radioServices.getCurrentRadio())
                     .success(function(data, status, headers, config){
                        songsData=data;
                });
            },

            getLengthInMilli : function(song){
                var data = song.titre_duree.split(":");
                return parseInt(data[0])*60*1000 + parseInt(data[1]*1000);
            },

            getStartTime : function(songNode){
                return songNode.titre_diffusion_date;
            },
            calculateTimeDiff : function (firstValue, secondValue){
                //firstValue is a <moment>
                //secondValue is a <moment>
                //Both must be in the same timezone
                return secondValue.diff(firstValue);
            }


    }
    
});


services.factory('favoritesServices', function(config,$rootScope,$window){

    return {
        getFavorites:function(){
            if ($window.localStorage.getItem("favorites") == null){
                $window.localStorage.setItem("favorites", JSON.stringify([]));
                return [];
            }else{
                return JSON.parse($window.localStorage.getItem("favorites"));
            }

        },

        addFavorite: function(favorite){
            var favorites = JSON.parse($window.localStorage.getItem("favorites"));
            favorites.push(favorite);
            $window.localStorage.setItem("favorites", JSON.stringify(favorites));
            $rootScope.$broadcast('favoriteAdded');
        },

        deleteFavorite: function(id){
            var favorites = JSON.parse($window.localStorage.getItem("favorites"));
            for (var i=0; i < favorites.length; i++){
                if(favorites[i].id === id){
                    favorites.splice(i, 1);
                    break;
                }
            }
            $window.localStorage.setItem("favorites", JSON.stringify(favorites));
            $rootScope.$broadcast('favoriteDeleted');
        },

        getFavoriteById : function(id){

            var customTostring=function(date){
                var result="";
                result += parseInt(date.getDate())+'-'+parseInt(date.getMonth()+1)+'-'+parseInt(date.getFullYear());
                result+=" "+parseInt(date.getHours())+":"+parseInt(date.getMinutes())+":"+parseInt(date.getSeconds());
                return result;
            };

            var favorites = JSON.parse($window.localStorage.getItem("favorites"), function (k, v) {
                if(k === "date") {return customTostring(new Date(v));}
                return v;
            });

            for (var i=0; i < favorites.length; i++){
                if(favorites[i].id === id){
                    return favorites[i];
                }
            }

        },

        getIdCounter : function(){
            if($window.localStorage.getItem("favoriteIdCounter") == null){
                $window.localStorage.setItem("favoriteIdCounter", JSON.stringify(1));
                return 0;
            }else{
                var id = JSON.parse($window.localStorage.getItem("favoriteIdCounter"));
                $window.localStorage.setItem("favoriteIdCounter", JSON.stringify(id+1));
                return id;
            }
        }


    }
});

services.factory("followUsServices", function(){
    var mediaIds=["twitter", "facebook", "youtube", "pinterest","soundcloud", "instagram"];

    return {
        getSocialMediaLink:function(id){
            var media={};
            switch(id) {
                case "twitter":
                    media={
                        link:"https://instagram.com/ESSENTIELradio",//twitter://user?screen_name=ESSENTIELradio
                        img:"img/reseaux_sociaux/twitter.png"
                    };
                    break;
                case "facebook":
                    media={
                        link:"http://www.facebook.com/ESSENTIELradio",
                        img:"img/reseaux_sociaux/facebook.png"
                    };
                    break;
                case "youtube":
                    media={
                        link:"http://www.youtube.com/user/ESSENTIELradio",
                        img:"img/reseaux_sociaux/youtube.png"
                    };
                    break;
                case "pinterest":
                    media={
                        link:"https://www.pinterest.com/essentielradio/",
                        img:"img/reseaux_sociaux/pinterest.png"
                    };
                    break;

                case "soundcloud":
                    media={
                        link:"http://soundcloud.com/essentiel-radio",
                        img:"img/reseaux_sociaux/soundcloud.png"
                    };
                    break;
                case "instagram":
                    media = {
                        link:"http://instagram.com/essentielradio",
                        img:"img/reseaux_sociaux/instagram.png"
                    };
                    break;
                default :
            }

            return media;

        },

        getSocialMediaData:function(){
            var media=[];
            for(var i=0; i< mediaIds.length; i++){
                media.push(this.getSocialMediaLink(mediaIds[i]));
            }
            return media;

        }

    }
});

services.factory("socialMediaSharingServices", function(){
    const TWITTER_NAME = "@ESSENTIELradio";
    const DEFAULT_NAME = "ESSENTIEL radio";
    return{
        getTwitterMessage:function(artist_name, title){
            return "J'écoute "+ title+" de "+artist_name+" sur l'appli mobile d'"+TWITTER_NAME+" ... et J'AIME.";
        },
        getDefaultMessage:function(artist_name, title){
            return "J'écoute "+ title+" de "+artist_name+" sur l'appli mobile d'"+DEFAULT_NAME+" ... et J'AIME.";
        }
    }

});


services.factory("alarmsServices", function(){

    return{
        getAll:function(){
            return [{"id":1}, {"id":2}]; //TODO Refactor
        }
    }

});

services.factory('podcastsServices', function(config){
    var podcasts=["campusacademy", "sequence7","journaldugospel","lactuautrement"];

    return {
        getPodcastById: function(id){
            var podcast={};
            switch(id) {
                case "campusacademy":
                    podcast={
                        img:"img/emissions/podcast_campus.svg",
                        id:"campusacademy",
                        fullName:"Campus Academy",
                        iframeSrc:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/58814059&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
                    };
                    break;
                case "letransformeur":
                    podcast={
                        img:"img/emissions/podcast_transformeur.svg",
                        id:"letransformeur",
                        fullName:"Le Transformeur",
                        iframeSrc:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/13480956&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
                    };

                    break;
                case "sequence7":
                    podcast={
                        img:"img/emissions/podcast_S7.svg",
                        id:"sequence7",
                        fullName:"Sequence 7",
                        iframeSrc:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/58734359&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
                    };

                    break;
                case "journaldugospel":
                    podcast={
                        img:"img/emissions/podcast_jdg.svg",
                        id:"journaldugospel",
                        fullName:"Journal Du Gospel",
                        iframeSrc:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/13447697&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
                    };

                    break;
                case "lactuautrement":
                    podcast={
                        img:"img/emissions/podcast_actu.svg",
                        id:"lactuautrement",
                        fullName:"L'actu Autrement",
                        iframeSrc:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/59707014&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
                    };

                    break;
                case "espoir180":
                    podcast={
                        img:"img/emissions/podcast_S7.svg",
                        id:"espoir180",
                        fullName:"Espoir 180",
                        iframeSrc:""
                    };

                    break;

                case "lyononline":
                    podcast={
                        img:"img/emissions/lyononline2014_150x150.jpg",
                        id:"lyononline",
                        fullName:"Lyon Online",
                        iframeSrc:""
                    };

                    break;
                case "goodnews":
                    podcast={
                        img:"img/emissions/good-news_150x150.jpg",
                        id:"goodnews",
                        fullName:"Good News",
                        iframeSrc:""
                    };

                    break;
                case "topfeminin":
                    podcast={
                        img:"img/emissions/topfeminin_150x150.jpg",
                        id:"topfeminin",
                        fullName:"Top Feminin",
                        iframeSrc:""
                    };
                    break;
                default:
            }
            return podcast;
        },
        getPodcasts:function(){
            var listPodcasts=[];
            // Attention a la condition d'arrêt, on fait -1 car le nombre d'élément est impair
            for(var i=0; i < podcasts.length ; i++){
                listPodcasts.push(this.getPodcastById(podcasts[i]));
            }
            return listPodcasts;
        }
    }
});


