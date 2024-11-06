import service from '@/utils/service';

class UnauthenticatedError extends Error {
    constructor(message = '未登录 或登录已过期') {
        super(message);
        this.name = 'UnauthenticatedError';
    }
}

const request = (option: any) => {
    const { url, method, params, data, headersType, responseType, ...config } = option;
    return service({
        url: url,
        method: method,
        params: params,
        data: data,
        ...config,
        responseType: responseType,
        headers: {
            'Content-Type': headersType || 'application/json;charset=utf-8',
        },
    });
};

// 定义请求方法
export default {
    // GET 请求
    get: async <T = any>(option: any) => {
        const res = await request({ method: 'GET', ...option });
        return res.data as T;
    },

    // POST 请求
    post: async <T = any>(option: any) => {
        const res = await request({ method: 'POST', ...option });
        return res.data as T;
    },

    // POST 请求（原始数据）
    postOriginal: async <T = any>(option: any) => {
        const res = await request({ method: 'POST', ...option });
        return res;
    },

    // DELETE 请求
    del: async <T = any>(option: any) => { // 将 delete 改为 del
        const res = await request({ method: 'DELETE', ...option });
        return res.data as T;
    },

    // PUT 请求
    put: async <T = any>(option: any) => {
        const res = await request({ method: 'PUT', ...option });
        return res.data as T;
    },

    // 下载文件
    download: async <T = any>(option: any) => {
        const res = await request({ method: 'GET', responseType: 'blob', ...option });
        return res as unknown as T;
    },

    // 多文件下载
    multiDownload: async <T = any>(option: any) => {
        const res = await request({ method: 'POST', responseType: 'blob', ...option });
        return res as unknown as T;
    },

    // 上传文件
    upload: async <T = any>(option: any) => {
        option.headersType = 'multipart/form-data';
        const res = await request({ method: 'POST', ...option });
        return res as unknown as T;
    }
};

