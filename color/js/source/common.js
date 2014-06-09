var cacheNum;
var cacheSetinterval;
var maskData;

common.color = [
		['000000', '黑'], ['FFFF00', '黄'], ['CFCFCF', '灰'], ['A0522D', '啡'], ['610808', '朱'],
		['0000EE', '蓝'], ['4B0082', '紫'], ['0a8b00', '绿'], ['26f2a3', '青'],['ff8a00', '橙'],
		['fc9d9d', '粉'], ['471818', '棕'],
		['000000', '黑'], ['FFFF00', '黄'], ['CFCFCF', '灰'], ['A0522D', '啡'], ['610808', '朱'],
		['0000EE', '蓝'], ['4B0082', '紫'], ['0a8b00', '绿'], ['26f2a3', '青'],['ff8a00', '橙'],
		['fc9d9d', '粉'], ['471818', '棕'],
		['000000', '黑'], ['FFFF00', '黄'], ['CFCFCF', '灰'], ['A0522D', '啡'], ['610808', '朱'],
		['0000EE', '蓝'], ['4B0082', '紫'], ['0a8b00', '绿'], ['26f2a3', '青'],['ff8a00', '橙'],
		['fc9d9d', '粉'], ['471818', '棕']
];

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
common.cacheFiles = function(){
	var tpl = '', cache = ['images/icon-over-1.png', 
						'images/icon-over-2.png'];
	for(var i = 0;i < cache.length;i++){
		tpl += '<img src="'+cache[i]+'" />';
	}
	var div = document.createElement("div");
		div.setAttribute("style","display:none;");
		div.innerHTML = tpl;
	body.appendChild(div);

	common.maskData();//加载游戏的图片文件
};

//游戏模版
common.createGame = function(){
	var tpl = document.createElement("div");
		tpl.className = "game-content";
		tpl.id = "game-content";
		tpl.innerHTML = '<div class="wrapCont" id="wrapCont">'
							+'<div class="color-wrap" id="color-wrap"><div class="color-mask" id="color-mask"></div></div>'
						+'</div>'
						+'<div class="q-link"><span class="q-inner">这个字的颜色是？</span></div>'
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
			}else if (this.innerHTML === common.color[cacheNum][1]) {
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

    common.setOverTime("color",initScore);

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
	var len = common.color.length;
	var ram  = Math.floor(Math.random() * len);
	var rd4  = Math.floor(Math.random() * 4);

	//随机遮罩模板
	var rd9  = Math.random() * 9 >> 0,
		maskImg = maskData[rd9];

	var color = common.color[ram][0],
		mask   = common.color[ram][1];

	var array = common.color;

	//随机生成答案
	for(var a = 0;a < 4;a++){
		var ram_a = Math.floor(Math.random() * len);

		$("result-"+a).innerHTML = common.color[ram_a][1];
		// array.splice(ram_a,1);
	}

	//提出问题
	$("color-wrap").setAttribute("style","background-color:#"+color);
	$("color-mask").setAttribute("style","background-image:url(data:image/png;base64,"+maskImg+")");

	//正确答案
	$("result-"+rd4).innerHTML = mask;
	return cacheNum = ram;
};

//缓存mask图片
common.maskData = function(){
	// if(!localStorage.getItem("maskData")){
	// 	common.ScriptLoader({
	// 		src : "js/mask-data.js"
	// 	});
	// 	console.log("from_js_"+maskData);

	// 	localStorage.setItem("maskData",maskData);
	// }else{
	// 	var maskData = localStorage.getItem("maskData");
	// 	console.log("from_LS_"+maskData);
	// }
	common.ScriptLoader({
		src : "js/mask-data.js"
	});
}

// common.createGame();
$("go-play").onclick = function(){
	var tpl = document.createElement("div");
		tpl.className = 'play-cout-back';
		tpl.innerHTML = '<span class="play-cn" id="play-cn">3</span>';
	$("game-detial").appendChild(tpl);

	common.cacheFiles();//点击的时候预加载游戏文件

	cacheSetinterval = setInterval(function(){
		common.playCountNum();
	},1000)
};

//检测浏览器
common.checkShare();