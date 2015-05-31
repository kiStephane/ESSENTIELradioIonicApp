/**
 * Created by stephaneki on 30/05/15.
 */

angular.module('essentielradio.filters', [])

    .filter('daysListToText', function() {
        return function(daysList) {
            var concatString="";
            function concatDaysLabels(element, index, array){
                concatString+=element.text.slice(0,3)+'. ';
            }

            daysList.filter(function (element){
                return element.checked;
            }).forEach(concatDaysLabels);
            return concatString;
        };
    });
