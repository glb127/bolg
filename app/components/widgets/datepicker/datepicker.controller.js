angular.module('cloudxWebApp')
    .controller('DatepickerCtrl', function ($scope) {
        var nowDate=new Date();


        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.openStartDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = true;
            $scope.endOpened = false;
            $scope.timeType="other";
            $scope.maxDate = new Date();
            $scope.minDate=new Date((new Date()).setMonth(nowDate.getMonth()-6));
        };

        $scope.openEndDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = false;
            $scope.endOpened = true;
            $scope.timeType="other";
            $scope.maxDate1 = new Date();
            $scope.minDate1 = $scope.conditionDTO.leftTime;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: false,
            mixMode: 'day',
            maxMode: 'day'
        };

        $scope.validate_name = function() {
            if(($scope.conditionDTO.rightTime!="")&&($scope.conditionDTO.rightTime!=null)&&($scope.conditionDTO.rightTime!=undefined))
                if($scope.conditionDTO.leftTime > $scope.conditionDTO.rightTime){
                    $scope.tip_name = {invalid: true, info: '终止日期不能小于起始日期'}; 
                }
                else{
                    $scope.tip_name={invalid:false};
                }
             return !($scope.tip_name.invalid);
        };
        

        $scope.formats = ['yyyy/MM/dd', 'dd.MM.yyyy', 'dd-MMMM-yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

    });
