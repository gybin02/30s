var cacheNum,cacheSetinterval;common.color=[["000000","黑"],["FFFF00","黄"],["CFCFCF","灰"],["A0522D","啡"],["610808","朱"],["0000EE","蓝"],["4B0082","紫"],["0a8b00","绿"],["26f2a3","青"],["ff8a00","橙"],["fc9d9d","粉"],["471818","棕"],["000000","黑"],["FFFF00","黄"],["CFCFCF","灰"],["A0522D","啡"],["610808","朱"],["0000EE","蓝"],["4B0082","紫"],["0a8b00","绿"],["26f2a3","青"],["ff8a00","橙"],["fc9d9d","粉"],["471818","棕"],["000000","黑"],["FFFF00","黄"],["CFCFCF","灰"],["A0522D","啡"],["610808","朱"],["0000EE","蓝"],["4B0082","紫"],["0a8b00","绿"],["26f2a3","青"],["ff8a00","橙"],["fc9d9d","粉"],["471818","棕"]],common.playCountNum=function(){return 1===playCout?(playCout="GO!",$("play-cn").innerHTML=playCout,clearInterval(cacheSetinterval),setTimeout(function(){common.createGame(),$("game-detial").parentNode.removeChild($("game-detial")),common.setStartime()},500),void 0):(playCout--,$("play-cn").innerHTML=playCout,void 0)},common.cacheIcon=function(){for(var e="",n=["images/icon-over-1.png","images/icon-over-2.png","images/mask/mask-00.png","images/mask/mask-01.png","images/mask/mask-02.png","images/mask/mask-03.png","images/mask/mask-04.png","images/mask/mask-05.png","images/mask/mask-06.png","images/mask/mask-07.png","images/mask/mask-08.png"],o=0;o<n.length;o++)e+='<img src="'+n[o]+'" />';var a=document.createElement("div");a.setAttribute("style","display:none;"),a.innerHTML=e,body.appendChild(a)},common.createGame=function(){var e=document.createElement("div");e.className="game-content",e.id="game-content",e.innerHTML='<div class="wrapCont" id="wrapCont"><div class="color-wrap" id="color-wrap"><div class="color-mask" id="color-mask"></div></div></div><div class="q-link"><span class="q-inner">这个字的颜色是？</span></div><div class="keyboard" id="keyboard"><p class="kb-top"><span class="square" id="result-0">?</span></p><p class="kb-middle"><span class="square" id="result-1">?</span><span class="square" id="result-next">不会</span><span class="square" id="result-2">?</span></p><p class="kb-bottom"><span class="square" id="result-3">?</span></p></div><span class="count-back" id="countBack">30</span>',$("mainboard").appendChild(e),common.starGame()},common.starGame=function(){cacheSetinterval=setInterval(function(){return common.countBack(),0===gameTime?common.creatOverMask():void 0},1e3),common.setTopic();for(var e=$("keyboard").getElementsByTagName("span").length,n=0;e>n;n++)$("keyboard").getElementsByTagName("span")[n].onclick=function(){"不会"===this.innerHTML?common.setTopic():this.innerHTML===common.color[cacheNum][1]?common.showRight():common.showWrong()}},common.refreshGame=function(){$("refresh-game").onclick=function(){$("over-mask").parentNode.removeChild($("over-mask")),$("game-content").parentNode.removeChild($("game-content")),gameTime=30,initScore=0,common.createGame()}},common.creatOverMask=function(){var e=Math.floor(2*Math.random());clearInterval(cacheSetinterval);var n=this.quote(initScore),o=document.createElement("div");o.className="over-mask",o.id="over-mask",o.innerHTML='<div class="mask-wrap"><div class="mask-inner"><div class="icon-over over-'+e+'"></div>'+'<p class="title"><i class="iconfont icon-timeout">&#xe660;</i>时间到啦 :(</p>'+'<p class="score">最终得分是：<span class="red" id="final-score">'+initScore+"</span></p>"+'<p class="quote">“'+n+"”</p>"+'<p class="desc"><a href="javascript:;" class="refresh" id="refresh-game"><i class="iconfont icon-refresh">&#xf0005;</i>再来一次</a></p>'+"</div>"+"</div></div>",body.appendChild(o),document.getElementsByTagName("title")[0].innerHTML="最强右脑—测试得分"+initScore+";“"+n+"”",common.setOverTime("color",initScore),common.refreshGame()},common.showRight=function(){var e=document.createElement("div");e.setAttribute("class","iconfont full-alert alert-right"),e.innerHTML="&#xf006a;",e.id="full-alert",body.appendChild(e),common.remove("full-alert",600),initScore++,gameTime=Number(Number(gameTime)+addTime),$("countBack").innerHTML=gameTime,common.addTimeAnimate(),setTimeout(function(){common.setTopic()},600)},common.showWrong=function(){var e=document.createElement("div");e.setAttribute("class","iconfont full-alert alert-wrong"),e.innerHTML="&#xf00b3;",e.id="full-alert",body.appendChild(e),common.remove("full-alert",600),setTimeout(function(){common.setTopic()},600)},common.setTopic=function(){var e=common.color.length,n=Math.floor(Math.random()*e),o=Math.floor(4*Math.random()),a=9*Math.random()>>0,t="images/mask/mask-0"+a+".png",c=common.color[n][0],m=common.color[n][1];common.color;for(var r=0;4>r;r++){var i=Math.floor(Math.random()*e);$("result-"+r).innerHTML=common.color[i][1]}return $("color-wrap").setAttribute("style","background-color:#"+c),$("color-mask").setAttribute("style","background-image:url("+t+")"),$("result-"+o).innerHTML=m,cacheNum=n},$("go-play").onclick=function(){var e=document.createElement("div");e.className="play-cout-back",e.innerHTML='<span class="play-cn" id="play-cn">3</span>',$("game-detial").appendChild(e),common.cacheIcon(),cacheSetinterval=setInterval(function(){common.playCountNum()},1e3)},common.checkShare();