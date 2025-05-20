import { HistoryTargetTypeEnum, HistoryActionTypeEnum } from './chartHistoryStore.d'

export const historyActionTypeName = {
  [HistoryActionTypeEnum.ADD]: window['$t']('dashboard.add'),
  [HistoryActionTypeEnum.DELETE]: window['$t']('dashboard.del'),
  [HistoryActionTypeEnum.UPDATE]: window['$t']('dashboard.update'),
  [HistoryActionTypeEnum.MOVE]: window['$t']('dashboard.move'),
  [HistoryActionTypeEnum.PASTE]: window['$t']('dashboard.paste'),
  [HistoryActionTypeEnum.COPY]: window['$t']('dashboard.copy'),
  [HistoryActionTypeEnum.CUT]: window['$t']('dashboard.cut'),
  [HistoryActionTypeEnum.TOP]: window['$t']('dashboard.top'),
  [HistoryActionTypeEnum.BOTTOM]: window['$t']('dashboard.bottom'),
  [HistoryActionTypeEnum.UP]: window['$t']('dashboard.move_up'),
  [HistoryActionTypeEnum.DOWN]: window['$t']('dashboard.move_down'),
  [HistoryActionTypeEnum.GROUP]: window['$t']('dashboard.group'),
  [HistoryActionTypeEnum.UN_GROUP]: window['$t']('dashboard.disassemble'),
  [HistoryActionTypeEnum.LOCK]: window['$t']('dashboard.lock_'),
  [HistoryActionTypeEnum.UNLOCK]: window['$t']('dashboard.unlock_'),
  [HistoryActionTypeEnum.HIDE]: window['$t']('dashboard.hide'),
  [HistoryActionTypeEnum.SHOW]: window['$t']('dashboard.display'),

  [HistoryTargetTypeEnum.CANVAS]: window['$t']('dashboard.canvas_init'),
}
