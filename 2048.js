/**
 * [description]2048
 * by:glb
 */
(function ($) {	

	var backgroundFill = []
		,level=0
		,newIndex=-1
		,timeSet=null
		,shapeSize="50"
		;
		
	$(function(){
		init();
		bind();
		creatrGround();		
		
	});
	function init(){
		$("#inLevel").val("4");
		$("#btnLevel").text("开始");
		$("#btnLevel").after('<button id="btnAuto" ></button>');
		$("#btnAuto").text("自动");
		$("#btnAuto").after('<button id="btnSort" ></button>');
		$("#btnSort").text("排序");
		$("#btnSort").after('<button id="btnKeyboard" ></button>');
		$("#btnKeyboard").text("键盘");
		$("#mainContent").after('<div id="keyboard"><div class="keyboard" id="Keyboard_up" >上</div><div class="keyboard" id="Keyboard_left" >左</div><div class="keyboard" id="Keyboard_down" >下</div><div class="keyboard" id="Keyboard_right" >右</div></div>');
	}
	function bind(){
		$("#inLevel").bind("blur",function(){
			if(!$.isNumeric(this.value)){
				this.value=4;
			}else if(this.value-0<1){
				this.value=1;
			}else if(this.value-0>20){
				this.value=20;
			}else{
				this.value=this.value-0;
			}
		});
		$("#btnLevel").bind("click",function(){
			creatrGround();		
		});
		$("#btnAuto").bind("click",function(){
			if($("#btnAuto").text()=="自动"){
				$("#btnAuto").text("停止");
				autoMove();		
			}else{
				$("#btnAuto").text("自动");
				clearTimeout(timeSet);	
			}
		});
		$("#btnSort").bind("click",function(){
			sort();
		});
		$("#btnKeyboard").bind("click",function(){
			if($("#keyboard").css("display")=="none"){
				$("#keyboard").css("display","block");
			}else{
				$("#keyboard").css("display","none");
			}
		});
		$("#Keyboard_up").bind("click",function(){
			direction(38)
		});
		$("#Keyboard_down").bind("click",function(){
			direction(40)
		});
		$("#Keyboard_left").bind("click",function(){
			direction(37)
		});
		$("#Keyboard_right").bind("click",function(){
			direction(39)
		});
		$(document).keydown(function(event){
			direction(event.keyCode);
		});
		
		new LSwiperMaker({
            bind:document.getElementById("mainContent"),  // 绑定的DOM对象
            dire_h:false,     	//true 判断左右， false 判断上下
			minMove:50,			//最小滑动
            backfn:function(o){    //回调事件
                 direction(o.dire) ;  
            }
		})
	}
	function direction(d){
		switch (d){
			case 38:
			case "up":
				if(up(true)){
					up();
				}else{
					isOver();
				}
				break;
			case 40:
			case "down":
				if(down(true)){
					down();
				}else{
					isOver();
				}
				break;
			case 37:
			case "left":
				if(left(true)){
					left();
				}else{
					isOver();
				}
				break;
			case 39:
			case "right":
				if(right(true)){
					right();
				}else{
					isOver();
				}
				break;
			}
	}
	function creatrGround(){
		$("#btnAuto").text("自动");
		clearTimeout(timeSet);	
		$(".new").removeClass("new");	
		
		level=$("#inLevel").val()-0;
		var _width=$("body").width();
		shapeSize = Math.floor(90/level)*_width/100;		
		
		$('#mainContent').css("height",shapeSize*level+30+"px").empty();
		for(var i1=0;i1<level;i1++){
			for(var i2=0;i2<level;i2++){
				var GoundStyle=[
					'font-size:'+Math.floor(shapeSize/2)+'px',
					'width:'+shapeSize+'px',
					'height:'+shapeSize+'px',
					'line-height:'+shapeSize+'px',
					'top:'+i1*shapeSize+'px',
					'left:'+i2*shapeSize+'px'
				];
				var str='<div class="Gound-Part" style="'+GoundStyle.join(";")+'"></div>';
				$(str).appendTo('#mainContent').text("");
			}
		}
		
		backgroundFill=[];
		var _tmp=[];
		var i=0;
		for(i=0;i<level;i++){
			_tmp.push(0);
		}
		for(i=0;i<level;i++){
			backgroundFill.push($.extend([],_tmp));
		}
		addOne(parseInt(level));
	}
	function isOver(){
		if(!up(true)&&!down(true)&&!left(true)&&!right(true)){
			$("#btnAuto").text("自动");
			clearTimeout(timeSet);	
			var scroe=0;
			$.each(backgroundFill.join().split(","),function(i,n){
				scroe+=+n;
			});
			alert("over!scroe:"+scroe);
			//creatrGround();
		}		
	}
	function changeScroe(){
		var scroe=0;
		$.each(backgroundFill.join().split(","),function(i,n){
			scroe+=+n;
		});
		$("#scroe").text(scroe);	
	}
	
	function addOne(num){
		num=num||1;
		for(var ii=0;ii<num;ii++){
			var _tmp=[];
			$.each(backgroundFill.join().split(","),function(i,n){
				(n==0) && _tmp.push(i);
			});
			if(_tmp.length>0){
				var _index = _tmp[parseInt(Math.random()*_tmp.length)];
				backgroundFill[parseInt(_index/level)][_index%level]=Math.random()>0.8?4:2;
				(num==1) && (newIndex=_index);
			}
		}
		fillBackground();
		isOver();
	}
	function fillBackground(){
		var _tmp = $(".Gound-Part");
		$.each(backgroundFill.join().split(","),function(i,n){
			if(n!=0){
				$(_tmp[i]).text(n);
				$(_tmp[i]).attr("num",n);
			}else{
				$(_tmp[i]).text("");
				$(_tmp[i]).attr("num",n);
			}
		});
		if(newIndex>-1){
			$(".new").removeClass("new");	
			$(_tmp[newIndex]).addClass("new");
		}
		changeScroe();
	}
	function autoMove(){
		timeSet = setTimeout(function(){autoMove()},100);
		if(timeSet%2==1){
			if(down(true)){
				down();
			}else if(left(true)){
				left();
			}else if(right(true)){
				right();
			}else if(up(true)){
				up();
			}		
		}else{
			if(left(true)){
				left();
			}else if(down(true)){
				down();
			}else if(right(true)){
				right();
			}else if(up(true)){
				up();
			}		
		}
		
	}
	function sort(){
		var _sort = backgroundFill.join().split(",").sort(function(a,b){return b-a;});
		var i=0;
		for(var i1=level-1;i1>=0;i1--){		
			for(var i2=0;i2<level;i2++){
				backgroundFill[i1][(level-i1)%2==1?i2:level-i2-1]=_sort[i++];
			}
		}
		fillBackground();
	}


	function up(test){
		var can=false;
		$.each(backgroundFill,function(i,n){
			if(i!=0){
				$.each(n,function(i1,n1){
					if(n1!=0){
						if(backgroundFill[i-1][i1] == n1){
							if(test){
								can =true;
								return false;
							}
							backgroundFill[i-1][i1] = n1<<1;
							backgroundFill[i][i1]=0;
						}else if(backgroundFill[i-1][i1]==0){
							if(test){
								can =true;
								return false;
							}
							backgroundFill[i-1][i1]=n1;
							backgroundFill[i][i1]=0;
						}
					}
				});
			}
			if(test&&can==true){
				return false;
			}
		});
		if(test){return can;}
		up(true) && up();
		addOne();
	}
	function down(test){
		var i,i1;
		for(i=level-2;i>=0;i--){
			for(i1=0;i1<level;i1++){
				if(backgroundFill[i][i1]!=0){
					if(backgroundFill[i+1][i1] == backgroundFill[i][i1]){
						if(test){return true;}
						backgroundFill[i+1][i1] = backgroundFill[i][i1]<<1;
						backgroundFill[i][i1]=0;
					}else if(backgroundFill[i+1][i1]==0){
						if(test){return true;}
						backgroundFill[i+1][i1]=backgroundFill[i][i1];
						backgroundFill[i][i1]=0;
					}
				}
			}
		}
		if(!test){
			down(true) && down();
			addOne();
		}
	}
	function left(test){
		var i,i1;
		for(i=0;i<level;i++){
			for(i1=1;i1<level;i1++){
				if(backgroundFill[i][i1]!=0){
					if(backgroundFill[i][i1-1] == backgroundFill[i][i1]){
						if(test){return true;}
						backgroundFill[i][i1-1] = backgroundFill[i][i1]<<1;
						backgroundFill[i][i1]=0;
					}else if(backgroundFill[i][i1-1]==0){
						if(test){return true;}
						backgroundFill[i][i1-1]=backgroundFill[i][i1];
						backgroundFill[i][i1]=0;
					}
				}
			}
		}
		if(!test){
			left(true) && left();
			addOne();
		}
	}
	function right(test){
		var i,i1;
		for(i=0;i<level;i++){
			for(i1=level-2;i1>=0;i1--){
				if(backgroundFill[i][i1]!=0){
					if(backgroundFill[i][i1+1] == backgroundFill[i][i1]){
						if(test){return true;}
						backgroundFill[i][i1+1] = backgroundFill[i][i1]<<1;
						backgroundFill[i][i1]=0;
					}else if(backgroundFill[i][i1+1]==0){
						if(test){return true;}
						backgroundFill[i][i1+1]=backgroundFill[i][i1];
						backgroundFill[i][i1]=0;
					}
				}
			}
		}
		if(!test){
			right(true) && right();
			addOne();
		}
	}
	
	var LSwiperMaker = function(o){ 
		var that = this;
		this.config = o;
		this.control = false;
		this.sPos = {};
		this.mPos = {};
		this.dire;
		// this.config.bind.addEventListener('touchstart', function(){ return that.start(); } ,false);
		// 这样不对的，event对象只在事件发生的过程中才有效;
		this.config.bind.addEventListener('touchstart', function(e){ return that.start(e); } ,false);
		this.config.bind.addEventListener('touchmove', function(e){ return that.move(e); } ,false);
		this.config.bind.addEventListener('touchend', function(e){ return that.end(e); } ,false);
	} 
	LSwiperMaker.prototype.start = function(e){             
		 var point = e.touches ? e.touches[0] : e;
		 this.sPos.x = point.screenX;
		 this.sPos.y = point.screenY; 
	}
	LSwiperMaker.prototype.move = function(e){   
		var point = e.touches ? e.touches[0] : e;
		this.control = true;
		this.mPos.x = point.screenX;
		this.mPos.y = point.screenY; 
	}
	LSwiperMaker.prototype.end = function(e){
		if(this.control){
			var xDif=this.mPos.x-this.sPos.x;
			var yDif=this.mPos.y-this.sPos.y;
			this.dire="";
			if(Math.abs(xDif)>this.config.minMove || Math.abs(yDif)>this.config.minMove){
				if(xDif<0 && -xDif>Math.abs(yDif)){
					this.dire="left";
				}else if(yDif<0&&-yDif>Math.abs(xDif)){
					this.dire="up";
				}else if(xDif>0&&xDif>Math.abs(yDif)){
					this.dire="right";
				}else if(yDif>0&&yDif>Math.abs(xDif)){
					this.dire="down";
				}
			}
			this.control = false;
			this.config.backfn(this);
		}
	}
 
	window.LSwiperMaker = LSwiperMaker;
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);// 禁止微信touchmove冲突
 

})(jQuery);

