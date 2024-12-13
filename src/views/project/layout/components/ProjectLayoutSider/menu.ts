import { reactive, h } from 'vue'
import { renderIcon, renderImage } from '@/utils'
import { RouterLink } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import { MenuOption, MenuGroupOption } from 'naive-ui'
import { icon } from '@/plugins'
import SVG_ICON from '@/svg/SVG_ICON'

const { HomeIcon, TvOutlineIcon } = icon.ionicons5
const { RoadmapIcon, ObjectStorageIcon, DevicesIcon } = icon.carbon
export const renderMenuLabel = (option: MenuOption | MenuGroupOption) => {
  return option.label
}


export const expandedKeys = () => ['all-project']

export const menuOptionsInit = () => {
  const t = window['$t']

  return reactive([
    // {
    //   label: () =>
    //     h(
    //       RouterLink,
    //       {
    //         to: {
    //           name: PageEnum.BASE_LOCAL_MAN_NAME
    //         }
    //       },
    //       { default: () => 'Bacnet' }
    //     ),
    //   key: PageEnum.BASE_LOCAL_MAN_NAME,
    //   icon: renderImage(SVG_ICON.card_icons.Bacnet_nomal, '', 32, 32),
    // },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: PageEnum.BASE_MODBUS_MAN_NAME
            }
          },
          { default: () => t('menu.modbus_manage') }
        ),
      key: PageEnum.BASE_MODBUS_MAN_NAME,
      icon: renderImage(SVG_ICON.card_icons.modbus_s, '', 32, 32),
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: PageEnum.BASE_HOME_ITEMS_NAME
            }
          },
          { default: () => t('menu.DashBoard') }
        ),
      key: PageEnum.BASE_HOME_ITEMS_NAME,
      icon: renderImage(SVG_ICON.card_icons.Visualize_sp, '', 32, 32)
    },
  ])
}
