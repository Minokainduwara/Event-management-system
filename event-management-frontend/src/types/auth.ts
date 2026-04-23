export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    role: string;
}