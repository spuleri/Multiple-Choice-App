/**
 * Created by Dylan on 2/20/2015.
 */
'use strict';

angular.module('courses').factory('SubFinder', [
    function(){
        var desired;
        // Returns a desired object from a specified array
        function search(_id, arr) {
            arr.every(function (el) {
                if (el._id === _id) {
                    desired = el;
                    return false;
                }
                return true;
            });
            return desired;
        }

        return {
        search:search
        };
    }
]);
