var common={hasClass:function(e,n){return e.className.match(new RegExp("(\\s|^)"+n+"(\\s|$)"))},addClass:function(e,n){this.hasClass(e,n)||(e.className+=" "+n)},removeClass:function(e,n){if(this.hasClass(e,n)){var o=new RegExp("(\\s|^)"+n+"(\\s|$)");e.className=e.className.replace(o,"")}},getOffsetLeft:function(e){for(var n=0,o=e;null!=o&&o!=document.body;)n+=o.offsetLeft,o=o.offsetParent;return n},getOffsetTop:function(e){for(var n=0,o=e;null!=o&&o!=document.body;)n+=o.offsetTop,o=o.offsetParent;return n}},$=function(e){return document.getElementById(e)},gameTime=30,initScore=0,playCout=3,addTime=2,body=document.getElementsByTagName("body")[0],cacheResult,cacheSetinterval;common.exam=["&#xf003e;","&#x344f;","&#x3451;","&#x3452;","&#x3455;","&#x3456;","&#x345f;","&#x345a;","&#x3459;","&#x3457;","&#x345d;","&#x345c;","&#x346c;","&#x346d;"],common.countBack=function(){return-1!==gameTime?(10>=gameTime?$("countBack").setAttribute("class","count-back count-alert"):$("countBack").setAttribute("class","count-back"),gameTime--,$("countBack").innerHTML=gameTime,gameTime):void 0},common.playCountNum=function(){return 1===playCout?(playCout="GO!",$("play-cn").innerHTML=playCout,clearInterval(cacheSetinterval),setTimeout(function(){common.createGame(),$("game-detial").parentNode.removeChild($("game-detial"))},500),void 0):(playCout--,$("play-cn").innerHTML=playCout,void 0)},common.cacheIcon=function(){var e=document.createElement("div");e.setAttribute("style","display:none;"),e.innerHTML='<img src="/30s/memory/style/icon/icon.woff"><img src="/30s/memory/style/icon/icon.eot"><img src="/30s/memory/style/icon/icon.ttf"><img src="/30s/memory/style/icon/icon.svg">',$("game-detial").appendChild(e)},common.createGame=function(){var e=document.createElement("div");e.className="game-content",e.id="game-content",e.innerHTML='<div class="wrapCont" id="wrapCont"><ul class="micon-list micon-advance" id="micon-list"><li class="micon item">&#xf003e;</li><li class="micon item">&#x344f;</li><li class="micon item">&#x3451;</li><li class="micon item">&#x3452;</li><li class="micon item">&#x3455;</li><li class="micon item">&#x3456;</li><li class="micon item">&#x345f;</li><li class="micon item">&#x345a;</li><li class="micon item">&#xf003e;</li><li class="micon item">&#x344f;</li></ul></div><div class="q-link"><span class="q-inner">消失的图案是？</span></div><div class="keyboard" id="keyboard"><p class="kb-top"><span class="square" id="result-0">&#xf003e;</span></p><p class="kb-middle"><span class="square" id="result-1">&#x3451;</span><span class="square" id="result-next">忘了</span><span class="square" id="result-2">&#xf003e;</span></p><p class="kb-bottom"><span class="square" id="result-3">&#x3456;</span></p></div><span class="count-back" id="countBack">30</span>',$("mainboard").appendChild(e),common.starGame()},common.starGame=function(){cacheSetinterval=setInterval(function(){return common.countBack(),0===gameTime?common.creatOverMask():void 0},1e3),common.setTopic();for(var e=$("keyboard").getElementsByTagName("span").length,n=0;e>n;n++)$("keyboard").getElementsByTagName("span")[n].onclick=function(){"忘了"===this.innerHTML?common.setTopic():this.innerHTML===cacheResult?common.showRight():common.showWrong()}},common.refreshGame=function(){$("refresh-game").onclick=function(){$("over-mask").parentNode.removeChild($("over-mask")),$("game-content").parentNode.removeChild($("game-content")),gameTime=30,initScore=0,common.createGame()}},common.creatOverMask=function(){clearInterval(cacheSetinterval);var e=this.level(initScore),n=document.createElement("div");n.className="over-mask",n.id="over-mask",n.innerHTML='<div class="mask-inner"><p class="title"><i class="iconfont icon-timeout">&#xe660;</i>时间到啦 :(</p><p class="score">您的得分是：<span class="red" id="final-score">'+initScore+'</span> 等级是：<span class="red" id="final-level">'+e+"</span></p>"+'<p class="desc"><a href="javascript:;" class="refresh" id="refresh-game"><i class="iconfont icon-refresh">&#xf0005;</i>再来一次</a></p>'+"</div>"+"</div>",body.appendChild(n),document.getElementsByTagName("title")[0].innerHTML="最强右脑—最终得分"+initScore+";级别是:"+e,common.refreshGame()},common.level=function(){return initScore>=70?"天才！你妈妈知道吗？":initScore>=50&&70>initScore?"大学生":initScore>=30&&40>initScore?"高中生":initScore>=20&&30>initScore?"中学生":initScore>=10&&20>initScore?"小学生":10>initScore?"脑瘫":void 0},common.showRight=function(){var e=document.createElement("div");e.setAttribute("class","iconfont full-alert alert-right"),e.innerHTML="&#xf006a;",e.id="full-alert",body.appendChild(e),common.setTopic(),common.remove("full-alert",600),initScore++,gameTime=Number(Number(gameTime)+addTime),$("countBack").innerHTML=gameTime,common.addTimeAnimate()},common.showWrong=function(){var e=document.createElement("div");e.setAttribute("class","iconfont full-alert alert-wrong"),e.innerHTML="&#xf00b3;",e.id="full-alert",body.appendChild(e),common.setTopic(),common.remove("full-alert",600)},common.remove=function(e,n){setTimeout(function(){$(e).parentNode.removeChild($(e))},n)},common.setTopic=function(){var e=common.exam.length;Math.floor(Math.random()*e);var n=Math.floor(4*Math.random()),o=Math.floor(Math.random()*e),a=Math.floor(Math.random()*e),t=Math.floor(Math.random()*e),i=Math.floor(Math.random()*e);$("result-0").innerHTML=common.exam[o],$("result-1").innerHTML=common.exam[a],$("result-2").innerHTML=common.exam[t],$("result-3").innerHTML=common.exam[i];for(var c="",m=[],s="",r=0;e>r;r++)c='<li class="micon item">'+common.exam[r]+"</li>",m.push(c);var l,d=[],u="junior";4>initScore?(l=6,u="junior"):initScore>=4&&10>initScore?(l=8,u="middle"):initScore>=10&&16>initScore?(l=10,u="advance"):initScore>=16&&(l=12,u="superman");for(var p=0;l>p;p++)d.push(p);for(var f=0;l>f;f++){var h=Math.floor(Math.random()*l);s+=m[h]}$("micon-list").className="micon-list micon-"+u,$("micon-list").innerHTML=s;var v=Math.floor(Math.random()*l),g=$("micon-list").getElementsByTagName("li")[v].innerHTML;return $("micon-list").getElementsByTagName("li")[v].className="micon item result-hide",$("result-"+n).innerHTML=g,$("result-"+n).className="square result-answer",cacheResult=g},common.addTimeAnimate=function(){var e=common.getOffsetLeft($("countBack")),n=common.getOffsetTop($("countBack")),o=$("countBack").clientWidth,a=$("countBack").clientHeight,t=document.createElement("em");t.className="add-time-out",t.id="add-time-out",t.innerHTML="+"+addTime,t.setAttribute("style","width:"+o+"px;height:"+a+"px;line-height:"+a+"px;left:"+e+"px;top:"+n+"px;"),body.appendChild(t),common.remove("add-time-out",1e3)},$("go-play").onclick=function(){var e=document.createElement("div");e.className="play-cout-back",e.innerHTML='<span class="play-cn" id="play-cn">3</span>',$("game-detial").appendChild(e),common.cacheIcon(),cacheSetinterval=setInterval(function(){common.playCountNum()},1e3)},console.log($("go-play"));