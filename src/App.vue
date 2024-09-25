<script setup lang="ts">
import { RouterView } from 'vue-router'
import ControlCenter from '@/components/ControlCenter.vue'
import { ref } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

const ifShowControl = ref(true)
const expandControl = () => {
  ifShowControl.value = !ifShowControl.value
}
</script>

<template>
  <el-row class="container">
    <el-col :span="ifShowControl ? 1 : 0" class="aside">
      <ControlCenter v-show="ifShowControl" />
    </el-col>
    <el-col :span="1" class="aside">
      <div class="display-expand">
        <!-- <el-tooltip :content="ifShowControl ? '收起' : '展开'" placement="right"> -->
        <el-button class="hide-button" type="text" plain :icon="ifShowControl ? ArrowLeftBold : ArrowRightBold"
          @click="expandControl">
        </el-button>
        <!-- </el-tooltip> -->
      </div>

    </el-col>

    <el-col :span="ifShowControl ? 22 : 23">
      <router-view v-slot="{ Component }">
        <transition name="slide">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-col>
  </el-row>

</template>
<style scoped>
.aside {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.hide-button {
  display: none;
  width: 10px;
}

.display-expand {
  width: 30px;
  height: 30px;
}

.display-expand:hover .hide-button {
  display: block;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.75s ease-out;
}


.slide-enter-to {
  position: absolute;
  bottom: 0;
}


.slide-enter-from {
  position: absolute;
  bottom: -100%;
}


.slide-leave-to {
  position: absolute;
  top: -100%;
}


.slide-leave-from {
  position: absolute;
  top: 0;
}
</style>
