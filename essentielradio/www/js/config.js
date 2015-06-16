/**
 * Created by stephaneki on 15/06/15.
 */
var config_module = angular.module('essentielradio.config', []);

var config_data = {
    'GENERAL_CONFIG': {
        "RADIO_URL":"http://www.essentielradio.com",
        "TZ":"Europe/Paris",
        "ER_ID": "er",
        "FR_ID": "fr",
        "KIDZ_ID":"kidz",
        "DATA_URL": "http://www.essentielradio.com/app/playlist_short.php?radioOnAir=",
        "PACKED_ZONE_STRING":"Europe/Paris|PMT WET WEST CEST CET WEMT|-9.l 0 -10 -20 -10 -20|0121212121212121212121212121212121212121212121212123434352543434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434|-2nco8.l cNb8.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 Ik0 5M30 WM0 1fA0 1cM0 Vx0 hB0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00"
    },
    "SOUTENIR_ER":{
        "LIEN_DON_UNIQUE":"",
        "ABONNEMENT":{
            "1_BALLON":"",
            "2_BALLON":"",
            "3_BALLON":""
        }
    },
    'IMAGE_URLS':{
        "PICTO_WEBRADIO_FR":"img/picto_webradio_fr.svg",
        "PICTO_WEBRADIO_ER":"img/picto_webradio_kidz.svg",
        "PICTO_WEBRADIO_KIDZ":"img/picto_webradio_kidz.svg",
        "BADEAU_PRESENTATION":"img/er-bandeau.jpg",
        "CARRE_NOIR":"img/carre_noir.svg",
        "ENTETE_FR":"img/en-tete_LOGO_fr.svg",
        "ENTETE_KIDZ":"img/en-tete_LOGO_kidz.svg",
        "ENTETE_ER":"img/en-tete_LOGO_er.svg",
        "BANDEAU_MENU":"img/er-bandeau.jpg",
        "BANNIERE_SOUTENIR_RADIO":"http://www.essentielradio.com/media/Page/soutenir/pagesoutien-banniere-630v7.jpg",

        "ON_ERROR_ER":"http://www.essentielradio.com/flux/notfound/er_258x258.jpg",
        "ON_ERROR_FR":"http://www.essentielradio.com/flux/notfound/fr_258x258.jpg",
        "ON_ERROR_KIDZ":"http://www.essentielradio.com/flux/notfound/kidz_258x258.jpg",

        "PLAY_IMAGE":"img/play_pause/boutonPlay.png",
        "PAUSE_IMAGE":"img/play_pause/boutonPause.png"
    },
    'STREAM_URLS':{
        "ER":"http://str81.streamakaci.com:80/",
        "FR":"http://essentielradioing.streamakaci.com/essentielfr.mp3",
        "KIDZ":"http://essentielradioing.streamakaci.com/essentielsweet.mp3"
    },
    'TOAST_STRINGS':{
        "FAVORITE_ADDED":"Favorite has been added ",
        "FAVORITE_DELETED":"Favorite has been deleted "
    }
};

angular.forEach(config_data,function(key,value) {
    config_module.constant(value,key);
});
