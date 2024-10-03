import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
    //真正存储数据的地方
    state: (): {
        token?: string;
        loginId: string;
        chatId: string;
        chat1stMsg: string;
        name: string;
        avatar: string;
        roles: any[];
        permissions: string[];
    } => ({
        token: '',
        loginId: '',
        chatId: '',
        chat1stMsg: '',
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