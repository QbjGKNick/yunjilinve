var temp=window.location.href.split('player.html')[0];//(换回去记得修改为player.html)
var btnPointY=0;
var pointY;
var phoneClientFlag = false; //标识是否在手机端打开（Safari浏览器除外要特别考虑）
var standardHeight;
var enterFullScreenFlag = false;
var urlPrePart = '../../../';//这里需要修改
var videoHeight=0;//直播视频非全屏高度

var playWhitePic=temp +'images/start.png';
var playPic=temp +'images/start_touch.png';
var stopWhitePic= temp +'images/stop.png';
var stopPic=temp +'images/stop_down.png';
var volumeWhitePic = 'rgba(0, 0, 0, 0) url("'+ temp +'images/voice.png") no-repeat scroll 0% 0% / auto padding-box border-box';
var volumePic = 'rgba(0, 0, 0, 0) url("'+ temp +'images/voice_touch.png") no-repeat scroll 0% 0% / auto padding-box border-box';
var volumeZeroWhitePic = 'rgba(0, 0, 0, 0) url("'+ temp +'images/novoice.png") no-repeat scroll 0% 0% / auto padding-box border-box';
var volumeZeroPic = 'rgba(0, 0, 0, 0) url("'+ temp +'images/novoice_touch.png") no-repeat scroll 0% 0% / auto padding-box border-box';
var shuaxinWhitePic = temp +'images/shuaxin.png';
var shuaxinPic = temp +'images/shuaxin_touch.png';
var smallWhitePic = 'rgba(0, 0, 0, 0) url("'+ temp +'images/small.png") no-repeat scroll 0% 0% / auto padding-box border-box';
var smallPic = 'rgba(0, 0, 0, 0) url("'+ temp +'images/small_touch.png") no-repeat scroll 0% 0% / auto padding-box border-box';

Sys = {}
Sys.detachFlash = (function(){
    if(window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && window.navigator.userAgent.toLowerCase().indexOf('android') == -1){
        return true;
    }
    if (navigator.mimeTypes.length > 0) {
        //application/x-shockwave-flash是flash插件的名字
        var flashAct = navigator.mimeTypes["application/x-shockwave-flash"];
        return flashAct != null ? flashAct.enabledPlugin != null : false;
    } else if (self.ActiveXObject) {
        try {
            new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            return true;
        } catch (oError) {
            return false;
        }
    }
}());

$(function() {
    if (!Player) {
        return false;
    }
    $(".loginPlan").css("height",$(window).height());
    videoHeight = document.body.offsetHeight - 140 -20;
    window.p=null;
    $('#hufei').css('display','none');
    $($('.player-content img')[0]).css('display','none').css('position','absolute').css('top','50%').css('left','50%').css('margin-top','-57.5px').css('margin-left','-57px');
    //从页面地址获取stream值
    var stream = getQueryString('stream');
    if(!!stream){
        //var url = 'http://localhost/lives/api/v1/live/address?stream='+stream;
        var url = 'api/v1/live/address?stream='+stream;
        getLiveStreamUrl(url);
    }else{
        $(".btn-play").css('background',playPic);
        $('.tips').empty().css('height','20px').html('直播尚未开始').css('width','').css('background-color','').css('color','#D0021B');
        //$('#unstartLive').html('直播未开始，请稍侯。');
        $($('.player-content img')[0]).css('display','block');
        $('.player-content').css('background-color','#333');
        $('#player').css('visibility','hidden');
    }
});

