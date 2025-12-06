const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

class ApiClient {
    private baseURL: string;
    private token: string | null = null; // Keeping property for compatibility, but unused for auth headers

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    setToken(token: string | null) {
        this.token = token;
        // No longer storing token in localStorage or managing it manually
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const headers: any = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers,
                credentials: 'include', // Send cookies with request
            });

            if (response.status === 204) {
                return { data: {} as T };
            }

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

    async logout() {
        return this.request<any>('/auth/logout', { method: 'POST' });
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

    async getTrainerUsers() {
        return this.request<any>('/trainers/users', { method: 'GET' });
    }

    async getTrainer(userId: string) {
        return this.request<any>(`/trainers/${userId}`, { method: 'GET' });
    }

    async createTrainer(trainerData: {
        first_name: string;
        last_name: string;
        email: string;
        password?: string;
        phone?: string;
        bio?: string;
        specialties?: string[];
        certifications?: string[];
        years_experience?: number;
        profile_image_url?: string;
        acuity_calendar_id?: string;
        is_accepting_clients?: boolean;
    }) {
        return this.request<any>('/trainers', {
            method: 'POST',
            body: JSON.stringify(trainerData),
        });
    }

    async updateTrainer(userId: string, trainerData: any) {
        return this.request<any>(`/trainers/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(trainerData),
        });
    }

    // Form submission
    async submitForm(formData: { form_type: string; form_data: any }) {
        return this.request<any>('/forms', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
    }

    // Package endpoints
    async getPackages() {
        return this.request<any>('/packages', { method: 'GET' });
    }

    // Migration endpoints
    async getMigrationStatus() {
        return this.request<any>('/admin/migrate/status', { method: 'GET' });
    }

    async runMigrations() {
        return this.request<any>('/admin/migrate', { method: 'POST' });
    }

    // Cart endpoints
    async getCart() {
        return this.request<any>('/cart', { method: 'GET' });
    }

    async addToCart(packageId: string, quantity: number = 1) {
        return this.request<any>('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ package_id: packageId, quantity }),
        });
    }

    async updateCartItem(itemId: string, quantity: number) {
        return this.request<any>(`/cart/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    }

    async removeFromCart(itemId: string) {
        return this.request<any>(`/cart/items/${itemId}`, { method: 'DELETE' });
    }

    async clearCart() {
        return this.request<any>('/cart', { method: 'DELETE' });
    }

    // Credits endpoints
    async getUserCredits(userId: string) {
        return this.request<any>(`/users/${userId}/credits`, { method: 'GET' });
    }

    // Class endpoints
    async getClasses() {
        return this.request<any>('/classes', { method: 'GET' });
    }

    async createClass(classData: any) {
        return this.request<any>('/classes', {
            method: 'POST',
            body: JSON.stringify(classData)
        });
    }

    async updateClass(classId: string, data: any) {
        return this.request<any>(`/classes/${classId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteClass(classId: string) {
        return this.request<any>(`/classes/${classId}`, { method: 'DELETE' });
    }

    // Booking endpoints
    async bookClass(classId: string) {
        return this.request<any>('/bookings', {
            method: 'POST',
            body: JSON.stringify({ class_id: classId }),
        });
    }

    async getUserBookings(userId: string) {
        return this.request<any>(`/bookings/user/${userId}`, { method: 'GET' });
    }

    async cancelBooking(bookingId: string) {
        return this.request<any>(`/bookings/${bookingId}`, { method: 'DELETE' });
    }

    // Achievement endpoints
    async getUserAchievements(userId: string) {
        return this.request<any>(`/users/${userId}/achievements`, { method: 'GET' });
    }

    async getAllAchievements() {
        return this.request<any>('/achievements', { method: 'GET' });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
