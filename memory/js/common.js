var common={hasClass:function(e,t){return e.className.match(new RegExp("(\\s|^)"+t+"(\\s|$)"))},addClass:function(e,t){this.hasClass(e,t)||(e.className+=" "+t)},removeClass:function(e,t){if(this.hasClass(e,t)){var o=new RegExp("(\\s|^)"+t+"(\\s|$)");e.className=e.className.replace(o,"")}},getOffsetLeft:function(e){for(var t=0,o=e;null!=o&&o!=document.body;)t+=o.offsetLeft,o=o.offsetParent;return t},getOffsetTop:function(e){for(var t=0,o=e;null!=o&&o!=document.body;)t+=o.offsetTop,o=o.offsetParent;return t}},$=function(e){return document.getElementById(e)},gameTime=30,initScore=0,playCout=3,addTime=2,body=document.getElementsByTagName("body")[0],cacheResult,cacheSetinterval;common.exam=["&#xf004e;","&#xf0051;","&#xf0057;","&#xf0059;","&#xf005f;","&#xf0064;","&#xf0066;","&#xf0069;","&#xf006a;","&#xf0075;","&#xf0078;","&#xf007c;","&#xf0083;","&#xf0085;","&#xf0091;","&#xf0095;","&#xf009a;","&#xf00a5;","&#xf00a7;","&#xf00b6;","&#xf019a;","&#xf01af;","&#xf01b0;","&#xf01c7;","&#xf01ca;","&#xf01d4;","&#xf01d5;","&#xf01ef;","&#xf01f0;","&#xf01f3;","&#xf0200;","&#x3432;","&#x3450;","&#x3452;","&#x3453;","&#x3455;","&#x3457;","&#x3459;","&#xf027f;","&#x3432;","&#x3438;","&#x343e;","&#x3448;","&#x344f;","&#x3451;","&#x3452;","&#x3454;","&#x3455;","&#x3456;","&#x3457;","&#x3458;","&#x3459;","&#x345a;","&#x345c;","&#x345d;","&#x345f;","&#x3460;","&#x3461;","&#x3469;","&#x346c;","&#x346d;","&#x346e;","&#x3481;","&#x3485;","&#x3486;","&#xf029d;","&#xf0007;","&#xf003e;","&#xe63e;"],common.countBack=function(){return-1!==gameTime?(10>=gameTime?$("countBack").setAttribute("class","count-back count-alert"):$("countBack").setAttribute("class","count-back"),gameTime--,$("countBack").innerHTML=gameTime,gameTime):void 0},common.playCountNum=function(){return 1===playCout?(playCout="GO!",$("play-cn").innerHTML=playCout,clearInterval(cacheSetinterval),setTimeout(function(){common.createGame(),$("game-detial").parentNode.removeChild($("game-detial"))},500),void 0):(playCout--,$("play-cn").innerHTML=playCout,void 0)},common.cacheIcon=function(){var e=document.createElement("div");e.setAttribute("style","display:none;"),e.innerHTML='<img src="/30s/memory/style/icon/icon.woff"><img src="/30s/memory/style/icon/icon.eot"><img src="/30s/memory/style/icon/icon.ttf"><img src="/30s/memory/style/icon/icon.svg">',$("game-detial").appendChild(e)},common.createGame=function(){var e=document.createElement("div");e.className="game-content",e.id="game-content",e.innerHTML='<div class="wrapCont" id="wrapCont"><ul class="micon-list micon-advance" id="micon-list"></ul></div><div class="q-link"><span class="q-inner">消失的图案是？</span></div><div class="keyboard" id="keyboard"><p class="kb-top"><span class="square" id="result-0">&#xf003e;</span></p><p class="kb-middle"><span class="square" id="result-1">&#x3451;</span><span class="square" id="result-next">忘了</span><span class="square" id="result-2">&#xf003e;</span></p><p class="kb-bottom"><span class="square" id="result-3">&#x3456;</span></p></div><span class="count-back" id="countBack">30</span>',$("mainboard").appendChild(e),common.starGame()},common.starGame=function(){cacheSetinterval=setInterval(function(){return common.countBack(),0===gameTime?common.creatOverMask():void 0},1e3),common.setTopic();for(var e=$("keyboard").getElementsByTagName("span").length,t=0;e>t;t++)$("keyboard").getElementsByTagName("span")[t].onclick=function(){"忘了"===this.innerHTML?common.setTopic():this.innerHTML===cacheResult?common.showRight():common.showWrong()}},common.refreshGame=function(){$("refresh-game").onclick=function(){$("over-mask").parentNode.removeChild($("over-mask")),$("game-content").parentNode.removeChild($("game-content")),gameTime=30,initScore=0,common.createGame()}},common.creatOverMask=function(){clearInterval(cacheSetinterval);var e=this.level(initScore),t=document.createElement("div");t.className="over-mask",t.id="over-mask",t.innerHTML='<div class="mask-inner"><p class="title"><i class="iconfont icon-timeout">&#xe660;</i>时间到啦 :(</p><p class="score">您的得分是：<span class="red" id="final-score">'+initScore+'</span> 等级是：<span class="red" id="final-level">'+e+"</span></p>"+'<p class="desc"><a href="javascript:;" class="refresh" id="refresh-game"><i class="iconfont icon-refresh">&#xf0005;</i>再来一次</a></p>'+"</div>"+"</div>",body.appendChild(t),document.getElementsByTagName("title")[0].innerHTML="最强右脑—最终得分"+initScore+";级别是:"+e,common.refreshGame()},common.level=function(e){return 10>e?"脑瘫":e>=10&&20>e?"幼儿园":e>=20&&30>e?"小学生":e>=30&&40>e?"中学生":e>=40&&50>e?"大学生":e>=50&&60>e?"研究生":e>=60&&80>e?"博士生":e>=80&&150>e?"天才！你妈妈知道吗？":e>=150?"骚年，收我为徒吧":void 0},common.showRight=function(){var e=document.createElement("div");e.setAttribute("class","iconfont full-alert alert-right"),e.innerHTML="&#xf006a;",e.id="full-alert",body.appendChild(e),common.setTopic(),common.remove("full-alert",600),initScore++,gameTime=Number(Number(gameTime)+addTime),$("countBack").innerHTML=gameTime,common.addTimeAnimate()},common.showWrong=function(){var e=document.createElement("div");e.setAttribute("class","iconfont full-alert alert-wrong"),e.innerHTML="&#xf00b3;",e.id="full-alert",body.appendChild(e),common.setTopic(),common.remove("full-alert",600)},common.remove=function(e,t){setTimeout(function(){$(e).parentNode.removeChild($(e))},t)},common.setTopic=function(){var e=common.exam.length;Math.floor(Math.random()*e);var t=Math.floor(4*Math.random()),o=Math.floor(Math.random()*e),n=Math.floor(Math.random()*e),i=Math.floor(Math.random()*e),a=Math.floor(Math.random()*e);$("result-0").innerHTML=common.exam[o],$("result-1").innerHTML=common.exam[n],$("result-2").innerHTML=common.exam[i],$("result-3").innerHTML=common.exam[a];for(var s="",l=[],c="",r=0;e>r;r++)s='<li class="micon item">'+common.exam[r]+"</li>",l.push(s);var m,d="junior";4>initScore?(m=6,d="junior"):initScore>=4&&10>initScore?(m=8,d="middle"):initScore>=10&&16>initScore?(m=10,d="advance"):initScore>=16&&(m=12,d="superman");for(var u=0;m>u;u++){var f=Math.floor(Math.random()*e);c+=l[f]}$("micon-list").className="micon-list micon-"+d,$("micon-list").innerHTML=c;var p=Math.floor(Math.random()*m),h=$("micon-list").getElementsByTagName("li")[p].innerHTML;return $("micon-list").getElementsByTagName("li")[p].className="micon item result-hide",$("result-"+t).innerHTML=h,$("result-"+t).className="square result-answer",cacheResult=h},common.addTimeAnimate=function(){var e=common.getOffsetLeft($("countBack")),t=common.getOffsetTop($("countBack")),o=$("countBack").clientWidth,n=$("countBack").clientHeight,i=document.createElement("em");i.className="add-time-out",i.id="add-time-out",i.innerHTML="+"+addTime,i.setAttribute("style","width:"+o+"px;height:"+n+"px;line-height:"+n+"px;left:"+e+"px;top:"+t+"px;"),body.appendChild(i),common.remove("add-time-out",1e3)},$("go-play").onclick=function(){var e=document.createElement("div");e.className="play-cout-back",e.innerHTML='<span class="play-cn" id="play-cn">3</span>',$("game-detial").appendChild(e),common.cacheIcon(),cacheSetinterval=setInterval(function(){common.playCountNum()},1e3)};