/**
 * Created by renren on 16/5/20.
 */

//DOMContentLoaded事件MDN: https://developer.mozilla.org/zh-CN/docs/Web/Events/DOMContentLoaded
jQuery.ready.promise = function( obj ) {
    if ( !readyList ) {
        readyList = jQuery.Deferred();
        if ( document.readyState === "complete" ) {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            //如果检测到文档已经加载完毕才执行的ready方法,这里会给一个定时器的最小时间后去执行，主要保证执行的正确。
            setTimeout( jQuery.ready );
        } else {
            document.addEventListener( "DOMContentLoaded", completed, false );
            window.addEventListener( "load", completed, false );
        }
        // Ensure firing before onload, maybe late but safe also for iframes
        document.attachEvent( "onreadystatechange", completed );//
        /**
         * 不过，这个事件不太可靠，
         * 比如当页面中存在图片的时候，可能反而在 onload 事件之后才能触发，
         * 换言之，它只能正确地执行于页面不包含二进制资源或非常少或者被缓存时作为一个备选吧。
         */
// A fallback to window.onload, that will always work
        window.attachEvent( "onload", completed );
// If IE and not a frame
// continually check to see if the document is ready
        var top = false;
        try {
            top = window.frameElement == null && document.documentElement;
        } catch(e) {}
        if ( top && top.doScroll ) {
            (function doScrollCheck() {
                if ( !jQuery.isReady ) {
                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        // 对于 IE 在非 iframe 内时，只有不断地通过能否执行 doScroll 判断 DOM 是否加载完毕。
                        // 在上述中间隔 50 毫秒尝试去执行 doScroll，注意，由于页面没有加载完成的时候，调用 doScroll 会导致异常，所以使用了 try -catch 来捕获异常。
                        // 所以总的来说当页面 DOM 未加载完成时，调用 doScroll 方法时，会产生异常。那么我们反过来用，如果不异常，那么就是页面DOM加载完毕了。
                        top.doScroll("left");
                    } catch(e) {
                        return setTimeout( doScrollCheck, 50 );
                    }
                    // detach all dom ready events
                    detach();

                    // and execute any waiting functions
                    jQuery.ready();
                }
            })();
        }
    }
    return readyList.promise( obj );
};




/**
 * Clean-up method for dom ready events
 */
function detach() {
    if ( document.addEventListener ) {
        document.removeEventListener( "DOMContentLoaded", completed, false );
        window.removeEventListener( "load", completed, false );

    } else {
        document.detachEvent( "onreadystatechange", completed );
        window.detachEvent( "onload", completed );
    }
}
/**
 * The ready event handler and self cleanup method
 */
function completed() {
    // readyState === "complete" is good enough for us to call the dom ready in oldIE
    if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
        detach();
        jQuery.ready();
    }
}

jQuery.ready.promise = function( obj ) {
    if ( !readyList ) {

        readyList = jQuery.Deferred();

        // Catch cases where $(document).ready() is called after the browser event has already occurred.
        // we once tried to use readyState "interactive" here, but it caused issues like the one
        // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
        if ( document.readyState === "complete" ) {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            setTimeout( jQuery.ready );

            // Standards-based browsers support DOMContentLoaded
        } else if ( document.addEventListener ) {
            // Use the handy event callback
            document.addEventListener( "DOMContentLoaded", completed, false );

            // A fallback to window.onload, that will always work
            window.addEventListener( "load", completed, false );

            // If IE event model is used
        } else {
            // Ensure firing before onload, maybe late but safe also for iframes
            document.attachEvent( "onreadystatechange", completed );

            // A fallback to window.onload, that will always work
            window.attachEvent( "onload", completed );

            // If IE and not a frame
            // continually check to see if the document is ready
            var top = false;

            try {
                top = window.frameElement == null && document.documentElement;
            } catch(e) {}

            if ( top && top.doScroll ) {
                (function doScrollCheck() {
                    if ( !jQuery.isReady ) {

                        try {
                            // Use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            top.doScroll("left");
                        } catch(e) {
                            return setTimeout( doScrollCheck, 50 );
                        }

                        // detach all dom ready events
                        detach();

                        // and execute any waiting functions
                        jQuery.ready();
                    }
                })();
            }
        }
    }
    return readyList.promise( obj );
};

