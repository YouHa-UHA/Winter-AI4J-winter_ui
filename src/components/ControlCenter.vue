<template>
    <div class="custom-center">
        <el-switch v-model="ifDark" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
    </div>
</template>
<script setup lang="ts" name="ControlCenter">
import { ref, watchEffect } from "vue";
import { Sunny, Moon } from '@element-plus/icons-vue';  // 引入图标

const ifDark = ref(false)
// 监听 `isDarkMode` 变量的变化，动态修改 <html> 标签的 class
watchEffect(() => {
    if (ifDark.value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});
</script>
<style scoped>
.custom-center {
    height: 50vh;
}
</style>