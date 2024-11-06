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
      <div
        @scroll="handleScroll"
        ref="scrollRef"
        style="height: 80vh; overflow: auto"
      >
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
        <div style="display: flex">
          <span style="margin: auto" v-if="ifSelectAll"
            >已显示所有可用内容</span
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" name="ChatHistroy">
import { ref } from "vue";
import { getHistoryList, getChatHistory } from "@/api/chatApi";
import { ElInput } from "element-plus";
import { Tickets } from "@element-plus/icons-vue"; // 引入图标
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { useChatStore } from "@/stores/chat";
import { useRouter } from "vue-router";
import { firstChatText, type GptMsg } from "@/utils/types";

const router = useRouter();
const dialogVisible = ref(false);
const useUser = useUserStore();
const useChat = useChatStore();
const scrollRef = ref();
const pageNum = ref(1);
const pageSize = ref(10);
const keyWord = ref("");
const ifSelectAll = ref(false);
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
const tableData = ref<ChatHistoryVo[]>([]);
const selectList = async () => {
  if (ifSelectAll.value) {
    return; //已经全部查完就不需要再发请求了
  }
  try {
    const data = await getHistoryList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    });
    tableData.value.push(...data.data);
    if (data.data.length == 0) {
      ifSelectAll.value = true;
    }
  } catch (error) {
    tableData.value = [];
    ElMessage.warning("暂无相关结果");
  }
};
const open = () => {
  tableData.value = [];
  pageNum.value = 1;
  ifSelectAll.value = false;
  dialogVisible.value = true;
  setTimeout(() => {
    inputRef.value?.focus();
  }, 0); // 短暂延迟
  selectList();
};
const selectHistory = async (row: ChatHistoryVo) => {
  const data = await getChatHistory({ chatId: row.chatId });
  //切换当前会话
  const list = [{ role: "assistant", content: firstChatText }] as GptMsg[];
  list.push(...data);
  useChat.setMsgList(list);
  dialogVisible.value = false;
  useUser.name = row.chatName.substring(0, 5); //当前会话的名字
  useUser.chatId = row.chatId;
  useUser.chat1stMsg = useChat.msgList[0]?.content; //当前会话用户的第一个问题
  router.push({ path: "/", query: { type: String(Math.random()) } });
};
const handleScroll = () => {
  if (
    scrollRef.value.scrollTop + scrollRef.value.clientHeight >=
    scrollRef.value.scrollHeight - 10
  ) {
    // 触底发送新的分页请求
    pageNum.value++;
    selectList();
  }
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