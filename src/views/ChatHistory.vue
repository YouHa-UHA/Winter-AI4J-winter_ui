<template>
  <div class="container">
    <el-dialog title="会话历史" v-model="dialogVisible" :fullscreen="true">
      <div style="display: flex">
        <el-input
          v-model="keyWord"
          ref="inputRef"
          placeholder="搜索历史会话"
          style="width: 70%; margin: auto"
          @keyup.enter="selectList"
        />
      </div>
      <br />
      <br />
      <el-card
        v-for="item in tableData"
        :key="item.id"
        @click="selectHistory(item)"
        style="margin-bottom: 10px"
        shadow="never"
      >
        <div
          style="
            display: flex;
            flex-direction: row;
            gap: 30px;
            align-items: center;
          "
        >
          <el-icon><Tickets /></el-icon>
          <div style="font-size: 16px; font-weight: bold">
            {{ item.chatName }}
          </div>
          <div style="margin-left: auto">{{ item.updateTime }}</div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" name="ChatHistroy">
import { ref } from "vue";
import { getHistoryList, getChatHistory } from "@/api/chatApi";
import { ElInput } from "element-plus";
import { Tickets } from "@element-plus/icons-vue"; // 引入图标

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
const selectList = async () => {
  const { data } = await getHistoryList();
  tableData.value = data.data;
};
const open = () => {
  dialogVisible.value = true;
  setTimeout(() => {
    inputRef.value?.focus();
  }, 0); // 短暂延迟
  selectList();
};
const selectHistory = async (row: ChatHistoryVo) => {
  const { data } = await getChatHistory({ chatId: row.chatId });
  console.log(data);
};
defineExpose({ open });
</script>
<style scoped>
:deep() .el-card:hover {
  box-shadow: 0 1px 6px rgba(255, 255, 255, 0.932);
  background-color: var(--bg-color);
  transition: all 0.2s ease-in-out;
}
</style>