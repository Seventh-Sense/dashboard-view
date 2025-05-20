export enum ChatCategoryEnum {
  TEXT = 'Texts',
  TITLE = 'Titles',
  INPUTS = 'Inputs',
  MORE = 'Mores'
}

export enum ChatCategoryEnumName {
  TEXT = () => window['$t']('dashboard.text'),
  TITLE = '标题',
  // 控件 => 数据录入
  INPUTS = () => window['$t']('dashboard.input'),
  MORE = '更多'
}