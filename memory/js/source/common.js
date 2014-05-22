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
var $ = function(id){
	return document.getElementById(id);
}
var gameTime = 30; //游戏时间
var initScore = 0; //游戏分数
var playCout = 3;  //游戏开始倒数
var addTime = 2;   //答题正确增加的事件(s)
var body = document.getElementsByTagName("body")[0];
var cacheResult;
var cacheSetinterval;

common.exam = ['&#xf003e;' ,'&#x344f;', '&#x3451;', '&#x3452;', '&#x3455;', '&#x3456;', '&#x345f;', '&#x345a;' , '&#x3459;', '&#x3457;', '&#x345d;', '&#x345c;', '&#x346c;', '&#x346d;']

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
}

common.playCountNum = function(){
	if (playCout === 1) {
		playCout = 'GO!';
		$("play-cn").innerHTML = playCout;
		clearInterval(cacheSetinterval);
		setTimeout(function(){
			common.createGame();
			$("game-detial").parentNode.removeChild($("game-detial"));
		},500)
		return;
	}
	playCout--;
	$("play-cn").innerHTML = playCout;
}

//预加载字体图标
common.cacheIcon = function(){
	var div = document.createElement("div");
		div.setAttribute("style","display:none;");
		div.innerHTML = '<img src="/30s/memory/style/icon/icon.woff"><img src="/30s/memory/style/icon/icon.eot"><img src="/30s/memory/style/icon/icon.ttf"><img src="/30s/memory/style/icon/icon.svg">';
	$("game-detial").appendChild(div);
}

//游戏模版
common.createGame = function(){
	var tpl = document.createElement("div");
		tpl.className = "game-content";
		tpl.id = "game-content";
		tpl.innerHTML = '<div class="wrapCont" id="wrapCont">'
							+'<ul class="micon-list micon-advance" id="micon-list">'
								+'<li class="micon item">&#xf003e;</li>'
								+'<li class="micon item">&#x344f;</li>'
								+'<li class="micon item">&#x3451;</li>'
								+'<li class="micon item">&#x3452;</li>'
								+'<li class="micon item">&#x3455;</li>'
								+'<li class="micon item">&#x3456;</li>'
								+'<li class="micon item">&#x345f;</li>'
								+'<li class="micon item">&#x345a;</li>'
								+'<li class="micon item">&#xf003e;</li>'
								+'<li class="micon item">&#x344f;</li>'
							+'</ul>'
						+'</div>'
						+'<div class="q-link"><span class="q-inner">消失的图案是？</span></div>'
						+'<div class="keyboard" id="keyboard">'
							+'<p class="kb-top"><span class="square" id="result-0">&#xf003e;</span></p>'
							+'<p class="kb-middle"><span class="square" id="result-1">&#x3451;</span><span class="square" id="result-next">忘了</span><span class="square" id="result-2">&#xf003e;</span></p>'
							+'<p class="kb-bottom"><span class="square" id="result-3">&#x3456;</span></p>'
						+'</div>'
						+'<span class="count-back" id="countBack">30</span>';
    $("mainboard").appendChild(tpl);

    common.starGame();
}

//初始化游戏
common.starGame = function(){
	cacheSetinterval = setInterval(function(){
		common.countBack();
		if (gameTime === 0) {
			return common.creatOverMask();
		}
	},1000)

	common.setTopic();

	var kbLen = $("keyboard").getElementsByTagName("span").length;
	for(var i = 0;i < kbLen;i++){
		$("keyboard").getElementsByTagName("span")[i].onclick = function(){
			if(this.innerHTML === '忘了'){
				common.setTopic();
			}else if (this.innerHTML === cacheResult) {
				common.showRight();
			}else{
				common.showWrong();
			}
		}
	}
}

//再玩一次
common.refreshGame = function(){
    $("refresh-game").onclick = function(){
		$("over-mask").parentNode.removeChild($("over-mask"));
		$("game-content").parentNode.removeChild($("game-content"));
		gameTime = 30; //游戏时间
		initScore = 0; //游戏分数
		common.createGame();
	}
}

//结束模版
common.creatOverMask = function(){
	clearInterval(cacheSetinterval);
	var level = this.level(initScore);
	var tpl = document.createElement("div");
		tpl.className = "over-mask";
		tpl.id = "over-mask";
		tpl.innerHTML = '<div class="mask-inner">'
								+'<p class="title"><i class="iconfont icon-timeout">&#xe660;</i>时间到啦 :(</p>'
								+'<p class="score">您的得分是：<span class="red" id="final-score">'+initScore+'</span> 等级是：<span class="red" id="final-level">'+level+'</span></p>'
								+'<p class="desc"><a href="javascript:;" class="refresh" id="refresh-game"><i class="iconfont icon-refresh">&#xf0005;</i>再来一次</a></p>'
							+'</div>'
						+'</div>';
    body.appendChild(tpl);
    document.getElementsByTagName("title")[0].innerHTML = "最强右脑—最终得分"+initScore+";级别是:"+level;

    common.refreshGame();
}

