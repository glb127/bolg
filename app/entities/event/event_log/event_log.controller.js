'use strict';

angular.module('cloudxWebApp')
    .controller('EventLogController', function($scope, $state, $stateParams, ParseLinks, EventLog, EventLogCondition, apiEventLog, EventLogInstance, apiParameter) {

        var today = new Date();
        var queryType = 'regular'; // default: 'regular', query by keyword: 'keyword', query by encrypted
        // keyword'encryption';

        //展开/收起高级搜索
        $scope.collapse = false;
        $scope.colExp = function() {
            $scope.collapse = !($scope.collapse);
        };
        $scope.urlParam = { code: $stateParams.dcode, value: $stateParams.dvalue, name: $stateParams.dname };
        // if query by encryption
        var searchParameter = $stateParams.queryCondition;
        if (!!searchParameter.type) {
            $scope.collapse = true;

            if (searchParameter.type === 'encrypt') {
                queryType = 'encryption';
            } else if (searchParameter.type === 'keyword') {
                queryType = 'keyword';
            }
        }

        $scope.init = function() {
            $scope.tip_keyword = { invalid: false, info: '' };
            $scope.tip_page = { invalid: false, info: '' };
            $scope.tip_queryCondition = { invalid: false, info: '' };

            $scope.eventCounts = {
                'riskEventLogCounts': 0, //查询结果总条数
                'releaseRiskEventLogCounts': 0, //放行
                'releaseProportion': '0.00%',
                'preventRiskEventLogCounts': 0, //阻止
                'preventProportion': '0.00%',
                'missRiskEventLogCounts': 0, //未命中
                'missProportion': '0.00%'
            };

            $scope.pages = 0; // Number 总页数
            $scope.eventLogs = []; // 事件列表
            $scope.pageSize = 20; // Number 每页的条目数
            $scope.pageNumber = 1; // Number 页码
            $scope.startTime = new Date(new Date().setDate(today.getDate() - 6));
            $scope.endTime = new Date();
            $scope.keyword = '';
            $scope.isLink = {};

            $scope.dateRangeCode = 1; // Number 时间范围；默认选择'今天'

            $scope.dateRanges = ['今天', '最近一周', '近一个月', '近三个月'];

            // datePicker settings: params init
            $scope.dateOptions = {
                maxDate: new Date(),
                minDate: new Date(new Date().setMonth(today.getMonth() - 6)),
                formatYear: 'yy',
                startingDay: 1,
                showWeeks: false,
                mixMode: 'day',
                maxMode: 'day'
            };

            $scope.tip_date = { invalid: false, info: '' };
            $scope.tip_keyword = { invalid: false, info: '' }; // tip of keyword search field

            $scope.riskLevels = [
                { 'code': '', 'name': '全部' },
                { 'code': '4', 'name': '极高风险' },
                { 'code': '3', 'name': '高风险' },
                { 'code': '2', 'name': '中风险' },
                { 'code': '1', 'name': '低风险' },
                { 'code': '0', 'name': '极低风险' },
                { 'code': '-1', 'name': '无风险' }
            ];

            //用于搜索条件中评估结果字段显示
            $scope.retCodes_A = [
                { 'code': '', 'name': '全部' },
                { 'code': '9999', 'name': '阻止' },
                { 'code': '0000', 'name': '放行' },
                { 'code': '-1', 'name': '未命中规则' }
            ];

            $scope.policies = [
                { 'code': '', 'name': '全部' },
                { 'code': 'deny', 'name': '阻止' },
                { 'code': 'review', 'name': '人工审核' },
                { 'code': 'pass', 'name': '放行' }
            ];

            //用于搜索结果中评估结果字段显示
            $scope.retCodes = [
                { 'code': '', 'name': '全部' },
                { 'code': '9999', 'name': '阻止' },
                { 'code': '0000', 'name': '放行' },
                { 'code': '-1', 'name': '未命中' }
            ];

            $scope.isHits = [
                { 'code': '', 'name': '全部' },
                { 'code': '0', 'name': '命中' },
                { 'code': '1', 'name': '未命中' },
            ];

            $scope.marks = [
                { 'code': '', 'name': '全部' },
                { 'code': '1', 'name': '有风险' },
                { 'code': '0', 'name': '无风险' },
            ];

            $scope.queryConditions = {
                'startTime': $scope.startTime, // Date 时间范围：开始时间
                'endTime': $scope.endTime, // Date 事件范围：结束时间
                'strategyCode': '', //攻略实例Code
                'scenarioTypeCode': '', //场景实例code
                'isHit': '',
                'solutionId': '',
                'policy': '',
                'mark': '',
                'dimension': '',
                'parameter': '',
                'content': '',
                'platform': '',
                'ruleId': '',
                'pageSize': $scope.pageSize, //每页条目数
                'pageNumber': $scope.pageNumber //当前页
            };

            $scope.queryKeyword = {
                //'keywordType': 'eventId',  // String 关键词的维度；默认选择{'code': 'eventId', 'name': '事件ID'}
                'keywordType': '', // String 关键词的维度；默认不选
                'keyword': '', // String 关键词
                'startTime': new Date(), // Date 时间范围：开始时间
                'endTime': new Date(), // Date 事件范围：结束时间
                'page': $scope.page, // Number 页码
                'per_page': $scope.per_page // Number 每页条目数
            };

            // datePicker settings: start date
            $scope.openStartDate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.startOpened = true;
                $scope.endOpened = false;
                $scope.maxDate = new Date();
                $scope.minDate = new Date((new Date()).setMonth(new Date().getMonth() - 6));
            };

            // datePicker settings: end date
            $scope.openEndDate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.startOpened = false;
                $scope.endOpened = true;
                $scope.maxDate1 = new Date();
                $scope.minDate1 = $scope.startTime;
            };

            // get dimension list
            $scope.getDimension = function() {
                $scope.dimensions = [];
                apiEventLog.getDimensions({}, function(result) {
                    for (var i = 0, len = result.length; i < len; i++) {
                        $scope.dimensions.push(result[i]);
                        if (result[i].name === 'IP') {
                            $scope.isLink.ip = true;
                            $scope.isLink.dimension = result[i].id;
                        }
                    }
                });
            };
            $scope.getDimension();

            //get strategy instance list & platform list
            $scope.getCondition = function() {
                $scope.strategyConditions = [];
                apiEventLog.getStrategies({}, function(result) {
                    for (var i = 0, len = result.length; i < len; i++) {
                        $scope.strategyConditions.push(result[i]);
                    }
                });
            };
            $scope.getCondition();

            $scope.getParameter = function() {
                $scope.keywordTypes = [];
                apiEventLog.getParameters({}, function(result) {
                    for (var i = 0, len = result.length; i < len; i++) {
                        $scope.keywordTypes.push(result[i]);
                        if (result[i].parameterCode === 'user_id') {
                            $scope.isLink.userId = true;
                        }
                        if (result[i].parameterCode === 'device_id') {
                            $scope.isLink.deviceId = true;
                        }
                    }
                });
            };
            $scope.getParameter();

            $scope.changeRule();

            apiParameter.getDic({}, function(data) {
                $scope.dicMap = data;
                $scope.query();
            });


        };

        $scope.changeRule = function() {
            apiEventLog.getRules({ strategyCode: $scope.queryConditions.strategyCode, scenarioTypeCode: $scope.queryConditions.scenarioTypeCode, solutionId: $scope.queryConditions.solutionId }, function(data) {
                $scope.ruleList = data;
            });
        };
        $scope.init();

        $scope.changeListMark = function(mongoId, mark) {
            for (var i = 0; i < $scope.eventLogs.length; i++) {
                if ($scope.eventLogs[i].mongoId == mongoId) {
                    $scope.eventLogs[i].mark = mark;
                }
            }
        };
        EventLogInstance.changeListMark = $scope.changeListMark;

        $scope.chosenStrategyName = '';
        $scope.setStrategy = function(item) {
            $scope.scenarioConditions = [];
            if (item === '') {
                $scope.chosenStrategyName = '全部';
                $scope.queryConditions.strategyCode = '';
            } else {
                $scope.chosenStrategyName = item.strategyName;
                $scope.tip_strategy = { invalid: false, info: '' };

                //get scenario instance list by chosen strategy instance
                $scope.queryConditions.strategyCode = item.strategyCode;
                //$scope.scenarioConditions = item.scenarioInstanceDTOs;
                apiEventLog.getScenarios({ strategyId: item.strategyId }, function(result) {
                    for (var i = 0, len = result.length; i < len; i++) {
                        $scope.scenarioConditions.push(result[i]);
                    }
                });
                //$scope.tip_queryCondition = {invalid: true, info: '请选择场景'};
            }
            $scope.setScenario('');
        };

        $scope.chosenScenarioName = '';
        $scope.setScenario = function(index) {
            $scope.solutionConditions = [];
            if (index === '') {
                $scope.chosenScenarioName = '';
                $scope.queryConditions.scenarioTypeCode = '';
            } else if (index == -1) {
                $scope.chosenScenarioName = '全部';
                $scope.queryConditions.scenarioTypeCode = '';
            } else {
                $scope.chosenScenarioName = $scope.scenarioConditions[index].name;
                $scope.queryConditions.scenarioTypeCode = $scope.scenarioConditions[index].code;
                apiEventLog.getSolutions({ scenarioId: $scope.scenarioConditions[index].id }, function(result) {
                    for (var i = 0, len = result.length; i < len; i++) {
                        $scope.solutionConditions.push(result[i]);
                    }
                });
            }
            $scope.setSolution('');
        };

        $scope.chosenSolutionName = '';
        $scope.setSolution = function(index) {
            if (index === '') {
                $scope.chosenSolutionName = '';
                $scope.queryConditions.solutionId = '';
            } else if (index === -1) {
                $scope.chosenSolutionName = '全部';
                $scope.queryConditions.solutionId = '';
            } else {
                $scope.chosenSolutionName = $scope.solutionConditions[index].name;
                $scope.queryConditions.solutionId = $scope.solutionConditions[index].id;
            }
            $scope.changeRule();
        };
        $scope.chosenIsHit = '';
        $scope.setIsHit = function(index) {
            $scope.chosenIsHit = $scope.isHits[index].name;
            $scope.queryConditions.isHit = $scope.isHits[index].code;
            if ($scope.queryConditions.isHit === '1') {
                $scope.policies = [{ 'code': 'pass', 'name': '放行' }];
                $scope.chosenPolicyName = '放行';
                $scope.queryConditions.policy = 'pass';
            } else {
                $scope.policies = [
                    { 'code': '', 'name': '全部' },
                    { 'code': 'deny', 'name': '阻止' },
                    { 'code': 'review', 'name': '人工审核' },
                    { 'code': 'pass', 'name': '放行' }
                ];
                $scope.chosenPolicyName = '';
                $scope.queryConditions.policy = '';
            }
        };

        $scope.chosenMarkName = '';
        $scope.setMark = function(index) {
            $scope.chosenMarkName = $scope.marks[index].name;
            $scope.queryConditions.mark = $scope.marks[index].code;
        };

        $scope.chosenPolicyName = '';
        $scope.setPolicy = function(index) {
            $scope.chosenPolicyName = $scope.policies[index].name;
            $scope.queryConditions.policy = $scope.policies[index].code;
        };

        $scope.validateDate = function() {
            $scope.chosenDateRangeName = '';
            $scope.dateRangeCode = -1;
            $scope.tip_date = { invalid: false, info: '' };

            var startMonth = $scope.startTime.getMonth() + 1,
                endMonth = $scope.endTime.getMonth() + 1,
                startDate = $scope.startTime.getDate(),
                endDate = $scope.endTime.getDate(),
                startYear = $scope.startTime.getFullYear(),
                endYear = $scope.endTime.getFullYear();
            //判断小于3个月
            if (endYear - startYear > 1) {
                $scope.tip_date = { invalid: true, info: '查询范围应小于3个月，请重新选择。' };
                return;
            }
            if (endYear - startYear == 1) {
                endMonth += 12;
            }
            if (endMonth - startMonth > 3 || (endMonth - startMonth == 3 && endDate - startDate > 0)) {
                $scope.tip_date = { invalid: true, info: '查询范围应小于3个月，请重新选择。' };
            } else {
                $scope.tip_date = { invalid: false, info: '' };
                //$scope.query();
            }
            /*if(!$scope.endTime) {
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
                $scope.query();
            }*/
        };

        $scope.chosenDateRangeName = '';
        $scope.setDateRange = function(index) {
            $scope.dateRangeCode = index;
            $scope.chosenDateRangeName = $scope.dateRanges[$scope.dateRangeCode];

            $scope.startTime = new Date();
            $scope.endTime = new Date();

            switch (index) {
                case 0:
                    // today
                    break;
                case 1:
                    $scope.startTime.setDate(today.getDate() - 6); // last week
                    break;
                case 2:
                    $scope.startTime.setMonth(today.getMonth() - 1); // last month
                    break;
                case 3:
                    $scope.startTime.setMonth(today.getMonth() - 3); //last 3 months
                    break;
                default:
                    // default as today
            }
            $scope.tip_date = { invalid: false, info: '' };

            //$scope.query();
        };

        $scope.chosenKeywordType = '';
        $scope.setKeywordType = function(keywordType) {
            $scope.tip_keyword = { invalid: false, info: '' };
            if (keywordType.parameterName) {
                $scope.chosenKeywordType = keywordType.parameterName;
                $scope.queryConditions.parameter = keywordType.parameterCode;
                $scope.queryConditions.dimension = '';
            } else {
                $scope.chosenKeywordType = keywordType.name;
                $scope.queryConditions.dimension = keywordType.id;
                $scope.queryConditions.parameter = '';
            }
            //$scope.queryKeyword.keywordType = keywordTypeCode;  //set keyword type
            //$scope.queryKeyword.keyword = '';   // clear keyword field
        };

        $scope.setKeyword = function() {
            $scope.tip_keyword = { invalid: false, info: '' };
        };

        var resetPage = function() {
            $scope.pageNumber = 1;
        };

        var resetSearchConditions = function() {
            /*
            // date range: reset as 'last 3 months'
            $scope.dateRangeCode = 3;
            $scope.startTime = new Date();
            $scope.startTime.setMonth(today.getMonth() - 3);  //last 3 months
            $scope.endTime = new Date();
            */
            $scope.chosenDateRangeName = '';
            $scope.chosenStrategyName = '';
            $scope.chosenScenarioName = '';
            $scope.chosenPolicyName = '';
            $scope.chosenSolutionName = '';
            $scope.chosenIsHit = '';
            $scope.chosenMarkName = '';

            $scope.dateRangeCode = 1;
            //$scope.startTime = new Date();
            //$scope.endTime = new Date();
            //$scope.startTime.setMonth(today.getMonth() - 3);  //last 3 months
            //$scope.startTime = '';

            $scope.queryConditions.strategyCode = '';
            $scope.queryConditions.scenarioTypeCode = '';
            $scope.queryConditions.solutionId = '';
            $scope.queryConditions.isHit = '';
            $scope.queryConditions.policy = '';
            $scope.queryConditions.mark = '';
        };
        $scope.isHitMap = {
            '0': '命中',
            '1': '未命中'
        };
        $scope.platformMap = {
            '0': 'iOS',
            '1': 'Android',
            '2': 'Web'
        };
        $scope.policyMap = {
            'pass': '放行',
            'deny': '阻止',
            'review': '人工审核'
        };
        $scope.markMap = {
            '0': '无风险',
            '1': '有风险',
            '': ''
        };

        $scope.query = function() {
            if ($scope.tip_date.invalid) {
                return;
            }
            resetPage();
            queryType = 'regular';
            $scope.tip_keyword = { invalid: false, info: '' };
            $scope.tip_page = { invalid: false, info: '' };

            //$scope.queryKeyword.keywordType = '';
            //$scope.queryKeyword.keyword = '';

            if (!$scope.startTime) {
                $scope.startTime = new Date();
                $scope.startTime.setMonth(today.getMonth() - 3); //last 3 months
            } else if (!$scope.endTime) {
                $scope.endTime = new Date();
            }

            $scope.queryConditions.pageSize = $scope.pageSize;
            $scope.queryConditions.pageNumber = $scope.pageNumber;
            $scope.queryConditions.startTime = $scope.startTime;
            $scope.queryConditions.endTime = $scope.endTime;
            if ($scope.ruleEnt && $scope.ruleEnt.ruleId) {
                $scope.queryConditions.ruleId = $scope.ruleEnt.ruleId;
                $scope.queryConditions.content = $scope.ruleEnt.ruleName;
            } else {
                $scope.queryConditions.ruleId = '';
            }
            if ($scope.queryKeyword.keyword === '') {
                $scope.queryConditions.dimension = '';
                $scope.queryConditions.parameter = '';
                $scope.chosenKeywordType = '';
            } else {
                $scope.queryConditions.content = $scope.queryKeyword.keyword;
                if ($scope.queryConditions.parameter in $scope.dicMap) {
                    for (var entTmp in $scope.dicMap[$scope.queryConditions.parameter]) {
                        if ($scope.dicMap[$scope.queryConditions.parameter][entTmp] == $scope.queryConditions.content) {
                            $scope.queryConditions.content = entTmp;
                            break;
                        }
                    }
                }
            }

            if (!$scope.queryConditions.ruleId && !$scope.queryConditions.dimension && !$scope.queryConditions.parameter) {
                $scope.queryConditions.content = '';
            }

            $scope.queryPromise = apiEventLog.getCounts($scope.queryConditions, function(data) {
                $scope.eventCounts = {
                    'riskEventLogCounts': data.eventLogCounts, //查询结果总条数
                    'releaseRiskEventLogCounts': data.passRiskEventLogCounts, //放行
                    'releaseProportion': data.passProportion,
                    'preventRiskEventLogCounts': data.denyRiskEventLogCounts, //阻止
                    'preventProportion': data.denyProportion,
                    'missRiskEventLogCounts': data.reviewRiskEventLogCounts, //未命中
                    'missProportion': data.reviewProportion
                };
                $scope.queryPromise = apiEventLog.get($scope.queryConditions, function(data) {
                    $scope.eventLogs = data.content;
                    $scope.pages = $scope.eventCounts.riskEventLogCounts ? Math.ceil($scope.eventCounts.riskEventLogCounts / $scope.pageSize) : 0;
                    $scope.page = $scope.queryConditions.pageNumber;
                });
            });
        };

        //del
        // show search button when input field's focused
        $scope.showSearchBtn = function(event) {
            var inputField = angular.element(event.target),
                searchBtn = angular.element(event.target.nextElementSibling);

            // show search button
            searchBtn.removeClass('ud_hide');
            searchBtn.show();

            angular.element('body').bind('click', function(e) {
                var targetElement = e.target;

                if (!(searchBtn.is(targetElement) || inputField.is(targetElement))) {
                    angular.element('body').unbind('click');
                    searchBtn.hide();
                }
            });
        };

        $scope.queryByPage = function(event) {
            var numReg = /[0-9]/;

            if (event.which === 13) {
                if (!$scope.page) {
                    $scope.tip_page = { invalid: true, info: '请输入页码！' };
                    return false;
                } else if (!(numReg.test($scope.page))) {
                    $scope.tip_page = { invalid: true, info: '页码格式不正确，请重新输入！' };
                } else if ($scope.page < 1 || $scope.page > $scope.pages) {
                    $scope.tip_page = { invalid: true, info: '此页码不存在，请重新输入！' };
                } else {
                    $scope.page = parseInt($scope.page);
                    $scope.tip_page = { invalid: false, info: '' };
                    $scope.loadPage($scope.page);
                    event.preventDefault();
                }
            }
        };

        //query when user press ENTER key
        $scope.queryByKeywordWithEnterKey = function(event) {
            if (event.which === 13) {
                $scope.query();
                //$scope.queryByKeyword();
                event.preventDefault();
            }
        };

        /*$scope.queryByKeyword = function() {
            resetPage();
            resetSearchConditions();
            queryType = 'keyword';
            $scope.tip_queryCondition = { invalid: false, info: '' };
            $scope.tip_page = { invalid: false, info: '' };

            $scope.queryKeyword.pageSize = $scope.pageSize;
            $scope.queryKeyword.pageNumber = $scope.pageNumber;
            $scope.queryKeyword.startTime = $scope.startTime;
            $scope.queryKeyword.endTime = $scope.endTime;

            var validate_keyword = function() {
                if (!$scope.queryKeyword.keywordType) {
                    $scope.tip_keyword = { invalid: true, info: '请选择关键词维度' };
                    return false;
                } else if (!$scope.queryKeyword.keyword) {
                    $scope.tip_keyword = { invalid: true, info: '请填写关键词' };
                    return false;
                } else {
                    return true;
                }
            };

            if (validate_keyword()) {
                apiEventLog.get(queryConditions, function(response) {
                    //$scope.queryPromise = EventLog.queryByKeyword($scope.queryKeyword).then(
                    $scope.eventCounts = {
                        'riskEventLogCounts': response.totalElements,
                        'releaseRiskEventLogCounts': response.data.releaseRiskEventLogCounts,
                        'releaseProportion': response.data.releaseProportion,
                        'preventRiskEventLogCounts': response.data.preventRiskEventLogCounts,
                        'preventProportion': response.data.preventProportion,
                        'missRiskEventLogCounts': response.data.missRiskEventLogCounts,
                        'missProportion': response.data.missProportion
                    };
                    $scope.eventLogs = response.content;

                    $scope.pages = $scope.eventCounts.riskEventLogCounts ? Math.ceil($scope.eventCounts.riskEventLogCounts / $scope.pageSize) : 0;

                    if ($scope.resultCount) {
                        for (var i = 0; i < $scope.eventLogs.length; i++) {
                            translate($scope.eventLogs[i]);
                        }
                    }

                    if (!!$scope.eventLogs) {
                        for (var i = 0; i < $scope.eventLogs.length; i++) {
                            translate($scope.eventLogs[i]);
                        }
                    }

                    if (response.headers('link')) {
                        $scope.links = ParseLinks.parse(response.headers('link'));
                        if (!$scope.links.last) {
                            $scope.pageSize = 0;
                        }
                    }
                });
            }

        };*/

        $scope.queryByGivenId = function(keywordTypeCode, givenId) {
            $scope.queryConditions.dimension = '';
            $scope.queryConditions.ruleId = '';
            resetPage();
            resetSearchConditions();
            queryType = 'keyword';
            $scope.tip_queryCondition = { invalid: false, info: '' };
            $scope.tip_keyword = { invalid: false, info: '' };
            $scope.tip_page = { invalid: false, info: '' };
            //event.preventDefault();
            if (keywordTypeCode === 'IP') {
                $scope.queryConditions.dimension = $scope.isLink.dimension;
                $scope.queryConditions.content = givenId;
                $scope.queryConditions.parameter = '';
                for (var i = $scope.dimensions.length - 1; i >= 0; i--) {
                    if ($scope.dimensions[i].name === keywordTypeCode) {
                        $scope.chosenKeywordType = $scope.dimensions[i].name;
                        console.log($scope.dimensions[i].name);
                    }
                }
            } else {
                $scope.queryConditions.content = givenId;
                $scope.queryConditions.parameter = keywordTypeCode;
                $scope.queryConditions.dimension = '';
                for (var i = $scope.keywordTypes.length - 1; i >= 0; i--) {
                    if ($scope.keywordTypes[i].parameterCode === keywordTypeCode) {
                        $scope.chosenKeywordType = $scope.keywordTypes[i].parameterName;
                    }
                }
            }
            $scope.queryKeyword.keyword = givenId;
            $scope.queryKeyword.keywordType = keywordTypeCode;
            $scope.query();
            //$scope.queryByKeyword();
        };

        $scope.queryByEncryptedKeyword = function(keywordType, encryptKeyword, keyword) {
            resetPage();
            queryType = 'encryption';

            if (searchParameter.keywordType) {
                $scope.queryEncrypedKeyword = {
                    'keywordType': searchParameter.keywordType, // String 关键词的维度；
                    'encryptKeyword': searchParameter.encryptKeyword, // String 关键词
                    'startTime': new Date((new Date()).setMonth(new Date().getMonth() - 3)), // Date 时间范围：开始时间
                    //'startTime': new Date(),    // Date 时间范围：默认事件时间为今天？
                    //'startTime': $scope.startTime,    // Date 时间范围：开始时间
                    'endTime': $scope.endTime, // Date 时间范围：结束时间
                    'pageSize': $scope.pageSize, // Number 页码
                    'pageNumber': $scope.pageNumber // Number 每页条目数
                };
            } else {
                $scope.startTime = new Date((new Date()).setMonth(new Date().getMonth() - 3));
                $scope.queryEncrypedKeyword = {
                    'keywordType': keywordType, // String 关键词的维度；
                    'encryptKeyword': encryptKeyword, // String 关键词
                    'startTime': $scope.startTime, // Date 时间范围：开始时间
                    'endTime': $scope.endTime, // Date 时间范围：结束时间
                    'pageSize': $scope.pageSize, // Number 页码
                    'pageNumber': $scope.pageNumber // Number 每页条目数
                };
            }


            $scope.queryPromise = EventLog.queryByEncryptedKeyword($scope.queryEncrypedKeyword).then(
                function(response) {
                    $scope.eventCounts = {
                        'riskEventLogCounts': response.data.riskEventLogCounts,
                        'releaseRiskEventLogCounts': response.data.releaseRiskEventLogCounts,
                        'releaseProportion': response.data.releaseProportion,
                        'preventRiskEventLogCounts': response.data.preventRiskEventLogCounts,
                        'preventProportion': response.data.preventProportion,
                        'missRiskEventLogCounts': response.data.missRiskEventLogCounts,
                        'missProportion': response.data.missProportion
                    };
                    $scope.eventLogs = response.data.searchedEventLogDTO;

                    $scope.pages = $scope.eventCounts.riskEventLogCounts ? Math.ceil($scope.eventCounts.riskEventLogCounts / $scope.pageNumber) : 0;

                    if (!!$scope.eventLogs) {
                        for (var i = 0; i < $scope.eventLogs.length; i++) {
                            translate($scope.eventLogs[i]);
                        }
                    }

                    if (response.headers('link')) {
                        $scope.links = ParseLinks.parse(response.headers('link'));
                        if (!$scope.links.last) {
                            $scope.pageSize = 0;
                        }
                    }

                    $scope.queryKeyword.keywordType = keywordType ? keywordType : searchParameter.keywordType;
                    $scope.queryKeyword.keyword = keyword ? keyword : $scope.eventLogs[0][searchParameter.keywordType];


                });
        };

        $scope.queryByGivenEncryptedId = function(keywordTypeCode, encryptedId, id) {
            event.preventDefault();
            $scope.queryByEncryptedKeyword(keywordTypeCode, encryptedId, id);
        };

        $scope.loadPage = function(page) {
            $scope.tip_page = { invalid: false, info: '' };

            $scope.pageNumber = page;
            $scope.loadAll();
        };

        /**
         * @description 分页：请求下一页时，根据查询类型发送查询请求
         *
         */
        $scope.loadAll = function() {

            switch (queryType) {
                case 'regular':
                    $scope.queryConditions.pageSize = $scope.pageSize;
                    $scope.queryConditions.pageNumber = $scope.pageNumber;
                    $scope.queryConditions.startTime = $scope.startTime;
                    $scope.queryConditions.endTime = $scope.endTime;
                    $scope.queryPromise = apiEventLog.get($scope.queryConditions, function(data) {
                        $scope.eventLogs = data.content;
                        $scope.page = $scope.queryConditions.pageNumber;
                    });
                    break;
                case 'keyword':
                    //resetPage();
                    resetSearchConditions();
                    $scope.queryKeyword = {
                        'keywordType': searchParameter.keywordType ? searchParameter.keywordType : $scope.queryKeyword.keywordType, // String 关键词的维度
                        'keyword': searchParameter.keyword ? searchParameter.keyword : $scope.queryKeyword.keyword, // String 关键词
                        'encryptKeyword': '', // String 关键词密文
                        'startTime': new Date((new Date()).setMonth(new Date().getMonth() - 3)), // Date 时间范围：开始时间
                        'endTime': $scope.endTime, // Date 时间范围：结束时间
                        'pageSize': $scope.pageSize, // Number 页码
                        'pageNumber': $scope.pageNumber // Number 每页条目数
                    };

                    /*$scope.queryPromise = EventLog.queryByKeyword($scope.queryKeyword).then(
                        function (response) {
                            $scope.eventCounts = {
                                'riskEventLogCounts': response.data.riskEventLogCounts,
                                'releaseRiskEventLogCounts': response.data.releaseRiskEventLogCounts,
                                'releaseProportion': response.data.releaseProportion,
                                'preventRiskEventLogCounts': response.data.preventRiskEventLogCounts,
                                'preventProportion': response.data.preventProportion,
                                'missRiskEventLogCounts': response.data.missRiskEventLogCounts,
                                'missProportion': response.data.missProportion
                            };
                            var responseData = response.data.searchedEventLogDTO;
                            $scope.eventLogs = [];
                            for (var i = $scope.keywordTypes.length - 1; i >= 0; i--) {
                                if ($scope.keywordTypes[i].code == searchParameter.keywordType) {
                                    $scope.chosenKeywordType = $scope.keywordTypes[i].name;
                                }
                            }

                            $scope.pages = $scope.eventCounts.riskEventLogCounts ? Math.ceil($scope.eventCounts.riskEventLogCounts / $scope.per_page) : 0;

                            for (var i = 0; i < responseData.length; i++) {
                                translate(responseData[i]);
                                $scope.eventLogs.push(responseData[i]);
                            }
                            if (response.headers('link')) {
                                $scope.links = ParseLinks.parse(response.headers('link'));
                                if (!$scope.links.last) {
                                    $scope.pageSize = 0;
                                }
                            }
                        },
                    function (response) {
                        console.log(response);
                    });*/
                    break;
                case 'encryption':
                    //resetPage();
                    resetSearchConditions();
                    $scope.queryEncrypedKeyword = {
                        'keywordType': searchParameter.keywordType, // String 关键词的维度；
                        'encryptKeyword': searchParameter.encryptKeyword, // String 关键词
                        'startTime': new Date((new Date()).setMonth(new Date().getMonth() - 3)), // Date 时间范围：开始时间
                        //'startTime': new Date(),    // Date 时间范围：默认事件时间为今天？
                        'endTime': $scope.endTime, // Date 时间范围：结束时间
                        'pageSize': $scope.pageSize, // Number 页码
                        'pageNumber': $scope.pageNumber // Number 每页条目数
                    };

                    /*$scope.queryPromise = EventLog.queryByEncryptedKeyword($scope.queryEncrypedKeyword).then(
                        function(response) {
                            $scope.eventCounts = {
                                'riskEventLogCounts': response.data.riskEventLogCounts,
                                'releaseRiskEventLogCounts': response.data.releaseRiskEventLogCounts,
                                'releaseProportion': response.data.releaseProportion,
                                'preventRiskEventLogCounts': response.data.preventRiskEventLogCounts,
                                'preventProportion': response.data.preventProportion,
                                'missRiskEventLogCounts': response.data.missRiskEventLogCounts,
                                'missProportion': response.data.missProportion
                            };
                            var responseData = response.data.searchedEventLogDTO;
                            $scope.eventLogs = [];

                            //$scope.chosenKeywordType = searchParameter.keywordType;
                            for (var i = $scope.keywordTypes.length - 1; i >= 0; i--) {
                                if($scope.keywordTypes[i].code == searchParameter.keywordType){
                                    $scope.chosenKeywordType = $scope.keywordTypes[i].name;
                                }
                            };

                            $scope.pages = $scope.eventCounts.riskEventLogCounts ? Math.ceil($scope.eventCounts.riskEventLogCounts/$scope.pageNumber) : 0;

                            for(var i=0; i<responseData.length; i++) {
                                translate(responseData[i]);
                                $scope.eventLogs.push(responseData[i]);
                            }

                            if(response.headers('link')) {
                                $scope.links = ParseLinks.parse(response.headers('link'));
                                if(!$scope.links.last){
                                    $scope.pageSize = 0;
                                }
                            }

                            $scope.queryKeyword.keywordType = searchParameter.keywordType;
                            //$scope.queryKeyword.keyword = $scope.eventLogs[0][searchParameter.keywordType];
                            $scope.queryKeyword.keyword = searchParameter.keyword;
                        },
                        function(response) {
                            console.error(response);
                        });*/
                    break;
                default:
            }
        };
        // $scope.loadPage($scope.pageSize);


        $scope.eventDetail = function(ent) {
            $state.go('eventLogDetail', { eventlogid: ent.mongoId, esEventLogId: ent.esId });
        };

        $scope.onClickSelector = function($event) {
            var ele = document.getElementsByClassName('condition-hover');
            [].forEach.call(ele, function(v) {
                angular.element(v).addClass('condition').removeClass('condition-hover');
            });

            $event.stopPropagation();
            var parentEle = angular.element($event.currentTarget.parentElement);

            if (parentEle.hasClass('condition')) {
                parentEle.addClass('condition-hover').removeClass('condition');
            } else if (parentEle.hasClass('condition-hover')) {
                parentEle.addClass('condition').removeClass('condition-hover');
            }
            var bodyEle = document.getElementsByTagName('body');
            angular.element(bodyEle).bind("click", function(event) {
                var ele = document.getElementsByClassName('condition-hover');
                [].forEach.call(ele, function(v) {
                    angular.element(v).addClass('condition').removeClass('condition-hover');
                });
            });
        };

        if ($scope.urlParam.value && $scope.urlParam.code && $scope.urlParam.name) {
            $scope.chosenKeywordType = $scope.urlParam.name;
            $scope.queryConditions.parameter = $scope.urlParam.code;
            $scope.queryConditions.content = $scope.urlParam.value;
            $scope.queryKeyword.keyword = $scope.urlParam.value;
        }

    })
    .factory('EventLogInstance', function() {
        return {
            changeListMark: angular.noop,
            changeDetailMark: angular.noop
        };
    })
