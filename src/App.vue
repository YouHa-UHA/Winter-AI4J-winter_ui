<script setup lang="ts">
import { RouterView } from 'vue-router'
import ControlCenter from '@/components/ControlCenter.vue'
</script>

<template>
  <el-container class="container">
    <el-aside width="100px" class="aside">
      <ControlCenter />
    </el-aside>
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="slide">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </el-container>


</template>
<style scoped>
.aside {
  display: flex;
  align-items: center;
  justify-content: center;
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
