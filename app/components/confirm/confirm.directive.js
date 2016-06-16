angular.module('cloudxWebApp').directive('ngReallyClick', [ '$uibModal', function($uibModal) {

    var ModalInstanceCtrl = function($scope, $uibModalInstance) {
        $scope.ok = function() {
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };

    return {
        restrict : 'A',
        scope : {
            ngReallyClick : "&",
            item : "="
        },
        link : function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage || "Are you sure ?";

                /*
                 * //This works if (message && confirm(message)) {
                 * scope.$apply(attrs.ngReallyClick); } //
                 */

                var modalHtml = '<div class="modal-body">';
                modalHtml += '<h3>' + message + '</h3></div>';
                modalHtml += '<div class="modal-footer">';
                modalHtml += '<button class="btn btn-primary" ng-click="ok()">';
                modalHtml += '  <span class="glyphicon glyphicon-ok">确认</span></button>';
                modalHtml += '<button class="btn btn-warning" ng-click="cancel()">';
                modalHtml += '  <span class="glyphicon glyphicon-remove">取消</span></button></div>';
                
                
                    var modalInstance = $uibModal.open({
                        template : modalHtml,
                        controller : ModalInstanceCtrl
                    });

                    modalInstance.result.then(function() {
                        scope.ngReallyClick({
                            item : scope.item
                        }); // raise an error : $digest already in progress
                    }, function() {
                        // Modal dismissed
                    });
                
               
                // */

            });

        }
    };
    } 
 ]);