function getLiveStreamUrl(url) {
    $('#unstartLive').css('display','none');
    var lowStream  = null;
    var highStream = null;
    var lowStream  = null;
    var highStream = null;
    var lowPCStream = null;
    var highPCStream = null;
    var lowPhoneStream = null;
    var highPhoneStream = null;
    $.ajax({
        url: url,
        type: 'GET',
        complete: function(XMLHttpRequest, textStatus){
            var result = XMLHttpRequest.responseJSON;
            if(result.success){ 
                var data =result.data;
                $('.headerTitle').empty();
                $('.headerTitle').html(data.name);

                if(data.replay){
                    if(1 == data.qualitys){
                        lowStream = 'http://pili-vod.onecc.net/qn/replay/' + data.stream + '.m3u8';
                    }else if(2 == data.qualitys){
                        highStream = 'http://pili-vod.onecc.net/qn/replay/hd_' + data.stream + '.m3u8'; 
                    }else if(3 == data.qualitys){
                        lowStream = 'http://pili-vod.onecc.net/qn/replay/' + data.stream + '.m3u8';
                        highStream = 'http://pili-vod.onecc.net/qn/replay/hd_' + data.stream + '.m3u8'; 
                    }
                    loadLiveVideo(lowStream,highStream,lowPCStream,highPCStream,lowPhoneStream,highPhoneStream,true);
                }else{
                    if(1 == data.qualitys){
                        lowPCStream = 'rtmp://liveplay-rtmp.onecc.net/liveplay/' + data.stream;
                        lowPhoneStream = 'http://liveplay-hls.onecc.net/liveplay/' + data.stream + '.m3u8';
                    }else if(2 == data.qualitys){
                        highPCStream = 'rtmp://liveplay-rtmp.onecc.net/liveplay/hd_' + data.stream;
                        highPhoneStream = 'http://liveplay-hls.onecc.net/liveplay/hd_' + data.stream + '.m3u8';
                    }else if(3 == data.qualitys){
                        lowPCStream = 'rtmp://liveplay-rtmp.onecc.net/liveplay/' + data.stream;
                        lowPhoneStream = 'http://liveplay-hls.onecc.net/liveplay/' + data.stream + '.m3u8';
                        highPCStream = 'rtmp://liveplay-rtmp.onecc.net/liveplay/hd_' + data.stream;
                        highPhoneStream = 'http://liveplay-hls.onecc.net/liveplay/hd_' + data.stream + '.m3u8';
                    }
                    loadLiveVideo(lowStream,highStream,lowPCStream,highPCStream,lowPhoneStream,highPhoneStream,false);
                }
            }else{
                $(".btn-play").css('background',playPic);
                $('.tips').empty().html(result.msg).css('height','20px').css('width','').css('background-color','').css('color','#D0021B');
                //$('#unstartLive').html('直播未开始，请稍侯。');
                $($('.player-content img')[0]).css('display','block');
                $('.player-content').css('background-color','#333');
                $('#player').css('visibility','hidden');
            }
        }
    });

}