//级别算出
common.level = function(score){
	if(initScore >= 70){
		return '天才！你妈妈知道吗？'
	}else if(initScore >= 50 && initScore < 70){
		return '大学生';
	}else if(initScore >= 30 && initScore < 40){
		return '高中生';
	}else if(initScore >= 20 && initScore < 30){
		return '中学生';
	}else if(initScore >= 10 && initScore < 20){
		return '小学生';
	}else if(initScore < 10){
		return '脑瘫';
	}
}

common.showRight = function(){
	var tpl = document.createElement("div");
		tpl.setAttribute("class","iconfont full-alert alert-right");
		tpl.innerHTML = '&#xf006a;';
		tpl.id = 'full-alert';
    body.appendChild(tpl);

    common.setTopic();//换题

    common.remove("full-alert",600);//移掉弹层

    //答题正确加一分
    initScore++;

    //时间加3秒
    gameTime = Number(Number(gameTime) + addTime);
    $("countBack").innerHTML = gameTime;

    //加时间的样式
    common.addTimeAnimate();
}

common.showWrong = function(){
	var tpl = document.createElement("div");
		tpl.setAttribute("class","iconfont full-alert alert-wrong");
		tpl.innerHTML = '&#xf00b3;';
		tpl.id = 'full-alert';
    body.appendChild(tpl);

    common.setTopic();//换题

    common.remove("full-alert",600);//移掉弹层
}

common.remove = function(id,time){
	setTimeout(function(){
    	$(id).parentNode.removeChild($(id));
    },time);
}

common.setTopic = function(){
	var examLen = common.exam.length;
	var rdExam  = Math.floor(Math.random() * examLen);
	var rd4  = Math.floor(Math.random() * 4);
	var random_0  = Math.floor(Math.random() * examLen),
		random_1  = Math.floor(Math.random() * examLen),
		random_2  = Math.floor(Math.random() * examLen),
		random_3  = Math.floor(Math.random() * examLen);

	//随机生成答案
	$("result-0").innerHTML = common.exam[random_0];
	$("result-1").innerHTML = common.exam[random_1];
	$("result-2").innerHTML = common.exam[random_2];
	$("result-3").innerHTML = common.exam[random_3];

	//随机排列答案
	var list = '', cacheArr = [], tpl = '';
	for(var i = 0;i < examLen;i++){
		list = '<li class="micon item">'+common.exam[i]+'</li>';
		cacheArr.push(list);
	}

	//随机发牌算出问题
	var rdArr = [], level, levelClass = 'junior';
	if(initScore < 4){
		level = 6;
		levelClass = 'junior';
	}else if(initScore >= 4 && initScore < 10){
		level = 8;
		levelClass = 'middle';
	}else if(initScore >= 10 && initScore < 16){
		level = 10;
		levelClass = 'advance';
	}else if(initScore >= 16){
		level = 12;
		levelClass = 'superman';
	}

	for(var j = 0;j < level;j++){
		rdArr.push(j)
	}
	for(var k = 0;k < level;k++){
		var ram  = Math.floor(Math.random() * level);
		tpl += cacheArr[ram];
	}

	//生成问题
	$("micon-list").className = 'micon-list micon-' + levelClass;
	$("micon-list").innerHTML = tpl;

	//正确答案
	var level_ram = Math.floor(Math.random() * level);
	var result_html = $("micon-list").getElementsByTagName("li")[level_ram].innerHTML;
	$("micon-list").getElementsByTagName("li")[level_ram].className = 'micon item result-hide';
	$("result-" + rd4).innerHTML = result_html;
	$("result-" + rd4).className = 'square result-answer';

	return cacheResult = result_html;
}

//显示+3秒效果
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

// common.starGame() //模板调试的时候开启
$("go-play").onclick = function(){
	var tpl = document.createElement("div");
		tpl.className = 'play-cout-back';
		tpl.innerHTML = '<span class="play-cn" id="play-cn">3</span>';
	$("game-detial").appendChild(tpl);

	common.cacheIcon();//点击的时候预加载字体文件

	cacheSetinterval = setInterval(function(){
		common.playCountNum();
	},1000)
}
console.log($("go-play"))