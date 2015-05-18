describe('dataServices Unit Tests', function(){
    var dataServices;
    var song = {
        "artiste_nom":"STF",
        "titre_id":"25178",
        "titre_nom":"Prisonnier du mensonge (feat. Eline)",
        "titre_image":"http:\/\/www.essentielradio.com\/flux\/images\/stf-prisonier-du-mensonge.jpg",
        "titre_lien":"","album_titre":"Prisonnier du mensonge",
        "artiste_biographie":"",
        "artiste_id":"2200",
        "titre_diffusion_date":"2015-04-01 02:37:49",
        "titre_duree":"03:41","titre_paroles":""
    };

    var tz = "Europe/Paris";

    beforeEach(module('essentielradio.services'));

    beforeEach(inject(function (_dataServices_) {
        dataServices = _dataServices_;
    }));

    it('can get an instance of my factory', inject(function(dataServices) {
        expect(dataServices).toBeDefined();
    }));

    it('can get the get the start time', inject(function(dataServices) {       
        expect(dataServices.getStartTime(song)).toBe(song.titre_diffusion_date);
    }));

    it('can calculate the song length in milisecond', inject(function(dataServices) {       
        expect(dataServices.getLengthInMilli(song)).toBe((3*60+41)*1000);
    }));

    it('can calculate time difference between two dates', inject(function(dataServices) {
        var p="Europe/Paris|PMT WET WEST CEST CET WEMT|-9.l 0 -10 -20 -10 -20|0121212121212121212121212121212121212121212121212123434352543434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434|-2nco8.l cNb8.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 Ik0 5M30 WM0 1fA0 1cM0 Vx0 hB0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00";
        moment.tz.add(p);
        var first = moment.tz('2013-02-08 09:30:26', tz);
        var second = moment.tz('2013-02-08 09:30:27', tz);  
        expect(dataServices.calculateTimeDiff(first, first)).toEqual(0);
        expect(dataServices.calculateTimeDiff(first, second)).toEqual(1000);
    }));


});