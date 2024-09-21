import request from '@/utils/request';
export const getChatId = (params: any) => {
    return request({
        url: '/system/chat/create',
        method: 'post',
        data: params
    })
}