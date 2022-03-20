import { watermark } from './types'
import { markconfig } from './config'
import { debounce } from './utils/tool'

class WaterMark {
  config: watermark = markconfig;
  container: HTMLElement;
  moServer: MutationObserver;
  styleStr: string;

  constructor() {

  }

  init(args: watermark) {
    this.config = { ...this.config, ...args }
    this._init();
  }

  clear() {
    this.config.show = false
    let __wm = null
    if (this.container) {
      __wm = document.querySelector('.__pwm')
    } else {
      __wm = document.querySelector('.__wm')
    }
    if (__wm) {
      this.container.removeChild(__wm)
    }
    if (this.moServer) {
      this.moServer.disconnect()
      this.moServer = null
    }
  }

  show() {
    this.config.show = true
    this._init()
  }

  _init() {
    if (!this.config.show) {
      return;
    } else {
      this._paint();
      if (!this.moServer) {
        this._mutation()
      }
    }
  }

  _paint() {
    this.container = this.config.parentDomName ? document.querySelector(this.config.parentDomName) : document.body
    // 创建画布
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', `${this.config.width}px`)
    canvas.setAttribute('height', `${this.config.height}px`)

    // 得到画笔，开始绘制图形
    const ctx = canvas.getContext('2d')
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${this.config.fontNum}px microsoft yahei`;
    ctx.fillStyle = this.config.color;
    ctx.rotate(Math.PI / 180 * this.config.rotate)
    ctx.fillText(this.config.title, parseFloat(`${this.config.width}px`) / 2, parseFloat(`${this.config.height}px`) / 2)

    // 得到画的图形的信息
    const base64Url = canvas.toDataURL()

    let __wm = null
    if (this.container) {
      __wm = document.querySelector('.__pwm')
    } else {
      __wm = document.querySelector('.__wm')
    }

    // 创建包裹水印的div
    const watermarkDiv = __wm || document.createElement('div')

    this.styleStr =
      `position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:${this.config.zIndex};
        pointer-events:none;
        background-repeat:repeat;
        background-image:url('${base64Url}')`

    watermarkDiv.setAttribute('style', this.styleStr)

    if (this.container) {
      watermarkDiv.classList.add('__pwm');
    } else {
      watermarkDiv.classList.add('__wm');
    }
    if (!__wm) {
      this.container.style.position = 'relative'
      this.container.appendChild(watermarkDiv)
      // container.appendChild(watermarkDiv, container.firstChild)
      // this.container.insertBefore(watermarkDiv, this.container.firstChild)
    }

  }

  _mutation() {
    // 监听dom变化
    const MutationObserver = window.MutationObserver || (window as any).WebKitMutationObserver
    if (MutationObserver && !this.moServer) {
      this.moServer = new MutationObserver(debounce(() => {
        this._listen()
      }, 300)
      )
      this.moServer.observe(this.container, {
        attributes: true,
        subtree: true,
        childList: true
      })
    }
  }

  _listen() {
    let __wm = null
    if (this.container) {
      __wm = document.querySelector('.__pwm')
    } else {
      __wm = document.querySelector('.__wm')
    }
    // 只在__wm元素变动才重新调用 init, 并且当前页支持有水印
    if (((__wm && __wm.getAttribute('style') !== this.styleStr) || !__wm) && this.config.show) {
      // 避免一直触发
      this._init()
    }
  }

}

export default new WaterMark()
