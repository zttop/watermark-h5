export interface watermark {
  parentDomName: string, // 父节点dom选择器名字
  show: boolean, // 水印开关
  color: string, // 水印色值
  title: string, // 显示的水印文本
  width: number, // 水印宽高
  height: number,
  fontNum: number, // 水印字体大小
  rotate: number, // 旋转角度
  zIndex: number,
}
