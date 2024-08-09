import { reactive, h } from 'vue'
import { renderIcon } from '@/utils'
import { RouterLink } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import { MenuOption, MenuGroupOption } from 'naive-ui'
import { icon } from '@/plugins'

const { HomeIcon, TvOutlineIcon } = icon.ionicons5
const { RoadmapIcon, ObjectStorageIcon, DevicesIcon } = icon.carbon
export const renderMenuLabel = (option: MenuOption | MenuGroupOption) => {
  return option.label
}

export const expandedKeys = () => ['all-project']

export const menuOptionsInit = () => {
  const t = window['$t']

  return reactive([
    {
      key: 'divider-1',
      type: 'divider'
    },
    // {
    //   label: () =>
    //     h(
    //       RouterLink,
    //       {
    //         to: {
    //           name: PageEnum.BASE_LOCAL_NAME
    //         }
    //       },
    //       { default: () => t('menu.Local') }
    //     ),
    //   key: PageEnum.BASE_LOCAL_NAME,
    //   icon: renderIcon(HomeIcon)
    // },
    // {
    //   key: 'divider-2',
    //   type: 'divider'
    // },
    {
      label: () => t('menu.object_manage'),
      key: PageEnum.BASE_Object_MAN_NAME,
      icon: renderIcon(DevicesIcon),
      children: [
        // {
        //   label: () =>
        //     h(
        //       RouterLink,
        //       {
        //         to: {
        //           name: PageEnum.BASE_LOCAL_MAN_NAME
        //         }
        //       },
        //       { default: () => t('menu.local_object_manage') }
        //     ),
        //   key: PageEnum.BASE_LOCAL_MAN_NAME
        // },
        // {
        //   label: () =>
        //     h(
        //       RouterLink,
        //       {
        //         to: {
        //           name: PageEnum.BASE_REMOTE_MAN_NAME
        //         }
        //       },
        //       { default: () => t('menu.remote_object_manage') }
        //     ),
        //   key: PageEnum.BASE_REMOTE_MAN_NAME
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
          key: PageEnum.BASE_MODBUS_MAN_NAME
        }
      ]
    },
    {
      key: 'divider-3',
      type: 'divider'
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
      icon: renderIcon(RoadmapIcon)
    },
    {
      key: 'divider-4',
      type: 'divider'
    }
  ])
}
