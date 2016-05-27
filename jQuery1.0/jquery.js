/**
 * jQuery copy - New Wave Javascript
 *
 * Copyright (c) 2016 Lever Wang (lever.wang)
 *
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 *
 * */

// 全局 undefined 变量  确保undefined存在
// 注: 在低版本的浏览器中undefined可以被重写,而ES5规定undefined不可写: var undefined = 6; console.log(undefined) //6

window.undefined = window.undefined;

/**
 * Create a new jQuery Object
 * @constructor
 * a: jQuery对象
 * c: 上下文(作用域)
 * */
function jQuery(a, c) {
    if( a && a.jQuery )
        return a;

    if( window == this){
        return new jQuery(a,c);
    }

    this.cur = jQuery.Select(
        a || jQuery.context || document,
        c && c.jQuery && c.get(0) || c
    );
}

//The jQuery query object.
if(!window.$)
    var $ = jQuery;

else
    //防止其他库的 "$" 影响到这里,直接进行重写
    var $ = function (a, c) {
        //没有传c参数,a是个字符串,a中有除了a-zA-Z0-9_-这些字符之外的字符,没有用a参数这个标签在dom中,再判断是否有对应id的dom
        if(!c && a.constructor == String && !/[^a-zA-Z0-9_-]/.test(a) && !document.getElementsByTagName(a).length){
            var obj = document.getElementById(a);
            if(obj) return obj;
        }
        return jQuery(a,c);
    };

jQuery.fn = jQuery.prototype = {
    jquery: "1.0", //版本号
    //size用来获取当前的选择器匹配到的DOM元素的个数
    size: function () {
        return this.get().length;
    },
    //获取匹配到的DOM元素数组,如果get中传入了num参数,则获取指定第num个的DOM元素
    get: function (num) {
        return num == undefined ? this.cur : this.cur[num];
    },
    //对匹配到的每个DOM元素执行f函数
    each: function (f) {
        for(var i = 0; i < this.size(); i++){
            f.apply(this.get(i), [i]);
        }
        return this;
    },
    // set("value","123") ==> 对匹配到的每个DOM元素执行jQuery.attr(this, "value", "123");
    // set({value: "123"}) ==> 对匹配到的每个DOM元素执行jQuery.attr(this, "value", "123");
    // 通过对参数进行判断,实现函数重载
    set: function (a, b) {
        return this.each(function () {
            if(b === undefined)
                for(var j in a){
                    jQuery.attr(this, j, a[j]);
                }
            else
                jQuery.attr(this, a, b);
        });
    },
    //html()获取匹配节点中的第一个节点的子节点,html(h)设置所有匹配节点的子节点内容(ps: set方法默认会遍历所有的匹配节点)
    html: function (h) {
        return h == undefined && this.size() ? this.get(0).innerHTML : this.set("innerHTML", h);
    },
    //获取匹配到的第一个节点的value值,设置所有匹配节点的value值
    val: function (h) {
        return h == undefined && this.size() ? this.get(0).value : this.set("value", h);
    },
    // 返回传入元素或者当前匹配元素的所有文本节点的内容拼接之后的内容
    text: function (e) {
        e = e || this.get();
        var t = "";
        for(var j = 0; j < e.length; j++){
            for(var i = 0; i < e[j].childNodes.length; i++){
                t += e[j].childNodes[i].nodeType != 1 ? e[j].childNodes[i].nodeValue : jQuery.fn.text(e[j].childNodes[i].childNodes);
            }
        }
        return t;
    },
    css: function (a, b) {
        return a.constructor != String || b ? this.each(function () {
            if(b === undefined)
                for(var j in a){
                    jQuery.attr(this.style, j, a[j]);
                }
            else
                jQuery.attr(this.style, a, b);
        }) : jQuery.css( this.get(0), a ); //该特殊情况应该会在attr()函数中做处理
    },
    //通过获取当前匹配元素的display值,判断它的显示状态,然后进行切换
    toggle: function () {
        return this.each(function () {
            var d = jQuery.css(this, "display");
            if( !d || d == "none")
                $(this).show();
            else
                $(this).hide();
        });
    },
    show: function () {
        return this.each(function () {
            this.style.display = this.oldblock ? this.oldblock : "";
            if(jQuery.css(this, "display") == "none")
                this.style.display = "block";
        });
    },
    hide: function () {
        return this.each(function () {
            this.oldblock = jQuery.css(this, "display"); //在隐藏元素前将元素当前的display状态保存下来,再在show的时候完美还原回来.
            if(this.oldblock == "none")
                this.oldblock = "block"; //如果oldblock值为none,先默认设置为block,防止使用show的时候无法恢复.
            this.style.display = "none";
        });
    },
    addClass: function (c) {
        return this.each(function () {
            jQuery.className.add(this, c);
        });
    },
    removeClass: function (c) {
        return this.each(function () {
            jQuery.className.remove(this, c);
        });
    },
    toggleClass: function (c) {
        return this.each(function () {
            if(jQuery.hasWord(this, c)) //判断是否有c这个class
                jQuery.className.remove(this, c);
            else
                jQuery.className.add(this, c);
        })
    },
    remove: function () {
        this.each(function () {
            this.parentNode.removeChild(this);
        });
        return this.pushStack([]); //这一句是什么意思???
    },
    // wrap: function () {
    //
    // }
};