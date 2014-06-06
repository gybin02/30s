var type = (location.hash.match(/\btype=\b(\w+)\b/) || [,'max'])[1].toLowerCase();
var cacheResult;
var cacheSetinterval;

common.getExam = function(number){
	var question = [];
	var answer = 0;
	var max = 0;
	var min = 100;

	var random_counts = number; // 需要随机生成的个数
	while(random_counts) {
		var temp = Math.random() * 99 >> 0;
		if (question.indexOf(temp) === -1) { // 避免出现重复
			question.push(temp);
			max = Math.max(max, temp);
			min = Math.min(min, temp);
			random_counts--;
		}
	}

	switch(type) {
		case "min":
			answer = min;
			break;
		case "repeat":
			answer = question[0];
			question.pop();
			question.push(answer);
			break;
		default:
			answer = max;
			break;
	}
	
	return [question.join("-"), answer];
};

//开始游戏倒数
common.playCountNum = function(){
	if (playCout === 1) {
		playCout = 'GO!';
		$("play-cn").innerHTML = playCout;
		clearInterval(cacheSetinterval);
		setTimeout(function(){
			common.createGame();
			$("game-detial").parentNode.removeChild($("game-detial"));
			common.setStartime();
		},500)
		return;
	}
	playCout--;
	$("play-cn").innerHTML = playCout;
};

//预加载游戏文件
common.cacheIcon = function(){
	var tpl, cache = ['images/icon-over-1.png', 'images/icon-over-2.png'];
	for(var i = 0;i < cache.length;i++){
		tpl += '<img src="'+cache[i]+'" />';
	}
	var div = document.createElement("div");
		div.setAttribute("style","display:none;");
		div.innerHTML = tpl;
	body.appendChild(div);
};

//游戏模版
common.createGame = function(){
	var question = "";
	switch(type) {
		case "min":
			question = "消失的数字中最小的是？";
			break;
		case "repeat":
			question = "消失的数字中重复的是？";
			break;
		default:
			question = "消失的数字中最大的是？";
			break;
	}
	var tpl = document.createElement("div");
		tpl.className = "game-content";
		tpl.id = "game-content";
		tpl.innerHTML = '<div class="wrapCont" id="wrapCont">'
							+'<ul class="micon-list micon-advance" id="micon-list"></ul>'
						+'</div>'
						+'<div class="q-link"><span class="q-inner">' + question + '</span></div>'
						+'<div class="keyboard" id="keyboard">'
							+'<p class="kb-top"><span class="square" id="result-0"></span></p>'
							+'<p class="kb-middle"><span class="square" id="result-1"></span><span class="square" id="result-next">忘了</span><span class="square" id="result-2"></span></p>'
							+'<p class="kb-bottom"><span class="square" id="result-3"></span></p>'
						+'</div>'
						+'<span class="count-back" id="countBack">30</span>';
    $("mainboard").appendChild(tpl);

    common.starGame();
};

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
			}else if (this.innerHTML === cacheResult.toString()) {
				common.showRight();
			}else{
				common.showWrong();
			}
		}
	}
};

//再玩一次
common.refreshGame = function(){
    $("refresh-game").onclick = function(){
		$("over-mask").parentNode.removeChild($("over-mask"));
		$("game-content").parentNode.removeChild($("game-content"));
		gameTime = 30; //游戏时间
		initScore = 0; //游戏分数
		common.createGame();
	}
};

//结束模版
common.creatOverMask = function(){
	var ram  = Math.floor(Math.random() * 2);
	clearInterval(cacheSetinterval);
	// var level = this.level(initScore);
	var quote = this.quote(initScore);
	
	var tpl = document.createElement("div");
		tpl.className = "over-mask";
		tpl.id = "over-mask";
		tpl.innerHTML = '<div class="mask-wrap"><div class="mask-inner">'
								+'<div class="icon-over over-'+ram+'"></div>'
								+'<p class="title"><i class="iconfont icon-timeout">&#xe660;</i>时间到啦 :(</p>'
								+'<p class="score">最终得分是：<span class="red" id="final-score">'+initScore+'</span></p>'
								+'<p class="quote">“'+quote+'”</p>'
								+'<p class="desc"><a href="javascript:;" class="refresh" id="refresh-game"><i class="iconfont icon-refresh">&#xf0005;</i>再来一次</a></p>'
							+'</div>'
						+'</div></div>';
    body.appendChild(tpl);
    document.getElementsByTagName("title")[0].innerHTML = "最强右脑—测试得分"+initScore+";“"+quote+"”";

    common.setOverTime(type,initScore);

    common.refreshGame();
};

//答题正确
common.showRight = function(){
	var tpl = document.createElement("div");
		tpl.setAttribute("class","iconfont full-alert alert-right");
		tpl.innerHTML = '&#xf006a;';
		tpl.id = 'full-alert';
    body.appendChild(tpl);

    common.remove("full-alert",600);//移掉弹层

    //答题正确加一分
    initScore++;

    //时间加3秒
    gameTime = Number(Number(gameTime) + addTime);
    $("countBack").innerHTML = gameTime;

    //加时间的样式
    common.addTimeAnimate();

	//换题
	setTimeout(function(){
    	common.setTopic();
	},600)
};

//答题错误
common.showWrong = function(){
	var tpl = document.createElement("div");
		tpl.setAttribute("class","iconfont full-alert alert-wrong");
		tpl.innerHTML = '&#xf00b3;';
		tpl.id = 'full-alert';
    body.appendChild(tpl);

    common.remove("full-alert",600);//移掉弹层

    //换题
	setTimeout(function(){
    	common.setTopic();
	},600)
};

//出题
common.setTopic = function(){
	// 模版
	var list = '<li class="micon item">{{value}}</li>';

	// 级别
	var level, levelClass = 'junior';
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

	var exam = common.getExam(level);
	var question = exam[0].split("-");
	var answer = cacheResult = exam[1];

	var random_counts = 3; // 需要随机生成的答案个数
	var answer_list = [answer];
	while(random_counts) {
		var temp = Math.random() * 99 >> 0;
		if (answer_list.indexOf(temp) === -1) { // 避免出现重复答案
			answer_list.push(temp);
			random_counts--;
		}
	}

	answer_list.sort(function(){
		return Math.random() > .5; // 随机打乱答案顺序
	});

	for(var a = 0; a < 4; a++){
		$("result-" + a).innerHTML = answer_list[a];
	}

	var html = [];
	question.sort(function(){
		return Math.random() > .5 ? -1 : 1; // 打乱问题元素顺序
	});
	var question_length = question.length;
	while(question_length) {
		question_length--;
		html.push(list.replace(/{{value}}/ig, question[question_length]));
	}

	// 生成问题
	$("micon-list").className = 'micon-list micon-' + levelClass;
	$("micon-list").innerHTML = html.join("");
	$("micon-list").style.visibility = "visible";

	setTimeout(function(){
		$("micon-list").style.visibility = "hidden";
	}, 800);
};

// common.starGame() //模板调试的时候开启
$("go-play").onclick = function(){
	var tpl = document.createElement("div");
		tpl.className = 'play-cout-back';
		tpl.innerHTML = '<span class="play-cn" id="play-cn">3</span>';
	$("game-detial").appendChild(tpl);

	common.cacheIcon();//点击的时候预加载游戏文件

	cacheSetinterval = setInterval(function(){
		common.playCountNum();
	},1000)
}

//检测浏览器
common.checkShare();