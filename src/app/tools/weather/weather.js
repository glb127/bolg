(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('WeatherController', WeatherController);


    WeatherController.$inject = [ '$timeout', 'apiOpen'];

    function WeatherController ($timeout,apiOpen) {
    	console.log(load_echarts)
    	var vm = this;
    	var locPath = "./no-min/map/";
    	var tempSave = {};
    	var waitTime=5;	//重新查询间隔几分钟
        var provinces = ['shanghai', 'hebei','shanxi','neimenggu','liaoning','jilin','heilongjiang','jiangsu','zhejiang','anhui','fujian','jiangxi','shandong','henan','hubei','hunan','guangdong','guangxi','hainan','sichuan','guizhou','yunnan','xizang','shanxi1','gansu','qinghai','ningxia','xinjiang', 'beijing', 'tianjin', 'chongqing', 'xianggang', 'aomen'];
		var provincesText = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林','黑龙江',  '江苏', '浙江', '安徽', '福建', '江西', '山东','河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门'];
		var myChart = echarts.init(document.getElementById('wb_my_map'));
		var currentIdx=-1;

		vm.info = "";

		var getTem = function(data){
			if(data.error){
				return "未知";
			}
			var str = data.results[0].weather_data[0].date;
			return str.substring(str.indexOf("：")+1,str.indexOf(")")-1);
		}
		var getInfo = function(data){
			if(data.error){
				return "";
			}
			var str = data.results[0].currentCity+"：";
			for(var i=0;i<data.results[0].weather_data.length;i++){
				str+=data.results[0].weather_data[i].date+" ";
				if(i==0){str+="</br>&nbsp;&nbsp;&nbsp;&nbsp;";}
				str+=data.results[0].weather_data[i].weather+" "
					+data.results[0].weather_data[i].temperature+"</br>";
			}

			return str;
		}
		var getWeather = function(city){
			if(tempSave[city]&&tempSave[city].data){
				vm.info = getInfo(tempSave[city].data);
			}else{
				vm.info = "";
			}
		}

		function showChina() {	
			$.get(locPath+'china.json', function (chinaJson) {
			    echarts.registerMap('china', chinaJson);			    
			    myChart.setOption({
				    title: {
		                text: "中国",
		                left: 'center',
		                textStyle: {
		                    color: '#222'
		                }
		            },
		            tooltip: {
				        trigger: 'item',
				        formatter: '{b}'
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
		                                color: '#555'
		                            }
		                        }
		                    },
		                    itemStyle: {
		                        normal: {
		                            borderColor: '#389BB7',
		                            areaColor: '#eee',
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
		    $.get(locPath + name + '.json', function (geoJson) {
				var _eachtmp=[];
				var AllCount=0;
				for(var i=0;i<geoJson.features.length;i++){
					var _cityName = geoJson.features[i].properties.name;
					(function(_cityName){
						if(tempSave[_cityName]&&tempSave[_cityName].time>+new Date-waitTime*60000){
							if(tempSave[_cityName].data){
								_eachtmp.push({
									name:_cityName,
									value:getTem(tempSave[_cityName].data)
								});
								AllCount++;
								if(AllCount==geoJson.features.length){
									loadProvinces();
								}
							}else{
								AllCount++;
								if(AllCount==geoJson.features.length){
									loadProvinces();
								}					
							}
						}else{
							apiOpen.baiduWeather({location:_cityName},function(data){
								_eachtmp.push({
									name:_cityName,
									value:getTem(data)
								});
								tempSave[_cityName]={
									data:data,
									time:+new Date
								}
								AllCount++;
								if(AllCount==geoJson.features.length){
									loadProvinces();
								}
							},function(){
								AllCount++;
								if(AllCount==geoJson.features.length){
									loadProvinces();
								}
							});
						}
					})(_cityName)
				}
				function loadProvinces(){
					myChart.hideLoading();
			        echarts.registerMap(name, geoJson);
			        myChart.setOption({
			            title: {
			                text: provincesText[currentIdx],
	        				subtext: '双击返回',
			                left: 'center',
			                textStyle: {
			                    color: '#222'
			                }
			            },
			            tooltip: {
					        trigger: 'item',
					        formatter: '{b}：{c}℃'
					    },
			            series: [
			                {
			                    type: 'map',
			                    mapType: name,
			                    selectedMode : 'single',
			                    label: {
			                        emphasis: {
			                            textStyle: {
			                                color: '#555'
			                            }
			                        }
			                    },
			                    itemStyle: {
			                        normal: {
			                            borderColor: '#389BB7',
			                            areaColor: '#eee',
			                        },
			                        emphasis: {
			                            areaColor: '#389BB7',
			                            borderWidth: 0
			                        }
			                    },
			                    data:_eachtmp
			                }
			            ]
			        });
			    }
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
		    return true;
	    });
	    window.onresize = myChart.resize;
	    var clickCount=0;
	    vm.mapClick = function () {
	        clickCount++;
	        $timeout(function () {
	            clickCount = 0;
	        }, 300);
	        if (clickCount > 1) {
	        	if(currentIdx!=-1){
		        	currentIdx=-1;
		    		showChina();
		    	}
	            clickCount = 0;
	        }
	    }
				
    }
})();

		
			
