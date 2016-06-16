'use strict';

angular.module('cloudxWebApp')
    .controller('BillDownloadController', function ($scope, $uibModalInstance, $state, DataRule) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.currentDate = new Date();
        $scope.tip_date = {invalid: false, info: ''};

        $scope.monthFlag = true;
        $scope.activeYear = (new Date()).getFullYear(); // default as current year

        var initMonths = function() {
            var validDateBegin = new Date((new Date()).setMonth(new Date().getMonth() - 6));
            $scope.months = [];
            for(var i=0; i<12; i++) {
                var dt = new Date(0, 0, 0, 0, 0, 0, 0);

                dt.setFullYear( $scope.activeYear, i, 1);
                $scope.months.push(
                    {
                        'format': $scope.activeYear + '-' + ((i>=9)?'':'0') + (i+1),  //2015-10
                        'date': dt,
                        'valid': (validDateBegin<=dt) && (dt<=$scope.currentDate)
                    });
            }
        };
        initMonths();

        $scope.goPreviousYear = function() {
            $scope.activeYear -= 1;
            $scope.months = [];
            initMonths();
        };

        $scope.goNextYear = function() {
            $scope.activeYear += 1;
            initMonths();
        };

        $scope.openMonth = function () {
            $scope.monthFlag = true;
        };

        $scope.openDate = function () {
            $scope.monthFlag = false;
        };

        // dataPicker settings: param init
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: false,
            minMode: 'day',
            maxMode: 'day'
        };

        //对账单结束时间默认为“今天”
        $scope.endTime = new Date();

        // datePicker settings: start date
        $scope.openStartDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = true;
            $scope.endOpened = false;
            $scope.maxDate = new Date();
            $scope.minDate = new Date((new Date()).setMonth(new Date().getMonth() - 6));
        };

        // datePicker settings: end date
        $scope.openEndDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = false;
            $scope.endOpened = true;
            $scope.maxDate1 = new Date();
            $scope.minDate1 = $scope.startTime;
        };

        $scope.queryData = {
            'start-time': new Date(),
            'end-time': new Date()
        };

        /**
         * @param {string || Date} arg - download by date or month
         *
         */
        $scope.downloadBill = function (arg) {
            $scope.tip_date = {invalid: false, info: ''};

            if(arg === 'date') {    // download by date

                //$scope.endTime.setDate($scope.endTime.getDate()+1);
                //$scope.endTime.setTime($scope.endTime.getTime()-1000);

                //$scope.queryData['start-time'] = $scope.startTime;
                //$scope.queryData['end-time'] = $scope.endTime;

                if(!$scope.endTime) {
                    $scope.tip_date = { invalid: true, info: '请选择终止日期' };
                }
                else if(!$scope.startTime) {
                    $scope.tip_date = { invalid: true, info: '请选择起始日期' };
                }
                else if( ($scope.endTime-$scope.startTime)/(24*3600*1000) > 90) {
                    $scope.tip_date = { invalid: true, info: '查询范围应小于90天，请重新选择。' };
                }
                else {
                    $scope.tip_date = {invalid: false, info: ''};
                    $scope.queryData['start-time'] = $scope.startTime;
                    $scope.queryData['end-time'] = $scope.endTime;
                }
            }
            else if (!arg.valid) {      // download by month: when month's invalid
                $scope.tip_date = {invalid: true, info: ''};
            } else if (arg.date.getMonth() == $scope.currentDate.getMonth()) {   // download by month: when current month
                $scope.queryData['start-time'] = new Date(arg.date);
                $scope.queryData['end-time'] = new Date($scope.currentDate);
            } else {                                                        // download by month
                var tmpStartDate = new Date(arg.date);
                var tmpEndDate = new Date(arg.date);
                tmpEndDate.setFullYear($scope.activeYear);
                tmpEndDate.setMonth(tmpEndDate.getMonth()+1);
                tmpEndDate.setTime(tmpEndDate.getTime()-1000);

                $scope.queryData['start-time'] = tmpStartDate;
                $scope.queryData['end-time'] = tmpEndDate;
            }

            if (!$scope.tip_date.invalid) {
                $scope.getPromise = DataRule.getBill($scope.queryData).then(
                    function (response) {
                        $scope.downloadPath = response.data.path;

                        // 模拟 click link
                        var aLink = document.createElement('a');
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('click', false, false);
                        aLink.download = response.data.path;
                        aLink.href = response.data.path;
                        aLink.dispatchEvent(evt);
                    });
            }
        };
    });
