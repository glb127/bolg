
angular.module('cloudxWebApp')
    .filter('lengthLimit', function () {
        return function (value, headLength, tailLength, ellipsis) {
            //default as format 'xxxx...xxx'

            if (!value) return '';

            headLength = parseInt(headLength, 10);
            tailLength = parseInt(tailLength, 10);

            //if headLength/tailLength is NaN(undefind, illegal number...)
            if (!headLength && headLength!=0) headLength=4; //set default length of head string as 4
            if (!tailLength && tailLength!=0) tailLength=3;  //set default length of tail string as 4

            if (value.length <= (headLength+tailLength) ) return value;

            var headValue = value.substring(0, headLength);
            var tailValue = value.substring(value.length-tailLength);

            return headValue + (ellipsis || '...') + tailValue;  //set default ellipsis format as '...'
        };
    });