var $ = function(id){
	return document.getElementById(id);
}
var body = document.getElementsByTagName("body")[0];
var gameTime = 30; //游戏时间
var initScore = 0; //游戏分数
var playCout = 3;  //游戏开始倒数
var addTime = 2;   //答题正确增加的事件(s)

//一些简单函数
var common = {
	hasClass : function(ele,cls){
		return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')); 
	},
	addClass : function(ele,cls){
		if (!this.hasClass(ele,cls)) ele.className += " "+cls;
	},
	removeClass : function(ele,cls){
		if (this.hasClass(ele,cls)) { 
			var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)'); 
			ele.className=ele.className.replace(reg,''); 
		} 
	},
	getOffsetLeft : function(o){
		var left = 0;
		var offsetParent = o;
		while (offsetParent != null && offsetParent != document.body){
			left += offsetParent.offsetLeft;
			offsetParent = offsetParent.offsetParent;
		}
		return left;
	},
	getOffsetTop : function(e){
		var top = 0;
		var offsetParent = e;
		while (offsetParent != null && offsetParent != document.body){
			top += offsetParent.offsetTop;
			offsetParent = offsetParent.offsetParent;
		}
		return top;
	}
};

//移除对象函数
common.remove = function(id,time){
	setTimeout(function(){
    	$(id).parentNode.removeChild($(id));
    },time);
}

//如果是微信内置浏览器提示分享
common.checkShare = function(){
	if(location.search.substr(1) == 'clear'){
		localStorage.removeItem("slayout");
	}

	if (!localStorage.getItem("slayout")) {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.indexOf('micromessenger') != -1) {
			var div = document.createElement("div");
				div.className = 'share-layout';
				div.id = 'share-layout';
				div.innerHTML = '<span class="inner">求支持！把游戏分享到朋友圈吧 :)</span><i class="iconfont icon-close" id="slayout-close">&#xf00b3;</i>';
			body.appendChild(div);

			$("slayout-close").onclick = function(){
				common.remove("share-layout",10);
		    	localStorage.setItem("slayout",1);
			}
		}
	}
}

//显示+2秒效果
common.addTimeAnimate = function(){
	var left = common.getOffsetLeft($("countBack")),
		top = common.getOffsetTop($("countBack")),
		width = $("countBack").clientWidth,
		height = $("countBack").clientHeight;

	var em = document.createElement("em");
		em.className = "add-time-out";
		em.id = "add-time-out";
		em.innerHTML = "+" + addTime;
		em.setAttribute("style","width:"+width+"px;height:"+height+"px;line-height:"+height+"px;left:"+left+"px;top:"+top+"px;")

	body.appendChild(em);

	common.remove("add-time-out",1000);//移掉弹层
}

// XD
console.log("%c", "padding:50px 300px;line-height:120px;background:url('http://www.it.com.cn/edu/artdesign/photoshop/exap/2010/03/08/15/100308_edu_qqbq4_13.gif') no-repeat;");