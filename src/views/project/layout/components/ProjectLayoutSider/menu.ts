import { reactive, h, computed } from 'vue'
import { renderIcon, renderImage, getLoginUser } from '@/utils'
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

export const expandedKeys = () => [PageEnum.BASE_REMOTE_MAN_NAME]

export const menuOptionsInit = (selectedKey: any) => {
  const t = window['$t']
  const isShow = computed(() => {
    return getLoginUser()
  })

  if (isShow.value) {
    return reactive([
      {
        label: () => t('menu.device_manage'),
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
      // {
      //   label: () => t('menu.modbus_manage'),
      //   key: PageEnum.BASE_MODBUS_MAN_NAME,
      //   icon: renderImage(
      //     selectedKey === PageEnum.BASE_MODBUS_MAN_NAME
      //       ? SVG_ICON.card_icons.modbus_df
      //       : SVG_ICON.card_icons.modbus_sp,
      //     '',
      //     32,
      //     32
      //   )
      // },
      {
        label: () => t('menu.DashBoard'),
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
    ])
  } else {
    return reactive([
      {
        label: () => t('menu.DashBoard'),
        key: PageEnum.BASE_HOME_ITEMS_NAME,
        icon: renderImage(SVG_ICON.card_icons.Visualize_df, '', 32, 32)
      }
    ])
  }
}