/**
 * Ⅰ. 调用rootjQuery的ready事件
 Ⅱ. 调用jQuery.ready.promose()，若readyList为空，将readyList赋值为一个Deferred对象；否则将回调函数添加到readyList成功回调列表中，然后跳转到第7步
 Ⅲ. 在jQuery.promise()中为DOM Ready事件添加监听器
 Ⅳ. 将回调函数fn添加到readyList的成功回调列表中
 Ⅴ. 当DOM Ready事件发生时，移除监听器，执行jQuery.ready()
 Ⅵ. 在jQuery.ready()中将isReady置为true
 Ⅶ. 执行readyList的成功回调列表中的方法
 */


jQuery.fn = jQuery.prototype = {
    init: function( selector, context, rootjQuery ) {
        if ( jQuery.isFunction( selector ) ) {
            // rootjQuery默认指向$(document)
            // 当调用$(callback); 时，会调用$(document).ready(callback);      Ⅰ
            return rootjQuery.ready( selector );
        }
    },

    ready: function( fn ) {
        // Add the callback
        // 调用jQuery.ready.promise方法，返回一个Deferred对象 readyList，
        // 然后将fn加入到readyList的成功的回调列表中。
        // 如果readyList已存在，则直接返回readyList，然后直接调用这个回调函数fn
        jQuery.ready.promise()                              // Ⅱ
            .done( fn );                              //Ⅳ

        return this;
    }
};

jQuery.ready.promise = function( obj ) {
    if ( !readyList ) {

        readyList = jQuery.Deferred();

        // IE的bug
        if ( document.readyState === "complete" ) {
            setTimeout( jQuery.ready );

            // 给标准浏览器绑定DOMContentLoaded事件以触发DOMContentLoaded方法
            // 同时，绑定window.onload事件作为备用方案
        } else if ( document.addEventListener ) {
            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            window.addEventListener( "load", jQuery.ready, false );

            // 给IE浏览器绑定onreadystatechange事件，在DOMContentLoaded中判断
            // readyState是否为complete
        } else {
            document.attachEvent( "onreadystatechange", DOMContentLoaded );
            window.attachEvent( "onload", jQuery.ready );

            // 对IE做进一步的兼容性检测
            var top = false;
            try {
                top = window.frameElement == null && document.documentElement;
            } catch(e) {}
            if ( top && top.doScroll ) {
                (function doScrollCheck() {
                    if ( !jQuery.isReady ) {
                        try {
                            // Use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            top.doScroll("left");
                        } catch(e) {
                            return setTimeout( doScrollCheck, 50 );
                        }
                        // and execute any waiting functions
                        jQuery.ready();
                    }
                })();
            }
        }
    }
    // 返回readyList
    return readyList.promise( obj );                 Ⅲ
};

// 接下来就是等待DOMContentLoaded/readyState==='complete'事件的发生了
// 移除DOMReady事件监听，执行jQuery.ready()
DOMContentLoaded = function() {                  Ⅴ
    // 标准浏览器
    if ( document.addEventListener ) {
        document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        jQuery.ready();
        // IE 浏览器
    } else if ( document.readyState === "complete" ) {
        document.detachEvent( "onreadystatechange", DOMContentLoaded );
        jQuery.ready();
    }
};

jQuery.extend({
    // DOM Ready标志位，DOM Ready触发后置为true
    isReady: false,

    // DOM Ready后运行
    ready: function( ) {

        // 如果已经Ready，则直接返回
        if ( jQuery.isReady ) {
            return;
        }

        // 兼容IE
        if ( !document.body ) {
            return setTimeout( jQuery.ready, 1 );
        }

        // 将isReady置为true
        jQuery.isReady = true;              //Ⅵ

        // 这里是真正触发我们传入的回调的地方!!!!
        // 传入上下文和回调函数的参数列表
        // 注意啦，上下文是document，也就是说我们在`$(document).ready(fn);`里的fn中的this是`document`，不是`window`
        // 参数列表传入了jQuery，意味着即使我们调用了`$.noConflict()`将$让渡出去了，我们仍然能在fn中定义第一个参数为$，代表jQuery
        readyList.resolveWith( document, [ jQuery ] );              //Ⅶ

        // 这段代码是为了触发这种方式添加的DOM Ready回调： $(document).on('ready' , fn);
        // 这种方式在1.8被废弃，但是没有被移除
        // 你可以看到这种方式添加的DOM Ready回调是最后被执行的
        if ( jQuery.fn.trigger ) {
            jQuery( document ).trigger("ready").off("ready");
        }
    }
});