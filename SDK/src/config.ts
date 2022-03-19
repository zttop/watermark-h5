import { watermark } from './types'

export const markconfig: watermark = {
  parentDomName: 'body', // 父节点dom选择器名字
  show: true, // 水印开关
  color: 'rgba(0, 0, 0, 0.06)', // 水印色值
  title: '严禁外传', // 显示的水印文本
  width: 200, // 水印宽高
  height: 200,
  fontNum: 15, // 水印字体大小
  rotate: -25,
  zIndex: 9999,
}
