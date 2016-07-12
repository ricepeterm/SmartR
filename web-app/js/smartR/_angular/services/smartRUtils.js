//# sourceURL=smartRUtils.js

'use strict';

window.smartRApp.factory('smartRUtils', ['$q', function($q) {

    var service = {};

    service.conceptBoxMapToConceptKeys = function smartRUtils_conceptBoxMapToConceptKeys(conceptBoxMap) {
        var allConcepts = {};
        Object.keys(conceptBoxMap).forEach(function(group) {
            var concepts = conceptBoxMap[group].concepts;
            concepts.forEach(function(concept, idx) {
                allConcepts[group + '_' + 'n' + idx] = concept;
            });
        });
        return allConcepts;
    };

    /**
     * Creates a CSS safe version of a given string
     * This should be used consistently across the whole of SmartR to avoid data induced CSS errors
     *
     * @param str
     * @returns {string}
     */
    service.makeSafeForCSS = function smartRUtils_makeSafeForCSS(str) {
        return String(str).replace(/[^a-z0-9]/g, function(s) {
            var c = s.charCodeAt(0);
            if (c === 32) {
                return '-';
            }
            if (c >= 65 && c <= 90) {
                return '_' + s.toLowerCase();
            }
            return '__' + ('000' + c.toString(16)).slice(-4);
        });
    };

    service.getElementWithoutEventListeners = function(cssSelector) {
        var element = document.getElementById(cssSelector);
        var copy = element.cloneNode(true);
        element.parentNode.replaceChild(copy, element);
        return copy;
    };

    service.shortenConcept = function smartRUtils_shortenConcept(concept) {
        var split = concept.split('\\');
        split = split.filter(function(str) { return str !== ''; });
        return split[split.length - 2] + '/' + split[split.length - 1];
    };

    $.fn.textWidth = function(text, css) {
        if (!$.fn.textWidth.fakeEl) {
            $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        }
        var textEl = $.fn.textWidth.fakeEl.text(text || this.val() || this.text());
        if (css) {
            for (var key in css) {
                if (css.hasOwnProperty(key)) {
                    textEl.css(key, css[key]);
                }
            }
        } else {
            textEl.css('font', this.css('font'));
        }
        return $.fn.textWidth.fakeEl.width();
    };

    service.getTextWidth = function(text, font) {
        return $.fn.textWidth(text, font);
    };

    service.scaleFont = function(text, css, startSize, targetWidth, shrinkStep)  {
        var fontSize = startSize;
        css['font-size'] = fontSize + 'px';
        while (service.getTextWidth(text, css) > targetWidth) {
            fontSize -= shrinkStep;
            css['font-size'] = fontSize + 'px';
        }
        return fontSize;
    };

    /**
     * Executes callback with scroll position when SmartR mainframe is scrolled
     * @param function
     */
    service.callOnScroll = function(callback) {
        $('#sr-index').parent().scroll(function() {
            var scrollPos = $(this).scrollTop();
            callback(scrollPos);
        });
    };

    service.prepareWindowSize = function(width, height) {
        $('#heim-tabs').css('min-width', parseInt(width) + 25);
        $('#heim-tabs').css('min-height', parseInt(height) + 25);
    };

    /**
    * removes all kind of elements that might live out of the viz directive (e.g. tooltips, contextmenu, ...)
    */
    service.cleanUp = function() {
        $('.d3-tip').remove();
    };

    service.countCohorts = function() {
        return !window.isSubsetEmpty(1) + !window.isSubsetEmpty(2);
    };

    service.getSubsetIds = function smartRUtil_getSubsetIds() {
        var defer = $q.defer();

        function resolveResult() {
            var res = window.GLOBAL.CurrentSubsetIDs.slice(1).map(function (v) {
                return v || null;
            });
            if (res.some(function (el) {
                    return el !== null;
                })) {
                defer.resolve(res);
            } else {
                defer.reject();
            }
        }

        for (var i = 1; i <= window.GLOBAL.NumOfSubsets; i++) {
            if (!window.isSubsetEmpty(i) && !window.GLOBAL.CurrentSubsetIDs[i]) {
                window.runAllQueries(resolveResult);
                return defer.promise;
            }
        }

        resolveResult();

        return defer.promise;
    };

    /**
     * Some cool Array functions
     */

    // fast unique()
    service.unique = function(arr) {
        var a = [];
        for (var i = 0, l = arr.length; i < l; i++)
            if (a.indexOf(arr[i]) === -1 && arr[i] !== ''){
                a.push(arr[i]);
            }
        return a;
    };

    return service;
}]);
