<template>
  <div class="container">
    <el-dialog title="会话历史" v-model="dialogVisible" :fullscreen="true">
      <div style="display: flex">
        <el-input
          v-model="keyWord"
          ref="inputRef"
          placeholder="搜索历史会话"
          style="width: 70%; margin: auto"
          @keyup.enter="selectHistroy"
        />
      </div>
      <br />
      <br />
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="chatName" align="center" label="会话名称" />
        <el-table-column prop="updateTime" align="center" label="会话时间" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" name="ChatHistroy">
import { ref } from "vue";
import { getHistoryList } from "@/api/chatApi";
import { ElInput } from "element-plus";

const dialogVisible = ref(false);
const keyWord = ref("");
const inputRef = ref<InstanceType<typeof ElInput> | null>(null);
interface ChatHistoryVo {
  chatId: string;
  chatName: string;
  createTime: string;
  id: number;
  phone: string;
  time: string;
  updateTime: string;
}
const tableData = ref<ChatHistoryVo[]>();
const selectHistroy = async () => {
  const { data } = await getHistoryList();
  tableData.value = data.data;
};
const open = () => {
  dialogVisible.value = true;
  setTimeout(() => {
    inputRef.value?.focus();
  }, 0); // 短暂延迟
  selectHistroy();
};

defineExpose({ open });
</script>
<style scoped>
</style>