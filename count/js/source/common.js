var cacheAnswer;
var cacheSetinterval;

common.exam = [
	['6 + 9 = ?', 15], ['50 ÷ 5 = ?', 10], ['3 × 9 = ?', 27], ['81 - 9 = ?', 72],
	['19 + 7 = ?', 26], ['36 ÷ 3 = ?', 12], ['7 × 70 = ?', 490], ['16 - 7 = ?', 9],
	['36 + 19 = ?', 55], ['120 ÷ 3 = ?', 40], ['19 × 3 = ?', 57], ['27 - 16 = ?', 11],
	['42 + 4 = ?', 46], ['44 ÷ 2 = ?', 22], ['78 × 3 = ?', 234], ['536 - 257 = ?', 279],
	['392 + 27 = ?', 419], ['338 ÷ 13 = ?', 26], ['78 × 15 = ?', 1170], ['49 - 27 = ?', 22],
	['32 + 19 = ?', 51], ['81 ÷ 9 = ?', 9], ['19 × 9 = ?', 171], ['89 - 12 = ?', 77],
	['51 + 23 = ?', 74], ['72 ÷ 9 = ?', 8], ['9 × 18 = ?', 162], ['2 - 89 = ?', -87]
];

common.getExam = function(exam){
	var symbol = "+-×÷".charAt(Math.random() * 4 >> 0);
	var number1 = Math.random() * 1000 >> 0;
	var number2 = Math.random() * 100 >> 0;
	var answer = 0;
	switch(symbol) {
		case "×":
			// 降低乘法计算难度
			number1 = number1 % 100;
			answer = number1 * number2;
			break;
		case "÷":
			// 保证可以被整除, 且0不能做被除数
			number2 = number2 || (Math.ceil(Math.random() * 100));
			number1 -= number1 % number2;
			answer = number1 / number2;
			break;
		default:
			answer = eval(number1 + symbol + number2);
			break;
	}

	return [[number1, symbol, number2, "=", "?"].join(" "), answer];
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
	$("game-detial").appendChild(div);
};

//游戏模版
common.createGame = function(){
	var tpl = document.createElement("div");
		tpl.className = "game-content";
		tpl.id = "game-content";
		tpl.innerHTML = '<div class="wrapCont" id="wrapCont">'
							+'<p class="content" id="question">loading...</p>'
						+'</div>'
						+'<div class="q-link"><span class="q-inner">算术的答案是？</span></div>'
						+'<div class="keyboard" id="keyboard">'
							+'<p class="kb-top"><span class="square" id="result-0">?</span></p>'
							+'<p class="kb-middle"><span class="square" id="result-1">?</span><span class="square" id="result-next">不会</span><span class="square" id="result-2">?</span></p>'
							+'<p class="kb-bottom"><span class="square" id="result-3">?</span></p>'
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
			if(this.innerHTML === '不会'){
				common.setTopic();
			}else if (Number(this.innerHTML) === cacheAnswer) {
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

    common.setOverTime("count",initScore);

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
	
	var exam = common.getExam();
	var question = exam[0];
	var answer = cacheAnswer = exam[1];

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

	//提出问题
	$("question").innerHTML = question;
};

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
