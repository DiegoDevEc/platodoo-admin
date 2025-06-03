export interface SocialLogin {
    token: string;
    provider: string;
    platform?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
}
