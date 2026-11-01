
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresInSeconds: number;
}

export interface CurrentUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

