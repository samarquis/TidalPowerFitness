const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

class ApiClient {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        // Load token from localStorage if available
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const headers: any = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return { error: data.error || 'Request failed' };
            }

            return { data };
        } catch (error) {
            return { error: 'Network error' };
        }
    }

    // Auth endpoints
    async register(userData: {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        phone?: string;
        role?: string;
    }) {
        return this.request<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(email: string, password: string) {
        return this.request<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async getProfile() {
        return this.request<any>('/auth/profile', { method: 'GET' });
    }

    async updateProfile(data: { first_name?: string; last_name?: string; phone?: string }) {
        return this.request<any>('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Trainer endpoints
    async getTrainers() {
        return this.request<any>('/trainers', { method: 'GET' });
    }

    async getTrainer(userId: string) {
        return this.request<any>(`/trainers/${userId}`, { method: 'GET' });
    }

    // Form submission
    async submitForm(formData: { form_type: string; form_data: any }) {
        return this.request<any>('/forms', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
