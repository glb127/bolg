(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope'];

    function HomeController ($scope ) {
        var vm = this;
        vm.isPhone = navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad|SymbianOS)/i);
        vm.initPic=function(){
			new BreathingHalftone(document.getElementById('homepic'),{
				// dot size
				dotSize: 1/80, //点的个数，默认1/40，底数越大画面越精细也越卡
				dotSizeThreshold: 0.5, //点的疏密程度，默认0.05，越大越疏，1就看不到了
				initVelocity: 0.1, //点初始化速度，默认0.02，越大速度越快
				oscPeriod: 3, //点震动频率，默认3，越大频率越小
				oscAmplitude: 0.2, //点震动幅度，默认0.2，越大幅度越大
			})
		}
		if(!vm.isPhone){
			vm.initPic()
		}
    }
})();
