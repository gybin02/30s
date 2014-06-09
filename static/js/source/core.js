var $ = function(id){
	return document.getElementById(id);
}
var body = document.getElementsByTagName("body")[0];
var gameTime = 30; //游戏时间
var initScore = 0; //游戏分数
var playCout = 3;  //游戏开始倒数
var addTime = 2;   //答题正确增加的时间(s)
var stime = null;  //开始游戏的时间
var statUrl = 'http://www.demo.3kwan.cn/tj.php'; //分数统计的url，打开这个可以看到分数数据

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
	},
	ajax : function(url, success, faild){
	    var oAjax = null;
	    if(window.XMLHttpRequest){
	        oAjax = new XMLHttpRequest();
	    }else{
	        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
	    }

	    oAjax.open('GET', url, true);//open(方法, url, 是否异步)

	    oAjax.send();

	    oAjax.onreadystatechange = function(){//OnReadyStateChange事件
	        if(oAjax.readyState == 4){//4为完成
	            if(oAjax.status == 200){//200为成功
	                success(oAjax.responseText) 
	            }else{
	                if(faild){
	                    faild();
	                }
	            }
	        }
	    };
	},
	ScriptLoader : function(config) {
		if (!config || !config.src) return;
		var  doc = document;
		var Head = doc.getElementsByTagName('head')[0],			
			Script = doc.createElement('script');
			Script.onload = Script.onreadystatechange = function() {
				if (Script && Script.readyState && Script.readyState != 'loaded' && Script.readyState != 'complete') return;
				Script.onload = Script.onreadystatechange = Script.onerror = null;
				Script.Src = '';
				if(!doc.all){Script.parentNode.removeChild(Script);}
				Script = null;
			};
			Script.src = config.src;
			Script.charset = config.charset || 'utf-8';
			Head.insertBefore(Script,Head.firstChild);
	}
};

//倒数计数器
common.countBack = function(){
	if (gameTime === -1) {
		return;
	}
	if(gameTime <= 10){
		$("countBack").setAttribute("class","count-back count-alert");
	}else{
		$("countBack").setAttribute("class","count-back");
	}
	gameTime--;
	$("countBack").innerHTML = gameTime;
	return gameTime;
};

//移除对象函数
common.remove = function(id,time){
	setTimeout(function(){
    	$(id).parentNode.removeChild($(id));
    },time);
};

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
};

//洗牌算法
common.mess = function(arr){
    var _floor = Math.floor, _random = Math.random, 
        len = arr.length, i, j, arri, 
        n = _floor(len/2)+1; 
    while( n-- ){
        i = _floor(_random()*len);
        j = _floor(_random()*len);
        if( i !== j ){
            arri = arr[i];
            arr[i] = arr[j];
            arr[j] = arri;
        }
    }
    //增加切牌操作
    i = _floor(_random() * len);
    arr.push.apply(arr, arr.splice(0,i));
    return arr;
}

//级别算出
common.level = function(score){
	if(score < 10){
		return '脑瘫';
	}else if(score >= 10 && score < 20){
		return '幼儿园';
	}else if(score >= 20 && score < 30){
		return '小学生';
	}else if(score >= 30 && score < 40){
		return '中学生';
	}else if(score >= 40 && score < 50){
		return '大学生';
	}else if(score >= 50 && score < 60){
		return '研究生';
	}else if(score >= 60 && score < 80){
		return '博士生';
	}else if(score >= 80 && score < 150){
		return '天才！你妈妈知道吗？';
	}else if(score >= 150){
		return '骚年，收我为徒吧';
	}
};

common.quoteArr = {
	'junior' : ['骚年，还是得继续努力啊，你饿不饿我下面给你吃？', 
				'呐，做人呢~最重要是认真，输了不要紧再来一次', 
				'所以呢，这个游戏还是挺适合智力缺陷的玩家的', 
				'哇靠，经测试您的分数简直就是未老先衰的迹象啊！', 
				'经游戏组委会研究得出，您有点轻度脑障！', 
				'玩出这样的分数，你对得起祖国，对得起养你育你的父母吗！', 
				'测试这么低分，今天你是不是穿反了内裤？',  
				'恭喜你！又破了我们游戏的新低啊！', 
				'样子丑不要紧，右脑智力缺陷问题可是很严重的哦', 
				'分数这么低，你妈妈造吗？你爸呢？'],

	'middle' : ['看起来还不错的样子，再认真一点就好了', 
				'呐，做人呢~和玩游戏一样的，敢不敢再来一次？', 
				'风水先生说，你这个姿势玩不高分的啊', 
				'哇靠，经测试您的分数简直就是未老先衰的迹象啊！',
				'测试右脑之前，要把头发梳成五五分才高分的哦', 
				'你的右脑似乎还有待开发哦', 
				'分数这么低，你妈妈造吗？你爸呢？'],

	'advance' : ['嗯，还不错，就是怀疑你作弊的。敢不敢再来一次？', 
				'呐，做人呢~最重要是认真，玩饿了吧？我下面给你吃？', 
				'咦？手机型号不错，再刷一次高分吧', 
				'哇靠，经测试您的分数简直就是未老先衰的迹象啊！',
				'既然那么丧心病狂的牛x，就赠你5个Q币好了：IQOU24RJFLJJL', 
				'喂喂，怎么能够这么高分啊，有什么秘籍吗？', 
				'天呐，我都怀疑你是不是开挂刷的分数', 
				'分数这么高，你妈妈造吗？你爸呢？']
};

//评语
common.quote = function(score){
	if(score < 20){
		var len = common.quoteArr.junior.length;
		var ram  = Math.floor(Math.random() * len);
		return common.quoteArr.junior[ram];
	}else if(score >= 20 && score < 40){
		var len = common.quoteArr.middle.length;
		var ram  = Math.floor(Math.random() * len);
		return common.quoteArr.middle[ram];
	}else if(score >= 40){
		var len = common.quoteArr.advance.length;
		var ram  = Math.floor(Math.random() * len);
		return common.quoteArr.advance[ram];
	}
};

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
};

common.setStartime = function(){
	stime = new Date().getTime();
	return stime;
};

common.setOverTime = function(game,score){
	//分数POST统计
	var ntime = new Date().getTime();
	var otime = parseInt((ntime - stime) / 1000);
    common.ajax(statUrl + '?game='+game+'&time='+otime+'&score='+score,function(data){
    	console.log('post complete!')
    });
}

// XD
console.log("%c", "padding:50px 300px;line-height:120px;background:url('http://www.it.com.cn/edu/artdesign/photoshop/exap/2010/03/08/15/100308_edu_qqbq4_13.gif') no-repeat;");