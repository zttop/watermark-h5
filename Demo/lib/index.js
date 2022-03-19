/* watermark version 🌹1.0.0 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.watermark = factory());
})(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var markconfig = {
        parentDomName: 'body',
        show: true,
        color: 'rgba(0, 0, 0, 0.06)',
        title: '严禁外传',
        width: 200,
        height: 200,
        fontNum: 15,
        rotate: -25,
        zIndex: 9999
    };

    /**
     * @param {Function} func
     * @param {number} wait
     * @param {boolean} immediate
     * @return {*}
     */
    function debounce(func, wait, immediate) {
        if (immediate === void 0) { immediate = false; }
        var timeout, args, context, timestamp, result;
        var later = function () {
            // 据上一次触发时间间隔
            var last = +new Date() - timestamp;
            // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
            if (last < wait && last > 0) {
                timeout = setTimeout(later, wait - last);
            }
            else {
                timeout = null;
                // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout)
                        context = args = null;
                }
            }
        };
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            context = this;
            timestamp = +new Date();
            var callNow = immediate && !timeout;
            // 如果延时不存在，重新设定延时
            if (!timeout)
                timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    }

    var WaterMark = /** @class */ (function () {
        function WaterMark() {
            this.config = markconfig;
        }
        WaterMark.prototype.init = function (args) {
            this.config = __assign(__assign({}, this.config), args);
            console.log('-=-=-=-=-init🌹🌹🌹-=-=-=-', this.config);
            this._init();
        };
        WaterMark.prototype._init = function () {
            console.log('-=-=-=-=-_init🌰=-=-=-', this.config);
            if (!this.config.show) {
                return;
            }
            else {
                this._paint();
                this._mutation();
            }
        };
        WaterMark.prototype._paint = function () {
            this.container = this.config.parentDomName ? document.querySelector(this.config.parentDomName) : document.body;
            // 创建画布
            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', "".concat(this.config.width, "px"));
            canvas.setAttribute('height', "".concat(this.config.height, "px"));
            // 得到画笔，开始绘制图形
            var ctx = canvas.getContext('2d');
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = "".concat(this.config.fontNum, "px microsoft yahei");
            ctx.fillStyle = this.config.color;
            ctx.rotate(Math.PI / 180 * this.config.rotate);
            ctx.fillText(this.config.title, parseFloat("".concat(this.config.width, "px")) / 2, parseFloat("".concat(this.config.height, "px")) / 2);
            // 得到画的图形的信息
            var base64Url = canvas.toDataURL();
            var __wm = null;
            if (this.container) {
                __wm = document.querySelector('.__pwm');
            }
            else {
                __wm = document.querySelector('.__wm');
            }
            // 创建包裹水印的div
            var watermarkDiv = __wm || document.createElement('div');
            this.styleStr =
                "position:absolute;\n        top:0;\n        left:0;\n        width:100%;\n        height:100%;\n        z-index:".concat(this.config.zIndex, ";\n        pointer-events:none;\n        background-repeat:repeat;\n        background-image:url('").concat(base64Url, "')");
            watermarkDiv.setAttribute('style', this.styleStr);
            if (this.container) {
                watermarkDiv.classList.add('__pwm');
            }
            else {
                watermarkDiv.classList.add('__wm');
            }
            if (!__wm) {
                this.container.style.position = 'relative';
                this.container.appendChild(watermarkDiv);
                // container.appendChild(watermarkDiv, container.firstChild)
                // this.container.insertBefore(watermarkDiv, this.container.firstChild)
            }
        };
        WaterMark.prototype._mutation = function () {
            var _this = this;
            // 监听dom变化
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            if (MutationObserver && !this.moServer) {
                this.moServer = new MutationObserver(debounce(function () {
                    _this._listen();
                }, 300));
                this.moServer.observe(this.container, {
                    attributes: true,
                    subtree: true,
                    childList: true
                });
            }
        };
        WaterMark.prototype._listen = function () {
            var __wm = null;
            if (this.container) {
                __wm = document.querySelector('.__pwm');
            }
            else {
                __wm = document.querySelector('.__wm');
            }
            // 只在__wm元素变动才重新调用 init, 并且当前页支持有水印
            if (((__wm && __wm.getAttribute('style') !== this.styleStr) || !__wm) && this.config.show) {
                // 避免一直触发
                this._init();
            }
        };
        return WaterMark;
    }());
    var watermark = new WaterMark();

    return watermark;

}));
/* up up up */
//# sourceMappingURL=index.js.map