function judgePCorPhone(){
    var browser = {
        versions: function() {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {     //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        } (),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
        return false;
    }
    else {
        //否则就是PC浏览器打开
        return true;
    }
}

function loadLiveVideo(lowStream,highStream,lowPCStream,highPCStream,lowPhoneStream,highPhoneStream,replayFlag){
    if(replayFlag){
        $('.tips').empty().css('height','20px').html('直播已结束，欢迎观看录播').css('width','').css('background-color','').css('color','#666666');
        var stream = null;
        if(!!lowStream){
            stream = lowStream;
        }else if(!!highStream){
            stream = highStream;
        }
        
        $('.player-content').hide();
        $('.player-content').css('display','none');
        var player1 = videojs('video_player');
        player1.src([{type: "application/x-mpegURL", src: stream}]);
        //player1.play();
        $('#video_player').show();
        $('#video_player').css("min-height",$(window).height()-230);
        $($('.player-content img')[0]).css('display','none');
        return;
    }else{
        if (!Player) {
            return false;
        }
        var pcStream = null;
        var phoneStream = null;
        if(lowPCStream == null && !!highPCStream){
            pcStream = highPCStream;
            $('.streamLevel>span').text('高清');
            $('.ld-legibility').css('display','none');
            $('.hd-legibility').css('display','inline-block');
        }
        if(!!lowPCStream && highPCStream == null){
            pcStream = lowPCStream;
            $('.streamLevel>span').text('标清');
            $('.hd-legibility').css('display','none');
            $('.ld-legibility').css('display','inline-block');
        }
        if(!!lowPCStream && !!highPCStream){
            $('.streamLevel>span').text('标清');
            $('.ld-legibility').css('display','inline-block');
            $('.hd-legibility').css('display','inline-block');
            pcStream = lowPCStream;
        }
        if(lowPhoneStream == null && !!highPhoneStream){
            phoneStream = highPhoneStream;
        }
        if(!!lowPhoneStream && highPhoneStream == null){
            phoneStream = lowPhoneStream;
        }
        if(!!lowPhoneStream && !!highPhoneStream){
            phoneStream = lowPhoneStream;
        }
        if (!Sys.detachFlash) {
            $('.player-content').hide();
            $('.player-content').css('display','block');
            $('#player').css('display','none');
            $('#video_player').show();
            $('#video_player').attr('src', phoneStream);
            if(judgePCorPhone()){
                $(".loginPlan").css('width','69%');
            }else{
                $('.loginPlan').css('width','100%');
            }
            phoneClientFlag = true;
            return;
        }
        if(!!data){
            p = new Player('player',{
                swfPath: 'js/player.swf',
                rtmp: pcStream,
                hls: phoneStream
            })
            $('.player-content').css('width','100%').css('height','100%');
            $('#player').css('Width','100%');
            p.on('init', function() {
                var playerHeight = $('#player').get(0).clientWidth*0.565;
                
                $('#player').css('height',playerHeight);
                $('.player-content').css('height',playerHeight);
                $('.player-content').hover( function(event){
                    $('.liveControl').css('display','block');
                }, function(event){
                    $('.liveControl').css('display','none');
                    $('.volumeProgressBar').css('display','none');
                    $('.streamLevelAll').css('display','none');
                });
            })
            p.play();
            p.on('play', function (args) {
                console.log(args)
            })

            p.on('NetConnection.Connect.Failed',function (){
                console.info('NetConnection.Connect.Failed');
            })

            p.on('NetConnection.Connect.Success', function () {
                $('#unstartLive').css('display','none');
                $('#play').css('margin-top','5px').css('background-color','');
                $('.player-content').hover( function(event){
                    $('.liveControl').css('display','block');
                }, function(event){
                    $('.liveControl').css('display','none');
                    $('.volumeProgressBar').css('display','none');
                    $('.streamLevelAll').css('display','none');
                });
                console.info('NetConnection.Connect.Success');
            })

            p.on('NetConnection.Connect.Closed', function () {
                $($('.player-content img')[0]).css('display','block');
                $('.player-content').css('background-color','#333');
                $('#play').css('margin-top','0px');
                $('#player').css('background','none');
                $('#unstartLive').empty();
                $('.liveControl').css('display','block');
                $('.btn-shuaxin').css('display','block');
                $('.btn-play img').attr('src',playWhitePic);
                $('.btn-play img').css('padding','0');
                console.info('NetConnection.Connect.Closed');
                $('.player-content').unbind('mouseenter').unbind('mouseleave');
            })

            p.on('NetStream.Play.UnpublishNotify', function () {
                console.info('NetStream.Play.UnpublishNotify');
            })

            p.on('NetStream.Play.PublishNotify', function () {
                console.info('NetStream.Play.PublishNotify');
            })

            p.on('NetStream.Video.DimensionChange', function () {
                console.info('NetStream.Video.DimensionChange');
            })

            p.on('NetStream.Buffer.Full', function () {
                console.info('NetStream.Buffer.Full');
            })

            $(".btn-play img").hover( function(event){
                if($(".btn-play img").prop('src') == playPic){
                    $('.pause').attr('title','点击播放');
                    $('.btn-play img').attr('src',playWhitePic);
                    $('.btn-play img').css('padding','0');
                }else if($(".btn-play img").prop('src') == playWhitePic){
                    $('.pause').attr('title','点击播放');
                    $('.btn-play img').attr('src',playPic);
                    $('.btn-play img').css('padding','0');
                }else if($(".btn-play img").prop('src') == stopWhitePic){
                    $('.pause').attr('title','点击暂停');
                    $('.btn-play img').attr('src',stopPic);
                    $('.btn-play img').css('padding','7.5px');
                }else if($(".btn-play img").prop('src') == stopPic){
                    $('.pause').attr('title','点击暂停');
                    $('.btn-play img').attr('src',stopWhitPic);
                    $('.btn-play img').css('padding','7.5px');
                }
            }, function(event){
                if($(".btn-play img").prop('src') == playWhitePic){
                    $('.btn-play img').attr('src',playPic);
                    $('.btn-play img').css('padding','0');
                }else if($(".btn-play img").prop('src') == playPic){
                    $('.btn-play img').attr('src',playWhitePic);
                    $('.btn-play img').css('padding','0');
                }else if($(".btn-play img").prop('src') == stopWhitePic){
                    $('.btn-play img').attr('src',stopPic);
                    $('.btn-play img').css('padding','7.5px');
                }else if($(".btn-play img").prop('src') == stopPic){
                    $('.btn-play img').attr('src',stopWhitePic);
                    $('.btn-play img').css('padding','7.5px');
                }
            } );

            $('.btn-play img').on('click',function(event){
                if($(".btn-play img").prop('src') == stopWhitePic || $(".btn-play img").prop('src') == stopPic){
                    //p.stop();
                    $(".btn-play img").attr('src',playPic);
                    $('.btn-play img').css('padding','0px');
                    $($('.player-content img')[0]).css('display','block');
                    $('.player-content').css('background-color','#333');
                    //$('.player-content').css('background-image','url("images/logo.jpg")').css('background-repeat','no-repeat').css('background-size','100%').css('background-color','#FFFFFF').css('background-position','center');
                    $('#player').css('visibility','hidden');
                }else if($(".btn-play img").prop('src') == playWhitePic || $(".btn-play img").prop('src') == playPic){
                    $('#player').css('visibility','visible');
                    $($('.player-content img')[0]).css('display','none');
                    p.play();
                    $(".btn-play img").attr('src',stopPic);
                    $('.btn-play img').css('padding','7.5px');
                }
            });

            $('.btn-shuaxin').hover(function(e){
                if($(".btn-shuaxin img").prop('src') == shuaxinWhitePic){
                    $('.pause').attr('title','点击回看');
                    $('.btn-shuaxin img').attr('src',shuaxinPic);
                }else if($(".btn-shuaxin img").prop('src') == shuaxinPic){
                    $('.pause').attr('title','点击回看');
                    $('.btn-shuaxin img').attr('src',shuaxinWhitePic);
                }
            },function(e){
                if($(".btn-shuaxin img").prop('src') == shuaxinWhitePic){
                    $('.btn-shuaxin img').attr('src',shuaxinPic);
                }else if($(".btn-shuaxin img").prop('src') == shuaxinPic){
                    $('.btn-shuaxin img').attr('src',shuaxinWhitePic);
                }
            })

            $('.btn-shuaxin').on('click',function(e){
                var stream = getQueryString('stream');
                if(!!stream){
                    //var url = 'http://localhost/lives/api/v1/live/address?stream='+stream;
                    var url = 'api/v1/live/address?stream=' + stream;
                    getLiveStreamUrl(url);
                }else{
                    $(".btn-play").css('background',playPic);
                    $($('.player-content img')[0]).css('display','block');
                    $('.player-content').css('background-color','#333');
                    $('#player').css('visibility','hidden');
                }
            })

            $('.fullScreen').hover( function(event){
                if(!p.isFullScreen){
                    $('.fullScreen').attr('title','全屏');
                    $('.exitFullScreen').css('background','url("images/all_touch.png") no-repeat');
                }else{
                    $('.fullScreen').attr('title','退出全屏');
                    $('.exitFullScreen').css('background','url("images/small_touch.png") no-repeat');
                }
            }, function(event){
                if(!p.isFullScreen){
                    $('.fullScreen').attr('title','全屏');
                    $('.exitFullScreen').css('background','url("images/all.png") no-repeat');
                }else{
                    $('.fullScreen').attr('title','退出全屏');
                    $('.exitFullScreen').css('background','url("images/small.png") no-repeat');
                }
            });

            $('.fullScreen').on('click',function(event){
                enterFullScreenFlag = true;
                //console.log('进入全屏');
                $('.player-content').css('height','100%');
                $('.player-content object').css('height','100%');
                if(p.isFullScreen){
                    //console.log('退出全屏')
                    enterFullScreenFlag = false;
                }
                p.fullScreen();
                if(!enterFullScreenFlag){
                    var height = parseFloat($('.player-content object').css('width').split('px')[0])*0.565;
                    if(height>videoHeight){
                        height = videoHeight;
                    }
                    $('.player-content').css('height',height);
                    $('.player-content object').css('height',height);
                }
            });

            document.onfullscreenchange = function ( event ) {
                //console.log("FULL SCREEN CHANGE")
                if(enterFullScreenFlag){
                    $('.player-content').css('width','100%');
                    $('.player-content object').css('width','100%');
                }
                var state = document.isFullScreen;
                if(state){
                    $('.player-content').css('width','100%');
                    $('.player-content object').css('width','100%');
                }else{
                    var height = $('#player').outerWidth()*0.565;
                    //var height = $('.player-content object').clientWidth*0.565;
                    if(height>videoHeight){
                        height = videoHeight;
                    }
                    $('.player-content').css('height',height);
                    $('.player-content object').css('height',height);
                }
            };

            document.onwebkitfullscreenchange = function ( event ) {
                //console.log("onwebkitfullscreenchange SCREEN CHANGE")
                if(enterFullScreenFlag){
                    $('.player-content').css('width','100%');
                    $('.player-content object').css('width','100%');
                }
                var state = document.webkitIsFullScreen;
                if(state){
                    $('.player-content').css('width','100%');
                    $('.player-content object').css('width','100%');
                }else{
                    var height = $('#player').outerWidth()*0.565;
                    //var height = $('.player-content object').clientWidth*0.565;
                    if(height>videoHeight){
                        height = videoHeight;
                    }
                    $('.player-content').css('height',height);
                    $('.player-content object').css('height',height);
                }
            };

            document.onmozfullscreenchange = function ( event ) {
                //console.log("onmozfullscreenchange SCREEN CHANGE")
                if(enterFullScreenFlag){
                    $('.player-content').css('width','100%');
                    $('.player-content object').css('width','100%');
                }
                var state = document.webkitIsFullScreen;
                if(state){
                    $('.player-content').css('width','100%');
                    $('.player-content object').css('width','100%');
                }else{
                    var height = $('.player-content object').clientWidth * 0.565;
                    if(height>videoHeight){
                        height = videoHeight;
                    }
                    $('.player-content').css('height',height);
                    $('.player-content object').css('height',height);
                }
            };

            document.MSFullscreenChange = function ( event ) {
                //console.log("MSFullscreenChange SCREEN CHANGE")
                if(enterFullScreenFlag){
                    $('.player-content').css('height','100%');
                    $('.player-content object').css('height','100%');
                }
                var state = document.webkitIsFullScreen;
                if(state){
                    $('.player-content').css('height','100%');
                    $('.player-content object').css('height','100%');
                }else{
                    var height = $('.player-content object').clientWidth * 0.565;
                    if(height>videoHeight){
                        height = videoHeight;
                    }
                    $('.player-content').css('height',height);
                    $('.player-content object').css('height',height);
                    /*var width = parseFloat($('.player-content object').css('height').split('px')[0])/0.565;
                    $('.player-content').css('width',width);
                    $('.player-content object').css('width',width);*/
                }
            };

            $('.volume').hover(function(event){
                if($('.volumeControl').css('background') == volumeWhitePic){
                    $('.volumeControl').css('background',volumePic);
                }else if($('.volumeControl').css('background') == volumePic){
                    $('.volumeControl').css('background',volumeWhitePic);
                }else if($('.volumeControl').css('background') == volumeZeroWhitePic){
                    $('.volumeControl').css('background',volumeZeroPic);
                }else if($('.volumeControl').css('background') == volumeZeroPic){
                    $('.volumeControl').css('background',volumeZeroWhitePic);
                }
            });

            $('.volume').on('click',function(event){
                if('block' == $('.volumeProgressBar').css('display')){
                    $('.volumeProgressBar').css('display','none')
                }else{
                    $('.volumeProgressBar').css('display','block');
                }
            });

            $('.volume-content-btns')[0].addEventListener('mousedown', function(e) {
                window.mousedownY = e.pageY;
                window.mousedownTop = $('.volume-content-btns').css('top').replace('px', '');
                window.ifmousedown = true;
            });

            $(document)[0].addEventListener('mouseup', function(e) {
                window.ifmousedown = false;
            });
            //控制音量
            document.addEventListener('mousemove', function(e){
                if(window.ifmousedown){
                    var dValue = e.pageY - window.mousedownY;
                    var value = dValue + parseInt(window.mousedownTop);
                    $('.volumeControl').css('background',volumePic);
                    if(value>=75){
                        $('.volume-content-btns').css('top', '80px');
                        $('.volume-content-playIcon').css('height','0%');
                        $('.volumeControl').css('background',volumeZeroPic);
                        p.setVolume(0);
                    }else if(value<=0){
                        $('.volume-content-btns').css('top', '0px');
                        $('.volume-content-playIcon').css('height','100%');
                        p.setVolume(1000);
                    }else{
                        $('.volume-content-btns').css('top', value + 'px');
                        var percent = (75-value)/75;
                        $('.volume-content-playIcon').css('height',percent*100+'%');
                        p.setVolume(1000*percent);
                    }
                }
            });

            $('.streamLevel').hover(function(event){
                $('.streamLevel').css('color','#4A90E2').css('text-decoration','none');
            },function(){
                $('.streamLevel').css('color','#ffffff');
            });

            $('.streamLevel').on('click',function(event){
                if('block' == $('.streamLevelAll').css('display')){
                    $('.streamLevelAll').css('display','none');
                }else if('none' == $('.streamLevelAll').css('display')){
                    $('.streamLevelAll').css('display','block');
                    if('标清' == $('.streamLevel span').text()){
                        $('.ld-legibility').css('color','#4A90E2');
                    }else if('高清' == $('.streamLevel span').text()){
                        $('.hd-legibility').css('color','#4A90E2');
                    }
                }
            });

            $('.streamLevelAll').hover(function(event){
                $('.streamLevel').css('color','#4A90E2').css('text-decoration','none');
            },function(){
                $('.streamLevelAll').css('display','none');
                $('.streamLevel').css('color','#ffffff');
                $('.ld-legibility').css('color','#ffffff');
                $('.hd-legibility').css('color','#ffffff');
            });

            $('.hd-legibility').hover(function(event){
                $('.hd-legibility').css('color','#4A90E2').css('text-decoration','none');
            },function(){
                $('.hd-legibility').css('color','#ffffff').css('text-decoration','none');
                if('高清' == $('.streamLevel span').text()){
                    $('.hd-legibility').css('color','#4A90E2');
                }
            });

            $('.hd-legibility').on('click',function(event){
                var fullFlag = p.isFullScreen;
                if('标清' == $('.streamLevel span').text()){
                    p = new Player('player',{
                        swfPath:'js/player.swf',
                        rtmp: highPCStream,
                        hls: highPhoneStream
                    })
                    p.isFullScreen = fullFlag;
                    //判断暂停按钮这里背景图片是暂停还是播放
                    if($('.btn-play').css('background-image').indexOf('playWhite.png')>0){
                        p.stop();
                        $('#player').css('visibility','hidden');
                    }else{
                        p.play();
                    }
                }
                $('.streamLevelAll').css('display','none');
                $('.ld-legibility').css('color','#ffffff');
                $('.hd-legibility').css('color','#ffffff');
                $('.streamLevel span').text('高清');
                $('.streamLevel').css('color','#ffffff');
            });

            $('.ld-legibility').hover(function(event){
                $('.ld-legibility').css('color','#4A90E2').css('text-decoration','none');
            },function(){
                $('.ld-legibility').css('color','#ffffff').css('text-decoration','none');
                if('标清' == $('.streamLevel span').text()){
                    $('.ld-legibility').css('color','#4A90E2');
                }
            });

            $('.ld-legibility').on('click',function(event){
                var fullFlag = p.isFullScreen;
                if('高清' == $('.streamLevel span').text()){
                    p = new Player('player',{
                        swfPath:'js/player.swf',
                        rtmp: lowPCStream,
                        hls: lowPhoneStream
                    })
                    p.isFullScreen = fullFlag;
                    //判断暂停按钮这里背景图片是暂停还是播放
                    if($('.btn-play').css('background-image').indexOf('playWhite.png')>0){
                        p.stop();
                        $('#player').css('visibility','hidden');
                    }else{
                        p.play();
                    }
                }
                $('.streamLevelAll').css('display','none');
                $('.ld-legibility').css('color','#ffffff');
                $('.hd-legibility').css('color','#ffffff');
                $('.streamLevel span').text('标清');
                $('.streamLevel').css('color','#ffffff');
            });

        }else{
            art.dialog.tips('直播未开始！');
        }
    }
}

$(window).resize(function() {
    var width = $(this).width();
    window.width = width;
    $('.info').css('left',$(window).width()*(1-0.69)/2+'px');
    if(!!$('.player-content object').css('width')){
        var height = parseFloat($('.player-content object').css('width').split('px')[0])*0.565;
        $('.player-content').css('height',height);
        $('.player-content object').css('height',height);
    }
});

function showVolume(){
    $('.volumeProgressBar').css('display','block');
}

function hideVolume(){
    $('.volumeProgressBar').css('display','none');
    window.ifmousedown = false;
    if($('.volume-content-btns').css('top') == '75px'){
        $('.volumeControl').css('background',volumeZeroWhitePic);
    }else{
        $('.volumeControl').css('background',volumeWhitePic);
    }
}

/**
 * 获取URL中参数值
 * @param name URL中的参数名
 * @returns {*}
 * @constructor
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var l = decodeURI(window.location.search);
    var r = l.substr(1).match(reg);
    if (r != null) return unescape(r[2]);return null;
}
