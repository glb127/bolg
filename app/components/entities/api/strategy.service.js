'use strict';

angular.module('cloudxWebApp')
    // 先把 '_api/ 和 /GET , {} 改为: ,全部替换为空 再一个个改 
    //7
    .factory('apiSolution', function ($resource,ErrorTipModal) {
        return $resource('api/solution', {}, {
            'post': {
                method : 'POST',
                url : 'api/solution',
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getName': {
                method : 'GET',
                url : 'api/solution/name',
                params:{scenarioId:'@scenarioId', name:'@name'}
            },
            'putId': {
                method : 'PUT',
                url : 'api/solutions/:solutionId',
                params:{solutionId:'@solutionId'},
                transformResponse: function (data) {
                    return data;
                },
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getId': {
                method : 'GET',
                url : 'api/solutions/:solutionId',
                params:{solutionId:'@solutionId', strategyId:'@strategyId'}
            },
            'getRiskTypes': {
                method : 'GET',
                isArray : true,
                url : 'api/risk-types',
                params:{industryId:'@industryId'}
            },
            'getTemplates': {
                method : 'GET',
                isArray : true,
                url : 'api/solution-templates'
            },
            'getScenarioTypes': {
                method : 'GET',
                isArray : true,
                url : 'api/scenario-types',
                params:{type:'@type', industryId:'@industryId', strategyId:'@strategyId'}
                //获取场景列表 修改攻略新增场景，显示除已添加的场景外所有的场景，攻略配置中行业相关的场景排前，条件如下 type=0,industryId,strategyId 显示该攻略下已添加的场景，条件如下 type=1,strategyId 不使用模板创建攻略，显示所有场景，攻略配置中行业相关的场景排前，条件如下 type=2,industryId isSelected为1表示默认选中
            }

        });
    })
    //16
    .factory('apiStrategy', function($resource,ErrorTipModal){
        return $resource('api/strategy', {}, {
            'post': {
                method : 'POST',
                url : 'api/strategy',
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getName': {
                method : 'GET',
                url : 'api/strategy/name',
                params:{name:'@name'}
            },
            'postCode': {
                method : 'POST',
                url : 'api/strategy/code',
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getCode': {
                method : 'GET',
                url : 'api/strategy/code',
                params:{code:'@code'}
            },
            'postTemplate': {
                method : 'POST',
                url : 'api/strategy/template',
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'postCopy': {
                method : 'POST',
                url : 'api/strategies/:strategyId/copy',
                params:{strategyId:'@strategyId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },

            'get': {
                method : 'GET',
                isArray : true,
                url : 'api/strategies'
            },
            'getId': {
                method : 'GET',
                url : 'api/strategies/:strategyId',
                params:{strategyId:'@strategyId'}
            },
            'putId': {
                method : 'PUT',
                url : 'api/strategies/:strategyId',
                params:{strategyId:'@strategyId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getRules': {
                method : 'GET',
                isArray : true,
                url : 'api/strategies/:strategyId/rules',
                params:{strategyId:'@strategyId',type:'@type', key:'@key'}
                //获取攻略的所有规则列表 type=0，带名称作为条件 type=1，带字段名或显示名作为条件type=2，
            },
            'putRules': {
                method : 'PUT',
                url : 'api/strategies/:strategyId/rules',
                params:{strategyId:'@strategyId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getParameters': {
                method : 'GET',
                isArray : true,
                url : 'api/strategies/:strategyId/parameters',
                params:{strategyId:'@strategyId'}
            },
            'getScenariosSolutions': {
                method : 'GET',
                isArray : true,
                url : 'api/strategies/:strategyId/scenarios-solutions',
                params:{strategyId:'@strategyId'}
            },

            'getIndustries': {
                method : 'GET',
                isArray : true,
                url : 'api/industries',
                params:{strategyId:'@strategyId'}
            },
            'getUserTemplates': {
                method : 'GET',
                isArray : true,
                url : 'api/user-strategy-templates'
            },
            'getUserTemplatesbId': {
                method : 'GET',
                isArray : true,
                url : 'api/user-strategy-templates/:strategyId',
                params:{strategyId:'@strategyId',industryId:'@industryId'}
            }

        });
    })
    //9
    .factory('apiRule', function($resource,ErrorTipModal){
        return $resource('api/rule', {}, {
            'getId': {
                method : 'GET',
                url : 'api/rules/:ruleId',
                params:{ruleId:'@ruleId'}
            },
            'putId': {
                method : 'PUT',
                url : 'api/rules/:ruleId',
                params:{ruleId:'@ruleId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'deleteId': {
                method : 'DELETE',
                url : 'api/rules/:ruleId',
                params:{ruleId:'@ruleId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getName': {
                method : 'GET',
                url : 'api/rule/name',
                params:{name:'@name', solutionId:'@solutionId'}
            },
            'postLibrary': {
                method : 'POST',
                url : 'api/rule/library',
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'postCustom': {
                method : 'POST',
                url : 'api/rule/custom',
                transformResponse: function (data) {
                    return data;
                },
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'postCopy': {
                method : 'POST',
                url : 'api/rule/copy',
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getCalculationPredicators': {
                method : 'GET',
                url : 'api/rules/:ruleId/calculation-predicators',
                params:{ruleId:'@ruleId'}
            },
            'getLibrary': {
                method : 'GET',
                isArray : true,
                url : 'api/library-rules',
                params:{type:'@type', key:'@key', tags:'@tags'}
                //获取规则库中的规则列表 tags=""时，不带分类作为条件 type=0，所有的规则列表，带分类 type=1，带名称作为条件，带分类 type=2，带字段名或显示名作为条件，带分类
            },
            'getLibraryTags': {
                method : 'GET',
                isArray : true,
                url : 'api/library-rule-tags'
            },
            'getOperatorTypes': {
                method : 'GET',
                isArray : true,
                url : 'api/operatorTypes',
                params:{valueTypeId:'@valueTypeId',parameterId:'@parameterId',predicatorId:'@predicatorId'}
            },
            'putStatus': {
                method : 'PUT',
                url : 'api/rule-status',
                params:{ruleId:'@ruleId',status:'@status'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'putAllStatus': {
                method : 'PUT',
                url : 'api/rules-status',
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getValueTypes': {
                method : 'GET',
                isArray : true,
                url : 'api/valueTypes',
                params:{operatorTypeId:'@operatorTypeId'}
            },
            'getValues': {
                method : 'GET',
                isArray : true,
                url : 'api/values',
                params:{operatorTypeId:'@operatorTypeId',type:"@type",strategyId:'@strategyId'}
                // type:1 不要指标  type:2 要指标
            },
            'postRuleNew': {
                method : 'PUT',
                url : 'api/rule/:ruleId/isNew',
                params:{ruleId:'@ruleId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },

        });
    })
    //9
    .factory('apiParameter', function($resource,ErrorTipModal){
        return $resource('api/parameter', {}, {
            'post': {
                method : 'POST',
                url : 'api/parameter',
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'putCode': {
                method : 'GET',
                url : 'api/parameter/code',
                params:{code:'@code'}
            },
            'get': {
                method : 'GET',
                isArray : true,
                url : 'api/parameters'
            },
            'getWithStatus': {
                method : 'GET',
                isArray : true,
                url : 'api/parameters/with-status'
            },
            'getId': {
                method : 'GET',
                url : 'api/parameter/:parameterId',
                params:{parameterId:'@parameterId'}
            },
            'putId': {
                method : 'PUT',
                url : 'api/parameter/:parameterId',
                params:{parameterId:'@parameterId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'deleteId': {
                method : 'DELETE',
                url : 'api/parameter/:parameterId',
                params:{parameterId:'@parameterId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getUsedStatus': {
                method : 'GET',
                url : 'api/parameter/:parameterId/used-status',
                params:{parameterId:'@parameterId'}
            },
            'getTags': {
                method : 'GET',
                isArray : true,
                url : 'api/parameter-tags'
            },
            'getValueTypes': {
                method : 'GET',
                isArray : true,
                url : 'api/value-types'
            },
            'changeStatus': {
                method : 'PUT',
                url : 'api/parameter/:parameterId/:status',
                params:{parameterId:'@parameterId',status:'@status'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getNameUsed': {
                //查看code，name是否重复,keytype ：0 -code ,1 - name；status 0-未使用 ,1 - 已使用
                method : 'GET',
                url : 'api/parameter/name/used',
                params:{keytype:'@keytype',keyword:'@keyword'}
            },
            'getDic': {method : 'GET',
                url : 'api/parameters/with-dic',
                params:{}
            }

        });
    })
    //9
    .factory('apiPredicator', function($resource,ErrorTipModal){
        return $resource('api/predicators', {}, {
            'get': {
                method : 'GET',
                isArray : true,
                url : 'api/predicators',
                params:{strategyId:'@strategyId',keywordType:'@keywordType', Keyword:'@Keyword'}
            },
            'getNew': {
                method : 'GET',
                isArray : true,
                url : 'api/new-predicators',
                params:{strategyId:'@strategyId',keywordType:'@keywordType', Keyword:'@Keyword'}
            },
            'getTemplate': {
                method : 'GET',
                isArray : true,
                url : 'api/template-predicators'
            },
            'getTemplateId': {
                method : 'GET',
                url : 'api/template-predicator/:predicatorId',
                params:{type:'@type',strategyId:'@strategyId',predicatorId:'@predicatorId'}
            },
            'post': {
                method : 'POST',
                url : 'api/predicator',
                transformResponse: function (data) {
                    return data;
                },
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getId': {
                method : 'GET',
                url : 'api/predicator/:predicatorId',
                params:{predicatorId:'@predicatorId'}
            },
            'putId': {
                method : 'PUT',
                url : 'api/predicator/:predicatorId',
                params:{strategyId:'@strategyId',predicatorId:'@predicatorId',status:"@status"},
                transformResponse: function (data) {
                    return data;
                },
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'deleteId': {
                method : 'DELETE',
                url : 'api/predicator/:predicatorId',
                params:{predicatorId:'@predicatorId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'putStatus': {
                method : 'PUT',
                url : 'api/predicator/:predicatorId/:status',
                params:{strategyId:'@strategyId',predicatorId:'@predicatorId',status:'@status'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'putUsedStatus': {
                method : 'GET',
                url : 'api/predicator/:predicatorId/used-status',
                params:{strategyId:'@strategyId',predicatorId:'@predicatorId'}
            },
            'getNameUsed': {
                method : 'GET',
                url : 'api/predicator/:name/used',
                params:{strategyId:'@strategyId',name:'@name'}
            },
            'getOperatoionParameters': {
                method : 'GET',
                isArray : true,
                url : 'api/predicator/operatoion/parameters',
                params:{strategyId:'@strategyId',type:"@type"}
                //type:Number-计算指标，Date-取值指标、时间差，GPS-距离差
            }



        });
    })
    //13
    .factory('apiNameList', function ($resource,ErrorTipModal) {
        return $resource('api/name-list', {}, {
            'post': {
                method : 'POST',
                url : 'api/name-list',
                params:{name:'@name'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'get': {
                method : 'GET',
                isArray : true,
                url : 'api/name-lists'
            },
            'getId': {
                method : 'GET',
                url : 'api/name-list/:nameListId',
                params:{nameListId:'@nameListId'}
            },
            'putId': {
                method : 'PUT',
                url : 'api/name-list/:nameListId',
                params:{nameListId:'@nameListId',name:'@name'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'deleteId': {
                method : 'DELETE',
                url : 'api/name-list/:nameListId',
                params:{nameListId:'@nameListId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getListCandelete': {
                method : 'GET',
                url : 'api/name-list/:nameListId/can-delete',
                params:{nameListId:'@nameListId'}
            },
            'postEventLog': {
                method : 'POST',
                url : 'api/name-list/:nameListId/event-log',
                params:{nameListId:'@nameListId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getDataValues': {
                method : 'GET',
                url : 'api/name-list/:nameListId/data-values',
                params:{nameListId:'@nameListId', value:'@value', page:'@page', per_page:'@per_page'}
            },
            'postDataValue': {
                method : 'POST',
                url : 'api/name-list/:nameListId/data-value',
                params:{nameListId:'@nameListId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getDataValueId': {
                method : 'GET',
                url : 'api/name-list/:nameListId/data-value/:dataValueId',
                params:{nameListId:'@nameListId',dataValueId:'@dataValueId'}
            },
            'deleteDataValueId': {
                method : 'DELETE',
                url : 'api/name-list/:nameListId/data-value/:dataValueId',
                params:{nameListId:'@nameListId',dataValueId:'@dataValueId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'putDataValueId': {
                method : 'PUT',
                url : 'api/name-list/:nameListId/data-value/:dataValueId',
                params:{nameListId:'@nameListId',dataValueId:'@dataValueId'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },            
            'putDataValueStatus': {
                method : 'PUT',
                url : 'api/name-list/:nameListId/data-value/:dataValueId/status',
                params:{nameListId:'@nameListId',dataValueId:'@dataValueId',status:'@status'},
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getNameUsed': {
                method : 'GET',
                url : 'api/name-list/name/used',
                params:{name:'@name'}
            }

        });
    })
    //10
    .factory('apiEventLog', function ($resource,ErrorTipModal) {
        return $resource('api/event-log', {}, {
            'get': {
                method : 'GET',
                url : 'api/event-logs'
            },
            'getCounts': {
                method: 'GET',
                url: 'api/event-logs-counts'
            },
            'getStrategies': {
                method : 'GET',
                isArray : true,
                url : 'api/event-log/strategies'
            },
            'getScenarios': {
                method : 'GET',
                isArray : true,
                url : 'api/event-log/:strategyId/scenarios',
                params:{strategyId:'@strategyId'}
            },
            'getSolutions': {
                method : 'GET',
                isArray : true,
                url: 'api/event-log/strategy/scenario/:scenarioId/solutions',
                params: {scenarioId:'@scenarioId'}
                //url : 'api/event-log/:strategyId/:scenarioId/solutions',
                //params:{strategyId:'@strategyId',scenarioId:'@scenairoId'}
            },
            'getDimensions': {
                method : 'GET',
                isArray : true,
                url : 'api/event-log/dimensions'
            },
            'getParameters': {
                method : 'GET',
                isArray : true,
                url : 'api/event-log/parameters'
            },
            'getRules': {
                method : 'GET',
                isArray : true,
                url : 'api/event-log/rules',
                params:{strategyCode:'@strategyCode',scenarioTypeCode:'@scenarioTypeCode',solutionId:'@solutionId'}
            },
            'getEventLogId': {
                method : 'GET',
                url : 'api/event-logs/:eventLogId',
                params:{eventLogId:'@eventLogId'}
            },
            'putEventLogMark': {
                method : 'PUT',
                url : 'api/event-logs/:eventLogId/mark',
                params:{eventLogId:'@eventLogId',esEventLogId:"@esEventLogId"},
                transformResponse: function (data) {
                    return data;
                },
                interceptor:{
                    responseError:function(){ ErrorTipModal.show("操作失败"); }
                }
            },
            'getNameList': {
                method : 'GET',
                isArray : true,
                url : 'api/event-logs/:eventLogId/name-list',
                params:{eventLogId:'@eventLogId'}
            }

        });
    })

