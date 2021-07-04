var sys = sys || {};
/**
 * 发送ajax请求
 * data 参数，需要序列化
 * successCallback  成功的返回函数
 * errorCallback    错误的返回函数
 */
sys.requestJson = function(opt){
     $.ajax({
	        cache: opt.cache || true,
	        type: opt.type || 'POST',
	        url: opt.url,
	        contentType: opt.contentType  || "application/json;charset=utf-8", //必须有
	        data: JSON.stringify(opt.param) || {},
	        dataType: opt.dataType || 'json',
	        async: opt.async || false,
	        error: opt.error || fn,
	        success: opt.success || fn
	    });
}

sys.requestForm = function(opt){
    $.ajax({
	        cache: opt.cache || true,
	        type: opt.type || 'POST',
	        url: opt.url,
	        data: opt.param || {},
	        dataType: opt.dataType || 'json',
	        async: opt.async || false,
	        error: opt.error || fn,
	        success: opt.success || fn
	    });
}
function fn(){}

$.fn.serializeObject=function(){  
    var hasOwnProperty=Object.prototype.hasOwnProperty;  
    return this.serializeArray().reduce(function(data,pair){  
        if(!hasOwnProperty.call(data,pair.name)){  
            data[pair.name]=pair.value;  
        }  
        return data;  
    },{});  
};  
