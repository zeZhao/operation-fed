declare global {
    interface Res {
        code: string;
        message: string;
        data?: any;
    }
}

export {Res};