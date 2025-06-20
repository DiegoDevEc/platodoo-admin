export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    status?: string;
    platform?: string;
    password?:string;
    roles?: string[];
    provider?:string;
}
