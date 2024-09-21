<template>
    <el-container class="container">
        <!-- 顶部标题和菜单 -->
        <el-header class="header">
            <div class="header-title">
                <el-menu mode="horizontal" :ellipsis="false">
                    <el-sub-menu index="1">
                        <template #title>对话名称</template>
                        <el-menu-item index="1-1">修改名称</el-menu-item>
                        <el-menu-item index="1-2">分享对话</el-menu-item>
                        <el-menu-item index="1-3">删除对话</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>
        </el-header>

        <!-- 中间聊天内容 -->
        <el-main class="chat-content">
            <div class="chat-message">这是聊天内容区，可以动态显示聊天信息。</div>
        </el-main>

        <!-- 底部输入框 -->
        <el-footer style="margin-left: auto; margin-right: auto; height: 15vh;">
            <el-card class="input-card">
                <div class="footer">
                    <el-input 
                    v-model="inputMessage" 
                    placeholder="请输入内容" 
                    class="chat-input"
                    :rows="2"
                    type="textarea"                
                    @keyup.enter="sendMessage" />
                    <el-button type="primary" @click="sendMessage" class="send-button">发送</el-button>
                </div>
            </el-card>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts" name="ChatPage">
import { ref } from "vue";

const inputMessage = ref("");

const sendMessage = () => {
    console.log("发送消息:", inputMessage.value);
    // 这里可以加入消息发送的逻辑
    inputMessage.value = ""; // 清空输入框
};
// background-color: #f5f5f5;
</script>

<style scoped>

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    position: relative;
}

.header-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 20px;
    font-weight: bold;
}

.chat-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.chat-message {
    margin: 10px 0;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.footer {
    display: flex;
    gap: 10px;
    align-items: center;
}

.chat-input {
    flex: 1;
    margin-right: 10px;
}

.input-card {
    border-radius: 20px;
    width: 60vw;
}
.container{
    display: flex;
    height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #f1f6ff;
}
:deep(.el-textarea__inner) {
    box-shadow: none;
    resize: none;
}
</style>