<template>
  <!-- 登录 -->
  <div class="go-login-box">
    <div class="go-login">
      <n-grid>
        <n-gi :span="12">
          <div class="go-login-form">
            <div class="go-login-form-header">
              <img width="40" height="80" :src="SVG_ICON.card_icons.logo" />
              <img width="144" height="80" :src="SVG_ICON.card_icons.lubanx" />
            </div>
            <div class="go-login-form-account">
              <n-text class="go-login-form-account-title">欢迎登录</n-text>
              <div class="go-login-form-account-desc">
                <img width="100" height="32" :src="SVG_ICON.card_icons.XPlay" />
                <n-text style="color: rgba(255, 255, 255, 0.93)">楼宇逻辑控制器</n-text>
              </div>

              <n-form
                ref="formRef"
                label-placement="left"
                size="large"
                :model="formInline"
                :rules="rules"
              >
                <n-form-item path="username">
                  <n-input
                    v-model:value="formInline.username"
                    type="text"
                    maxlength="16"
                    :placeholder="$t('global.form_account')"
                  >
                    <template #prefix>
                      <n-icon size="18">
                        <PersonOutlineIcon></PersonOutlineIcon>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item path="password">
                  <n-input
                    v-model:value="formInline.password"
                    type="password"
                    maxlength="16"
                    show-password-on="click"
                    :placeholder="$t('global.form_password')"
                  >
                    <template #prefix>
                      <n-icon size="18">
                        <LockClosedOutlineIcon></LockClosedOutlineIcon>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item>
                  <div class="flex justify-between">
                    <div class="flex-initial">
                      <n-checkbox v-model:checked="autoLogin">
                        {{ $t('login.form_auto') }}
                      </n-checkbox>
                    </div>
                  </div>
                </n-form-item>
                <n-form-item>
                  <n-button
                    type="primary"
                    @click="handleSubmit"
                    size="large"
                    :loading="loading"
                    block
                  >
                    {{ $t('login.form_button') }}
                  </n-button>
                </n-form-item>
              </n-form>
            </div>
            <div class="go-login-form-footer">
              <span>Adveco © 2024</span>
              <span>About us</span>
              <span>Contact us</span>
            </div>
          </div>
        </n-gi>
        <n-gi :span="12">
          <div class="go-login-img">
            <img
              src="@/assets/images/login/login_background.png"
              style="display: block; width: 100%; height: 100%"
            />
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import shuffle from 'lodash/shuffle'
import { carouselInterval } from '@/settings/designSetting'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { GoThemeSelect } from '@/components/GoThemeSelect'
import { GoLangSelect } from '@/components/GoLangSelect'
import { LayoutHeader } from '@/layout/components/LayoutHeader'
import { LayoutFooter } from '@/layout/components/LayoutFooter'
import { PageEnum } from '@/enums/pageEnum'
import { icon } from '@/plugins'
import { StorageEnum } from '@/enums/storageEnum'
import { routerTurnByName, cryptoEncode, setLocalStorage } from '@/utils'
import { onLogin } from '@/api/http'
import SVG_ICON from '@/svg/SVG_ICON'

const { GO_LOGIN_INFO_STORE } = StorageEnum

const { PersonOutlineIcon, LockClosedOutlineIcon } = icon.ionicons5

interface FormState {
  username: string
  password: string
}

const height = `${document.documentElement.clientHeight - 56}`

const formRef = ref()
const loading = ref(false)
const autoLogin = ref(true)
const show = ref(false)
const showBg = ref(false)
const designStore = useDesignStore()

const t = window['$t']

onMounted(() => {
  setTimeout(() => {
    show.value = true
  }, 300)
  setTimeout(() => {
    showBg.value = true
  }, 100)
})

const formInline = reactive({
  username: 'admin',
  password: '123456'
})

const rules = {
  username: {
    required: true,
    message: t('global.form_account'),
    trigger: 'blur'
  },
  password: {
    required: true,
    message: t('global.form_password'),
    trigger: 'blur'
  }
}

// 定时器
const shuffleTimiing = ref()

// 轮播图
const carouselImgList = ['one', 'two', 'three']

// 背景图
const bgList = ref([
  'bar_y',
  'bar_x',
  'line_gradient',
  'line',
  'funnel',
  'heatmap',
  'map',
  'pie',
  'radar'
])

// 处理url获取
const getImageUrl = (name: string, folder: string) => {
  return new URL(`../../assets/images/${folder}/${name}.png`, import.meta.url).href
}

// 打乱
const shuffleHandle = () => {
  shuffleTimiing.value = setInterval(() => {
    bgList.value = shuffle(bgList.value)
  }, carouselInterval)
}

// 点击事件
const handleSubmit = (e: Event) => {
  e.preventDefault()
  formRef.value.validate(async (errors: any) => {
    if (!errors) {
      const { username, password } = formInline
      loading.value = true
      //get cookies
      // onLogin(formInline).then(data => {
      //   console.log(data)
      // })

      setLocalStorage(
        GO_LOGIN_INFO_STORE,
        cryptoEncode(
          JSON.stringify({
            username,
            password
          })
        )
      )
      window['$message'].success(`${t('login.login_success')}!`)
      routerTurnByName(PageEnum.BASE_HOME_NAME, true)
    } else {
      window['$message'].error(`${t('login.login_message')}!`)
    }
  })
}

onMounted(() => {
  shuffleHandle()
})

const login = (newAccessToken: string, refreshToken: string) => {}
</script>

<style lang="scss" scoped>
$width: 450px;
$go-login-height: 100vh;
$account-img-height: 210px;
$footer-height: 50px;
$carousel-width: 30%;
$carousel-image-height: 60vh;

* {
  box-sizing: border-box;
}
@include go(login-box) {
  height: $go-login-height;
  overflow: hidden;
  //@include background-image('background-image');
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    height: $--header-height;
  }
  &-divider {
    margin: 0;
    padding-top: 0;
  }

  @include go(login) {
    height: $go-login-height;
    width: 100vw;
    background-image: radial-gradient(farthest-side at 0% 0%, #383477, #19162a);

    &-img {
      padding: 0;
      height: 100%;
    }

    &-form {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100%;

      &-header {
        height: 80px;
        padding-left: 16px;
        width: 100%;
      }

      &-account {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: 0 160px;
        width: 420px;

        &-title {
          font-size: 40px;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.93);
        }

        &-desc {
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 28px;
        }
      }

      &-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 24px;
        height: 60px;
        padding-bottom: 12px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.93);
      }
    }
  }
}
@media only screen and (max-width: 1200px) {
  .bg-img-box,
  .bg-slot,
  .go-login-carousel {
    display: none !important;
  }
}

::v-deep(.n-grid) {
  height: 100vh;
}
</style>
