import { computed } from 'vue'
import { renderImage, getLoginUser } from '@/utils'
import { PageEnum } from '@/enums/pageEnum'
import { MenuOption, MenuGroupOption } from 'naive-ui'
import SVG_ICON from '@/svg/SVG_ICON'
import { createI18nArray } from '@/packages'
import i18n from '@/i18n/index'

export const expandedKeys = () => [PageEnum.BASE_REMOTE_MAN_NAME]

// 管理员菜单
const adminMenus = (selectedKey: any) => [
  {
    label: i18n.global.t('menu.device_manage'),
    key: PageEnum.BASE_REMOTE_MAN_NAME,
    icon: renderImage(
      selectedKey === PageEnum.BASE_HOME_ITEMS_NAME
        ? SVG_ICON.card_icons.modbus_sp
        : SVG_ICON.card_icons.modbus_df,
      '',
      32,
      32
    )
  },
  {
    label: i18n.global.t('menu.DashBoard'),
    key: PageEnum.BASE_HOME_ITEMS_NAME,
    icon: renderImage(
      selectedKey === PageEnum.BASE_HOME_ITEMS_NAME
        ? SVG_ICON.card_icons.Visualize_df
        : SVG_ICON.card_icons.Visualize_sp,
      '',
      32,
      32
    )
  }
]

// 普通用户/游客菜单
const guestMenus = (selectedKey: any) => [
  {
    label: i18n.global.t('menu.DashBoard'),
    key: PageEnum.BASE_HOME_ITEMS_NAME,
    icon: renderImage(SVG_ICON.card_icons.Visualize_df, '', 32, 32)
  }
]

export const menuOptionsInit = (selectedKey: any) => {
  const isAdmin = computed(getLoginUser)

  return createI18nArray(() => (isAdmin.value ? adminMenus(selectedKey) : guestMenus(selectedKey)))
}

