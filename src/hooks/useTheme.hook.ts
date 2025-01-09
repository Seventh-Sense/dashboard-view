import { computed, toRefs } from 'vue'
import { darkTheme, GlobalThemeOverrides } from 'naive-ui'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { borderRadius } from '@/settings/designSetting'
import { alpha, lighten } from '@/utils'

/**
 * * 设置全局主题
 */
export const useThemeOverridesHook = () => {
  const designStore = useDesignStore()
  const { getAppTheme } = toRefs(designStore)
  const darkTheme = computed((): GlobalThemeOverrides => {
    // 通用
    const commonObj = {
      common: {
        primaryColor: getAppTheme.value,
        primaryColorHover: lighten(alpha(getAppTheme.value), 0.1),
        primaryColorPressed: lighten(alpha(getAppTheme.value), 0.1),
        primaryColorSuppl: getAppTheme.value,
        borderRadius
      }
    }
    // 亮色主题
    const lightObject = {
      common: {
        ...commonObj.common
      }
    }

    // 暗色主题
    const dartObject = {
      common: {
        ...commonObj.common
      },
      LoadingBar: {
        colorLoading: getAppTheme.value
      },
      DataTable: {
        thColor: 'rgba(32, 30, 43, 1)',
        tdColor: 'rgb(25, 22, 42, 1)',
        tdColorHover: 'rgb(25, 22, 42, 1)',
        tdTextColor: 'rgba(255, 255, 255, 0.93)',
      },
      Dropdown: {
        color: 'rgba(0, 0, 0, 0.53)',
        borderRadius: '6px',
        optionHeightMedium: '48px',
        padding: '0 0',
        optionSuffixWidthMedium: '60px',
      },
      Button: {
        color: 'rgba(120, 58, 254, 1)',
        colorHover: 'rgba(120, 58, 254, 1)',
        colorPressed: 'rgba(120, 58, 254, 1)',
        colorFocus: 'rgba(120, 58, 254, 1)',
        textColor: '#ffffffff',
        textColorHover: '#ffffffff',
        textColorPressed: '#ffffffff',
        textColorFocus: '#ffffffff',
        border: 0,
        borderHover: 0,
        borderFocus: 0,
      },
      Modal: {
        color: 'rgba(0, 0, 0, 1)',
        textColor: 'rgba(255, 255, 255, 0.93)'
      },
      Menu: {
        itemColorHover: 'rgba(0, 0, 0, 0.6)',
        itemColorActive: 'rgba(0, 0, 0, 0.6)',
        itemColorActiveHover: 'rgba(0, 0, 0, 0.6)',
        itemColorActiveCollapsed: 'rgba(0, 0, 0, 0.6)',
        fontSize: '16px',
        borderRadius: '8px',
        itemHeight: '44px',
        itemTextColor: 'rgba(255, 255, 255, 0.93)',
        itemTextColorHover: 'rgba(255, 255, 255, 0.93)',
        itemTextColorActive: 'rgba(255, 255, 255, 0.93)',
        itemTextColorActiveHover: 'rgba(255, 255, 255, 0.93)'
      },
      Input: {
        border: 0,
        borderHover: 0,
        borderFocus: 0,
        boxShadowFocus: 0,
        paddingMedium: '0',
      },
    }
    return designStore.getDarkTheme ? dartObject : lightObject
  })
  return darkTheme
}

// 返回暗黑主题
export const useDarkThemeHook = () => {
  const designStore = useDesignStore()
  return computed(() => (designStore.getDarkTheme ? darkTheme : undefined))
}
