/**
 * Created by stephaneki on 05/05/15.
 */

angular.module('essentielradio.directives', [])

    .directive('noImage', function (imgOnError) {

        var setDefaultImage = function (el) {
            el.attr('src', imgOnError.getErrorImg());
        };

        return {
            restrict: 'A',
            link: function (scope, el, attr) {
                scope.$watch(function() {
                    return attr.ngSrc;
                }, function () {
                    var src = attr.ngSrc;

                    if (!src) {
                        setDefaultImage(el);
                    }
                });

                el.bind('error', function() { setDefaultImage(el); });
            }
        };
    })

    .directive('iframeSetDimentionsOnload', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                element.on('load', function(){
                    /* Set the dimensions here,
                     I think that you were trying to do something like this: */

                    var iFrameHeight; //element.contentWindow.document.body.scrollHeight + 'px'; //TODO its not working
                    var iFrameWin = element.contentWindow || element.contentDocument.parentWindow;
                    if(iFrameWin.document.body){
                        iFrameHeight = iFrameWin.document.documentElement.scrollHeight || iFrameWin.document.body.scrollHeight;
                    }

                    iFrameHeight+="px";
                    var iFrameWidth = '100%';
                    element.css('width', iFrameWidth);
                    element.css('height', iFrameHeight);
                })
            }
        }});


