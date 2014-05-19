var common = {};
var $ = function(id){
	return document.getElementById(id);
}
var gameTime = 30; //游戏时间
var initScore = 0; //游戏分数
var body = document.getElementsByTagName("body")[0];
var cacheNum;
var cacheSetinterval;

common.exam = {
	'question' : [
		'6 + 9 = ?',
		'50 ÷ 5 = ?',
		'3 × 9 = ?',
		'81 - 9 = ?',
		'19 + 7 = ?',
		'36 ÷ 3 = ?',
		'7 × 70 = ?',
		'16 - 7 = ?',
		'42 + 4 = ?',
		'44 ÷ 2 = ?',
		'78 × 3 = ?',
		'89 - 12 = ?',
		'51 + 23 = ?',
		'72 ÷ 9 = ?',
		'9 × 18 = ?',
		'2 - 89 = ?'
	],
	'answer' : [
		'15',
		'10',
		'27',
		'72',
		'26',
		'12',
		'490',
		'9',
		'46',
		'22',
		'234',
		'77',
		'74',
		'8',
		'162',
		'-87'
	]
}
common.countBack = function(){
	if (gameTime === -1) {
		return;
	}
	gameTime--;
	$("countBack").innerHTML = gameTime;
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
			}else if (this.innerHTML === common.exam.answer[cacheNum]) {
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
	var examLen = common.exam.question.length;
	var rdExam  = Math.floor(Math.random() * examLen);
	var rd4  = Math.floor(Math.random() * 4);
	var random_a  = Math.floor(Math.random() * 99),
		random_b  = Math.floor(Math.random() * 99),
		random_c  = Math.floor(Math.random() * 99),
		random_d  = Math.floor(Math.random() * 99);

	var question = common.exam.question[rdExam],
		answer   = common.exam.answer[rdExam];

	//随机生成答案
	$("result-0").innerHTML = random_a;
	$("result-1").innerHTML = random_b;
	$("result-2").innerHTML = random_c;
	$("result-3").innerHTML = random_d;

	//提出问题
	$("question").innerHTML = question;

	//正确答案
	$("result-"+rd4).innerHTML = answer;
	return cacheNum = rdExam;
}

$("go-play").onclick = function(){
	common.createGame();
	$("game-detial").parentNode.removeChild($("game-detial"));
}
