// src/stores/chat.ts
import { defineStore } from 'pinia';
import type { GptMsg } from '@/utils/types';
import type { QuestionInf } from '@/hooks/useSendMsg';
import { StreamMsg } from '@/hooks/useSendMsg'; // 直接导入 StreamMsg 类
import * as chatApi from '../api/chatApi';

export const useChatStore = defineStore('chat', {
    state: () => ({
        msgList: [] as GptMsg[],         // 聊天消息列表
        streamingText: '',               // 当前流式接收的内容
        streaming: false,                // 是否正在接收流
        streamInstance: null as StreamMsg | null, // 存储 StreamMsg 实例
        follow: [] as string[]           // 联想请求结果
    }),
    actions: {
        setMsgList(messages: GptMsg[]) {
            this.msgList = messages;
        },
        clearMsgList() {
            this.msgList = [];
        },
        startStream(param: QuestionInf) {
            this.follow = []; // 开始新的流时清空联想结果

            // 如果已经有一个流在进行，先终止它
            if (this.streaming && this.streamInstance) {
                this.endStream();
            }

            // 创建新的 StreamMsg 实例并赋值给 streamInstance
            this.streamInstance = new StreamMsg({
                onStart: (prompt: string) => {
                    this.streamingText = ''; // 清空之前的流内容
                    this.streaming = true;
                    this.msgList.push({ role: 'user', content: prompt });
                },
                onPatch: (text: string) => {
                    this.streamingText += text;
                },
                onDone: async () => {
                    this.streaming = false;
                    this.msgList.push({ role: 'assistant', content: this.streamingText });
                    this.streamingText = '';

                    // 发送联想请求
                    try {
                        const data = await chatApi.getFollow(param);
                        this.follow = data.data.follow; // 更新联想结果
                        console.log(this.follow);
                    } catch (error) {
                        console.error('获取联想请求失败:', error);
                    }
                }
            });

            // 开始流
            this.streamInstance.getChatMsgStream(param);
        },
        endStream() {
            if (this.streamInstance) {
                // 停止流式接收并将已有内容存储到 msgList
                if (this.streaming) {
                    this.msgList.push({
                        role: 'assistant',
                        content: this.streamingText,
                    });
                    this.streamingText = '';
                    this.streaming = false;
                }
                this.streamInstance.abortStream();
                this.streamInstance = null; // 清空实例
            }
        },
    },
});
