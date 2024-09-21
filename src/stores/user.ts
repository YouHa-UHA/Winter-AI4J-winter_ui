import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
    //真正存储数据的地方
    state: (): {
        token?: string;
        chatId: string;
        name: string;
        avatar: string;
        roles: any[];
        permissions: string[];
    } => ({
        token: '',
        chatId: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
    }),
    actions: {
        updateName(name: string) {
            this.name = name;
        },
    },
});