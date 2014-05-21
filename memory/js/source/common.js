var common = {};
var $ = function(id){
	return document.getElementById(id);
}
var gameTime = 30; //游戏时间
var initScore = 0; //游戏分数
var playCout = 3;  //游戏开始倒数
var body = document.getElementsByTagName("body")[0];
var cacheNum;
var cacheSetinterval;

common.exam = ['&#xf003e;' ,'&#x344f;', '&#x3451;', '&#x3452;', '&#x3455;', '&#x3456;', '&#x345f;', '&#x345a;' , '&#x3459;', '&#x3457;', '&#x345d;', '&#x345c;', '&#x346c;', '&#x346d;']

common.countBack = function(){
	if (gameTime === -1) {
		return;
	}
	if(gameTime <= 10){
		$("countBack").setAttribute("class","count-back count-alert");
	}
	gameTime--;
	$("countBack").innerHTML = gameTime;
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

//游戏模版
common.createGame = function(){
	var tpl = document.createElement("div");
		tpl.className = "game-content";
		tpl.id = "game-content";
		tpl.innerHTML = '<div class="wrapCont" id="wrapCont">'
							+'<p class="content" id="question">loading...</p>'
						+'</div>'
						+'<div class="keyboard" id="keyboard">'
							+'<p class="kb-top"><span class="square" id="result-0">?</span></p>'
							+'<p class="kb-middle"><span class="square" id="result-1">?</span><span class="square" id="result-next">不会</span><span class="square" id="result-2">?</span></p>'
							+'<p class="kb-bottom"><span class="square" id="result-3">?</span></p>'
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
			if(this.innerHTML === '不会'){
				common.setTopic();
			}else if (Number(this.innerHTML) === common.exam[cacheNum][1]) {
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
	if(initScore >= 25){
		return '爱因斯坦';
	}else if(initScore >= 20 && initScore < 25){
		return '天才';
	}else if(initScore >= 15 && initScore < 20){
		return '靠近天才';
	}else if(initScore >= 5 && initScore < 15){
		return '普通人';
	}else if(initScore < 5){
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

    setTimeout(function(){
    	common.remove("full-alert");
    },600);

    //答题正确加一分
    initScore++;
}

common.showWrong = function(){
	var tpl = document.createElement("div");
		tpl.setAttribute("class","iconfont full-alert alert-wrong");
		tpl.innerHTML = '&#xf00b3;';
		tpl.id = 'full-alert';
    body.appendChild(tpl);

    common.setTopic();//换题

    setTimeout(function(){
    	common.remove("full-alert");
    },600);
}

common.remove = function(id){
	$("full-alert").parentNode.removeChild($("full-alert"));
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

	var rdArr = [];
	var level, levelClass = 'junior';
	if(initScore < 3){
		level = 6;
		levelClass = 'junior';
	}else if(initScore >= 3 && initScore < 6){
		level = 8;
		levelClass = 'middle';
	}else if(initScore >= 6){
		level = 10;
		levelClass = 'advance';
	}
	for(var j = 0;j < level;j++){
		rdArr.push(j)
	}
	for(var k = 0;k < rdArr.length;k++){
		var ram  = Math.floor(Math.random() * rdArr.length);
		tpl += cacheArr[ram];
	}

	//生成答案
	$("micon-list").className = 'micon-list ' + levelClass;
	$("micon-list").innerHTML = tpl;

	//正确答案
	// $("result-" + rd4).innerHTML = common.exam[rd4];
}

common.starGame()
// $("go-play").onclick = function(){
// 	var tpl = document.createElement("div");
// 		tpl.className = 'play-cout-back';
// 		tpl.innerHTML = '<span class="play-cn" id="play-cn">3</span>';
// 	$("game-detial").appendChild(tpl);

// 	cacheSetinterval = setInterval(function(){
// 		common.playCountNum();
// 	},1000)
// }
