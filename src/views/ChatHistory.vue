<template>
    <div>
        <el-dialog title="会话历史" v-model="dialogVisible" :fullscreen="true">
                    <el-input v-model="keyWord" placeholder="搜索历史会话" id="input"
                        @keyup.enter="selectHistroy" />
            <br />
            <br /> 
            <el-table :data="tableData" :border="false" style="width: 100%">
                <el-table-column prop="chatName" align="center" label="会话名称" />
                <el-table-column prop="updateTime" align="center" label="会话时间" />
              </el-table>
        </el-dialog>
    </div>
</template>
<script setup lang="ts" name="ChatHistroy">
import { ref } from "vue"
import {getHistoryList} from "@/api/chatApi"

const dialogVisible=ref(false)
const keyWord=ref("")

interface ChatHistoryVo {
    chatId: string;
    chatName: string;
    createTime: string;
    id: number;
    phone: string;
    time: string;
    updateTime: string;
}
const tableData=ref<ChatHistoryVo[]>()
const selectHistroy=async()=>{
   const {data}= await getHistoryList()
   console.log(data)
   tableData.value=data.data
}
const open=()=>{
    dialogVisible.value=true
    selectHistroy()
    document.getElementById("input")?.focus();
}

defineExpose({open})

</script>
<style scoped>
</style>