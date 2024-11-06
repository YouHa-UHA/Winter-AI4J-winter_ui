// src/hooks/useSendMsg.ts
import { ref } from 'vue';
import * as chatApi from '../api/chatApi';
import type { GptMsg } from '@/utils/types';
import { useChatStore } from '@/stores/chat';

export interface QuestionInf {
    chatId: string;
    appIndex: string;
    question: string;
}

export class StreamMsg {
    private onStart: (prompt: string) => void;
    private onDone: () => void;
    private onPatch: (text: string) => void;
    private abortController: AbortController | null = null;

    constructor(options: {
        onStart: (prompt: string) => void,
        onDone: () => void,
        onPatch: (text: string) => void
    }) {
        this.onStart = options.onStart;
        this.onPatch = options.onPatch;
        this.onDone = options.onDone;
    }

    // 提供中止流的方法
    abortStream() {
        if (this.abortController) {
            this.abortController.abort();
            console.log('用户已中止流');
        }
    }

    getChatMsgStream(param: QuestionInf, streaming = false) {
        this.onStart(param.question);
        this.abortController = new AbortController();

        fetch('/winter/chat/question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(param),
            signal: this.abortController.signal
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应错误');
                }
                return response.body;
            })
            .then(stream => {
                if (!stream) {
                    throw new Error('未找到流');
                }
                const reader = stream.getReader();

                const readChunk = () => {
                    reader.read().then(({ value, done }) => {
                        if (done) {
                            this.onDone();
                            console.log('流读取完毕');
                            return;
                        }

                        const textList = new TextDecoder().decode(value).split('data:').filter(chunk => chunk.trim() !== "");

                        textList.forEach(text => {
                            const cleanedText = text.trim();

                            if (cleanedText) {
                                try {
                                    const parsed = JSON.parse(cleanedText);

                                    if (parsed && parsed.answer != null && parsed.answer !== "") {
                                        this.onPatch(parsed.answer);
                                    }
                                } catch (error) {
                                    console.error('JSON解析失败:', cleanedText, error);
                                }
                            } else {
                                console.log('接收到空或无效数据块');
                            }
                        });

                        setTimeout(readChunk, 30);
                    }).catch(error => {
                        if (error.name === 'AbortError') {
                            console.log('流读取被中止');
                        } else {
                            console.error('读取流时出错:', error);
                        }
                    });
                };
                readChunk();
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.log('请求被中止');
                } else {
                    console.error('错误:', error);
                }
            });
    }
}

export const useSendMsg = () => {
    const chatStore = useChatStore(); // 在函数内部初始化 store
    const streamingText = ref('');
    const streaming = ref(false);
    const follow = ref<string[]>([]);
    const param = ref<QuestionInf>();

    const gpt = new StreamMsg({
        onStart: (prompt: string) => {
            console.log('开始发送消息');
            follow.value = [];
            streaming.value = true;
            // 直接操作 store 的 msgList
            chatStore.msgList.push({
                role: 'user',
                content: prompt
            });
        },
        onDone: async () => {
            streaming.value = false;
            chatStore.msgList.push({
                role: 'assistant',
                content: streamingText.value
            });
            streamingText.value = '';
            console.log(param.value);
            // 发送联想请求
            try {
                const data = await chatApi.getFollow(param.value!);
                follow.value = data.data.follow;
                console.log(follow.value);
            } catch (error) {
                console.error('获取联想请求失败:', error);
            }
        },
        onPatch: (text: string) => {
            streamingText.value += text;
        }
    });

    const stream = (prompt: QuestionInf) => {
        param.value = prompt;
        gpt.getChatMsgStream(prompt);
    };

    const abortStream = () => {
        streaming.value = false;
        chatStore.msgList.push({
            role: 'assistant',
            content: streamingText.value
        });
        streamingText.value = '';
        gpt.abortStream();
    };

    return {
        streamingText,
        streaming,
        stream,
        abortStream,
        follow
    };
};
