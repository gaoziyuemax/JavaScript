if(window.addEventListener){
	addEventListener('DOMContentLoaded',loader,false);
}else{
	function load(){
		if(typeof window==="object" && typeof document==="object"){
			clearInterval(timer);
			loader();
		}
	}
	var timer=setInterval(loader,1);
}
function loader(){//主程序
	console.log("DOM加载成功");
	init();
	var snake=new Snake('sele');
	snake.showFood();
	snake.show();
	snake.speed=500;
	snake.run();
	document.onkeydown=function(ev){
		ev=ev||window.event;
		var code=ev.keyCode;
		if(code==37){
			if(snake.direct!='right')snake.direct='left';
		}
		if(code==38){
			if(snake.direct!='down')snake.direct='up';
		}
		if(code==39){
			if(snake.direct!='left')snake.direct='right';
		}
		if(code==40){
			if(snake.direct!='up')snake.direct='down';
		}
	}	
}
function init(){//创建地图
	var map=document.getElementById('map');
	var str="";
	map.innerHTML="";
	for(var i=0;i<30;i++){
		for(var j=0;j<40;j++){
			str+="<div>"+j+":"+i+"</div>";
		}
		str+="<br />";
	}
	map.innerHTML+=str;
}
function Snake(setval){//蛇对象
	var This=this;
	var seleDom=document.getElementById(setval);
	this.select=seleDom.getElementsByTagName('select')[0];
	this.span=seleDom.getElementsByTagName('span')[1];
	this.input=seleDom.getElementsByTagName('input');
	this.reset=this.input[0].checked;
	this.score=0;
	this.speed=0;
	this.last=null;
	this.direct="right";
	this.timer=null;
	this.foodIndex=0;
	this.headIndex=0;
	this.body=[[10,10,'red'],[11,10,'#099e6a']];
	this.divs=document.getElementById('map').getElementsByTagName('div');
	this.select.options[1].selected=true;
	this.restart=function(){
		init();
		this.showFood();
		this.body=[[10,10,'red'],[11,10,'#099e6a']];
		this.last=this.body[0];
		this.headIndex=this.inde(this.body[0][0],this.body[0][1]);
		this.show();
	}
	this.input[1].onclick=function(){
		clearInterval(This.timer);
		if(This.last)This.body[0]=This.last;
		This.last=null;
		var seleIndex=This.select.selectedIndex;
		var sp=This.select.options[seleIndex].value;
		This.speed=parseInt(sp);
		This.run();
	}
	this.input[2].onclick=function(){
		clearInterval(This.timer);
	}
	for(var i in this.divs){
		this.divs[i].index=i;
	}
	this.inde=function(a,b){
		return a+b*40;
	}
	this.showFood=function(){//食物位置随机产生，为黄色
		var ind=this.inde(rand('x'),rand('y'));
		this.foodIndex=ind;
		this.divs[ind].style.backgroundColor='yellow';
	}
	function rand(ergu){
		return ergu==="x"?Math.floor(Math.random()*40):Math.floor(Math.random()*30);
	}
	this.show=function(){//蛇的身体
		var length=this.body.length;
		for(var i=0;i<length;i++){
			var val=this.inde(this.body[i][0],this.body[i][1]);
			if(this.divs[val])this.divs[val].style.backgroundColor=this.body[i][2];
		}
	}
	this.move=function(){//控制蛇的移动
		var length=this.body.length;
		var val=this.inde(this.body[length-1][0],this.body[length-1][1]);
		this.divs[this.foodIndex].style.backgroundColor='yellow';
		this.headIndex=this.inde(this.body[0][0],this.body[0][1]);
		if(val!=this.foodIndex&&val>=0&&val<this.divs.length){//将蛇尾设置为透明
            this.divs[val].style.backgroundColor='transparent';
        }
		this.wran=function(where){
			clearInterval(this.timer);
			this.last=this.body[0];
			this.last[2]="red";
			this.divs[val].style.backgroundColor='#099e6a';
			alert("撞"+where+"墙了,当前得分"+this.score);
			this.continue=this.input[0].checked;
			if(!this.continue)this.restart();
		}
		if(this.headIndex<40&&this.direct=='up'){
			this.wran('北');
		}
		if(this.headIndex>1159&&this.direct=='down'){
			this.wran('南');
		}
		if(this.headIndex%40==0&&this.direct=='left'){
			this.wran('西');
		}
		if((this.headIndex+1)%40==0&&this.direct=='right'){
			this.wran('东');
		}
		for(var i=1;i<this.body.length;i++){
			var a0=this.inde(this.body[i][0],this.body[i][1]);
			if(a0==this.headIndex){
				var snakeBody=[];
				clearInterval(this.timer);
				this.last=this.body[0];
				this.last[2]="red";
				this.divs[val].style.backgroundColor='#099e6a';
				for(var i in this.body){
					var a1=this.inde(this.body[i][0],this.body[i][1]);
					snakeBody.push(a1);
				}
				alert("咬到自己了,当前得分"+this.score);
				this.continue=this.input[0].checked;
                if(!this.continue){
                    this.restart();
                    return;
                }else{
				    if(setHead(this.headIndex+1)){
                        console.log(this.headIndex+1);
                    }else if(setHead(this.headIndex-1)){
                        console.log(this.headIndex-1);
                    }else if(setHead(this.headIndex+40)){
                        console.log(this.headIndex+40);
                    }else if(setHead(this.headIndex-40)){
                        console.log(this.headIndex-40);
                    }
                }
			}
		}
		function setHead(num){//改变蛇头
			var isSome=true;
			if(num>=0&&num<=1199){
				isSome=snakeBody.some(function(ele){
				return num==ele;
				});
				if(!isSome){
					This.last[0]=num%40;
					This.last[1]=Math.floor((num)/40);
					return true;
				}	
			}
		}
		if(!this.last){//是否不存在撞墙或者咬到自己
			for(var i=length-1;i>0;i--){//蛇身体的运动
			this.body[i][0]=this.body[i-1][0];
			this.body[i][1]=this.body[i-1][1];
			}
		}
		if(this.direct=='right'){
			if(!this.last)this.body[0][0]+=1;
		}
		if(this.direct=='left'){
			if(!this.last)this.body[0][0]-=1;
		}
		if(this.direct=='up'){
			if(!this.last)this.body[0][1]-=1;
		}
		if(this.direct=='down'){
			if(!this.last)this.body[0][1]+=1;
		}
		if(this.headIndex==this.foodIndex){//计分
			var text=this.divs[this.foodIndex].innerText.split(':');
			var x=parseInt(text[0]);
			var y=parseInt(text[1]);
			this.body.push([x,y,'#099e6a']);
			this.score++;
			this.span.innerHTML="当前成绩:\t"+this.score+"分";
			this.showFood();
		}
		this.show();
	}
	this.run=function(){//蛇的速度
		this.timer=setInterval(function(){
			This.move();
		},this.speed);
	}
}