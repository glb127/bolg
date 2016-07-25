(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('WeatherController', WeatherController);


    WeatherController.$inject = [ '$timeout'];

    function WeatherController ($timeout) {
        var provinces = ['shanghai', 'hebei','shanxi','neimenggu','liaoning','jilin','heilongjiang','jiangsu','zhejiang','anhui','fujian','jiangxi','shandong','henan','hubei','hunan','guangdong','guangxi','hainan','sichuan','guizhou','yunnan','xizang','shanxi1','gansu','qinghai','ningxia','xinjiang', 'beijing', 'tianjin', 'chongqing', 'xianggang', 'aomen'];
		var provincesText = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林','黑龙江',  '江苏', '浙江', '安徽', '福建', '江西', '山东','河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门'];
		var myChart = echarts.init(document.getElementById('map'));
		var currentIdx=-1;

		var getTem = function(data){
			if(data.error){
				return "未知";
			}
			var str = data.results[0].weather_data[0].date;
			return str.substring(str.indexOf("：")+1,str.indexOf(")"));
		}
		var getWeather = function(city){
			var url = "http://api.map.baidu.com/telematics/v3/weather?location="+city+"&output=json&ak=VNzVAdKLqIs3RQ1br2UB10Wf&callback=?";
			$.getJSON(url,function(data){
				$("#info").html(city+"："+getTem(data))
			});
		}
		function showChina() {	
			$.get('./json/map/china.json', function (chinaJson) {
			    echarts.registerMap('china', chinaJson);			    
			    myChart.setOption({
			    	backgroundColor: '#404a59',
				    title: {
		                text: "中国",
		                left: 'center',
		                textStyle: {
		                    color: '#fff'
		                }
		            },
				    series: [
				        {
				            name: '中国',
				            type: 'map',
				            mapType: 'china',
				            selectedMode : 'single',
		                    label: {
		                        emphasis: {
		                            textStyle: {
		                                color: '#fff'
		                            }
		                        }
		                    },
		                    itemStyle: {
		                        normal: {
		                            borderColor: '#389BB7',
		                            areaColor: '#fff',
		                        },
		                        emphasis: {
		                            areaColor: '#389BB7',
		                            borderWidth: 0
		                        }
		                    }
				        }
				    ]
			    });
			});
		}
		showChina();

		function showProvince() {
		    var name = provinces[currentIdx];
			myChart.showLoading();
		    $.get('./json/map/' + name + '.json', function (geoJson) {
				myChart.hideLoading();
		        echarts.registerMap(name, geoJson);
		        myChart.setOption({
		            backgroundColor: '#404a59',
		            title: {
		                text: provincesText[currentIdx],
		                left: 'center',
		                textStyle: {
		                    color: '#fff'
		                }
		            },
		            series: [
		                {
		                    type: 'map',
		                    mapType: name,
		                    selectedMode : 'single',
		                    label: {
		                        emphasis: {
		                            textStyle: {
		                                color: '#fff'
		                            }
		                        }
		                    },
		                    itemStyle: {
		                        normal: {
		                            borderColor: '#389BB7',
		                            areaColor: '#fff',
		                        },
		                        emphasis: {
		                            areaColor: '#389BB7',
		                            borderWidth: 0
		                        }
		                    }
		                }
		            ]
		        });
		    });
		}

	    myChart.on("mapselectchanged",function(data){
	    	if(currentIdx==-1){
		    	currentIdx = provincesText.indexOf(data.name);
		    	if(currentIdx==-1){
		    		getWeather(data.name);
		    	}else{
		    		 showProvince()
		    	}
		    }else{
		    	getWeather(data.name);
		    }
	    })
	    var clickCount=0
	    $("#map").on('click', function () {
	        clickCount++;
	        setTimeout(function () {
	            clickCount = 0;
	        }, 500);
	        if (clickCount > 1) {
	        	if(currentIdx!=-1){
		        	currentIdx=-1;
		    		showChina();
		    	}
	            clickCount = 0;
	        }
	    });
				
    }
})();

		
			
