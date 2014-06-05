;(function(){
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
	// Array.prototype.aremove = function(i){
	//      if(isNaN(i) || i > this.length ){
	//      	return false;
	//      }
	//      this.splice(i,1);
	// }
	var $ = function(id){
		return document.getElementById(id);
	}
	var gameTime = 30; //游戏时间
	var initScore = 0; //游戏分数
	var playCout = 3;  //游戏开始倒数
	var addTime = 2;   //答题正确增加的事件(s)
	var body = document.getElementsByTagName("body")[0];
	var cacheNum;
	var cacheSetinterval;

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

	//开始游戏倒数
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
	};

	//预加载游戏文件
	common.cacheIcon = function(){
		var tpl = '', cache = ['images/icon-over-1.png', 
							'images/icon-over-2.png',
							'images/mask/mask-00.png',
							'images/mask/mask-01.png',
							'images/mask/mask-02.png',
							'images/mask/mask-03.png',
							'images/mask/mask-04.png',
							'images/mask/mask-05.png',
							'images/mask/mask-06.png',
							'images/mask/mask-07.png',
							'images/mask/mask-08.png'];
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

	    common.refreshGame();
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

	//移除对象函数
	common.remove = function(id,time){
		setTimeout(function(){
	    	$(id).parentNode.removeChild($(id));
	    },time);
	}

	//出题
	common.setTopic = function(){
		var len = common.color.length;
		var ram  = Math.floor(Math.random() * len);
		var rd4  = Math.floor(Math.random() * 4);

		//随机遮罩模板
		var rd9  = Math.random() * 9 >> 0,
			maskImg = 'images/mask/mask-0'+rd9+'.png';

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
		$("color-mask").setAttribute("style","background-image:url("+maskImg+")");

		//正确答案
		$("result-"+rd4).innerHTML = mask;
		return cacheNum = ram;
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

		// XD
		console.log("%c", "padding:50px 300px;line-height:120px;background:url('http://www.it.com.cn/edu/artdesign/photoshop/exap/2010/03/08/15/100308_edu_qqbq4_13.gif') no-repeat;");
	}

	// common.createGame();
	$("go-play").onclick = function(){
		var tpl = document.createElement("div");
			tpl.className = 'play-cout-back';
			tpl.innerHTML = '<span class="play-cn" id="play-cn">3</span>';
		$("game-detial").appendChild(tpl);

		common.cacheIcon();//点击的时候预加载游戏文件

		cacheSetinterval = setInterval(function(){
			common.playCountNum();
		},1000)
	};

	//检测浏览器
	common.checkShare();
})();