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
        const timeout = 15000; // 15 seconds timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const headers: any = {
            'Content-Type': 'application/json',
            'X-TPF-Request': 'true',
            ...options.headers,
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers,
                credentials: 'include', // Send cookies with request
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Global error handling for authentication/authorization
            if (response.status === 401) {
                // Unauthorized - clear auth and redirect to login
                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    const currentSearch = window.location.search;
                    const fullPath = currentPath + currentSearch;
                    
                    if (currentPath !== '/login') {
                        // Include redirect parameter if not already on login page
                        window.location.href = `/login?redirect=${encodeURIComponent(fullPath)}`;
                    }
                }
                return { error: 'Unauthorized - please log in' };
            }

            if (response.status === 403) {
                // Forbidden - user doesn't have permission
                return { error: 'You do not have permission to perform this action' };
            }

            if (response.status === 204) {
                return { data: {} as T };
            }

            const data = await response.json();

            if (!response.ok) {
                return { error: data.error || 'Request failed' };
            }

            return { data };
        } catch (error: any) {
            if (error.name === 'AbortError') {
                return { error: 'Request timed out. Please check your connection.' };
            }
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

    async post<T>(endpoint: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            ...options,
        });
    }

    async getAllUsers() {
        return this.request<any>('/users', { method: 'GET' });
    }

    async addUserRole(userId: string, role: string) {
        return this.request<any>(`/users/${userId}/roles`, {
            method: 'POST',
            body: JSON.stringify({ role }),
        });
    }

    async removeUserRole(userId: string, role: string) {
        return this.request<any>(`/users/${userId}/roles/${role}`, { method: 'DELETE' });
    }

    async toggleUserActivation(userId: string, is_active: boolean) {
        return this.request<any>(`/users/${userId}/activate`, {
            method: 'PATCH',
            body: JSON.stringify({ is_active }),
        });
    }

    async resetUserPassword(userId: string, password: string) {
        return this.request<any>(`/users/${userId}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ password }),
        });
    }

    async impersonateUser(userId: string) {
        return this.request<{ token: string; user: any }>(`/users/${userId}/impersonate`, {
            method: 'POST',
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

    async getMyClasses() {
        return this.request<any>('/trainers/my-classes', { method: 'GET' });
    }

    async getClassAttendees(classId: string, date?: string) {
        const query = date ? `?date=${date}` : '';
        return this.request<any>(`/classes/${classId}/attendees${query}`, { method: 'GET' });
    }

    async getMyClients() {
        return this.request<any>('/trainers/my-clients', { method: 'GET' });
    }

    async getClientWorkouts(clientId: string) {
        return this.request<any>(`/trainers/clients/${clientId}/workouts`, { method: 'GET' });
    }

    async getAttendanceReport(startDate?: string, endDate?: string) {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request<any[]>(`/trainers/reports/attendance${query}`, { method: 'GET' });
    }

    async getTrainerAnalytics() {
        return this.request<any>('/trainers/reports/analytics', { method: 'GET' });
    }

    // Form submission
    async submitForm(formData: { form_type: string; form_data: any }) {
        return this.request<any>('/forms', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
    }

    // Availability endpoints
    async getAvailability(trainerId: string) {
        return this.request<any>(`/availability/trainer/${trainerId}`, { method: 'GET' });
    }

    async createAvailability(data: any) {
        return this.request<any>('/availability', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateAvailability(id: string, data: any) {
        return this.request<any>(`/availability/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteAvailability(id: string) {
        return this.request<any>(`/availability/${id}`, { method: 'DELETE' });
    }

    // Exercise endpoints
    async getExercises() {
        return this.request<any>('/exercises', { method: 'GET' });
    }

    async getAIRecommendations() {
        return this.request<any[]>('/exercises/recommendations', { method: 'GET' });
    }

    async getWorkoutTypes() {
        return this.request<any>('/exercises/workout-types', { method: 'GET' });
    }

    async getBodyFocusAreas() {
        return this.request<any>('/exercises/body-focus-areas', { method: 'GET' });
    }

    // Workout Template endpoints

    async getWorkoutTemplates(includePublic: boolean = true) {
        return this.request<any>(`/workout-templates?include_public=${includePublic}`, { method: 'GET' });
    }

    async getWorkoutTemplate(id: string) {
        return this.request<any>(`/workout-templates/${id}`, { method: 'GET' });
    }

    async createWorkoutTemplate(data: any) {
        return this.request<any>('/workout-templates', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateWorkoutTemplate(id: string, data: any) {
        return this.request<any>(`/workout-templates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteWorkoutTemplate(id: string) {
        return this.request<any>(`/workout-templates/${id}`, { method: 'DELETE' });
    }

    async copyWorkoutTemplate(id: string, newName?: string) {
        return this.request<any>(`/workout-templates/${id}/copy`, {
            method: 'POST',
            body: JSON.stringify({ new_name: newName }),
        });
    }

    // Program endpoints
    async getPublicPrograms() {
        return this.request<any[]>('/programs/public', { method: 'GET' });
    }

    async getPrograms(includePublic: boolean = true) {
        return this.request<any[]>(`/programs?include_public=${includePublic}`, { method: 'GET' });
    }

    async getProgram(id: string) {
        return this.request<any>(`/programs/${id}`, { method: 'GET' });
    }

    async createProgram(data: any) {
        return this.request<any>('/programs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async assignProgram(data: { client_id: string; program_id: string; start_date?: string; notes?: string }) {
        return this.request<any>('/programs/assign', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMyActiveProgram() {
        return this.request<any>('/programs/my-active', { method: 'GET' });
    }

    async getClientActiveProgram(clientId: string) {
        return this.request<any>(`/programs/active/${clientId}`, { method: 'GET' });
    }

    // Challenge endpoints
    async getChallenges() {
        return this.request<any[]>('/challenges', { method: 'GET' });
    }

    async getChallenge(id: string) {
        return this.request<any>(`/challenges/${id}`, { method: 'GET' });
    }

    async joinChallenge(id: string) {
        return this.request<any>(`/challenges/${id}/join`, { method: 'POST' });
    }

    async createChallenge(data: any) {
        return this.request<any>('/challenges', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Workout Session endpoints
    async getWorkoutSessions() {
        return this.request<any>('/workout-sessions', { method: 'GET' });
    }

    async getWorkoutSession(id: string) {
        return this.request<any>(`/workout-sessions/${id}`, { method: 'GET' });
    }

    async getSessionSummary(id: string) {
        return this.request<any>(`/workout-sessions/${id}/summary`, { method: 'GET' });
    }

    async createWorkoutSession(data: any) {
        return this.request<any>('/workout-sessions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateWorkoutSession(id: string, data: any) {
        return this.request<any>(`/workout-sessions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getClientStats(clientId: string) {
        return this.request<any>(`/workout-sessions/client/${clientId}/stats`, { method: 'GET' });
    }

    async getClientHistory(clientId: string) {
        return this.request<any[]>(`/workout-sessions/client/${clientId}/history`, { method: 'GET' });
    }

    async getExerciseHistory(clientId: string, exerciseId: string) {
        return this.request<any[]>(`/workout-sessions/client/${clientId}/history/${exerciseId}`, { method: 'GET' });
    }

    async logExercise(data: any) {
        return this.request<any>('/workout-sessions/log-exercise', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getSessionLogs(sessionId: string) {
        return this.request<any>(`/workout-sessions/${sessionId}/logs`, { method: 'GET' });
    }

    async bulkLogExercises(logs: any[]) {
        return this.request<any>('/workout-sessions/log-exercises/bulk', {
            method: 'POST',
            body: JSON.stringify({ logs }),
        });
    }

    // Progress endpoints
    async logMetric(data: any) {
        return this.request<any>('/progress/metrics', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMetrics(clientId?: string) {
        const endpoint = clientId ? `/progress/metrics/${clientId}` : '/progress/metrics';
        return this.request<any[]>(endpoint, { method: 'GET' });
    }

    async getPersonalRecords(clientId?: string) {
        const endpoint = clientId ? `/progress/personal-records/${clientId}` : '/progress/personal-records';
        return this.request<any[]>(endpoint, { method: 'GET' });
    }

    async getExerciseBest(exerciseId: string, clientId?: string) {
        const query = clientId ? `?clientId=${clientId}` : '';
        return this.request<any>(`/progress/exercise-best/${exerciseId}${query}`, { method: 'GET' });
    }

    async getVolumeTrend(clientId?: string) {
        const endpoint = clientId ? `/progress/volume-trend/${clientId}` : '/progress/volume-trend';
        return this.request<any[]>(endpoint, { method: 'GET' });
    }

    // Leaderboard endpoints
    async getVolumeLeaderboard(period: string = 'month') {
        return this.request<any[]>(`/leaderboard/volume?period=${period}`, { method: 'GET' });
    }

    async getAttendanceLeaderboard(period: string = 'month') {
        return this.request<any[]>(`/leaderboard/attendance?period=${period}`, { method: 'GET' });
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

    async getRevenueReport() {
        return this.request<any>('/admin/reports/revenue', { method: 'GET' });
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

    async checkoutCart() {
        return this.request<any>('/payments/checkout-cart', {
            method: 'POST',
        });
    }

    async confirmMockPayment(payload: { packageId?: string | null; items?: any[] }) {
        return this.request<any>('/payments/confirm-mock', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    // Credits endpoints
    async getUserCredits(userId: string) {
        return this.request<any>(`/users/${userId}/credits`, { method: 'GET' });
    }

    // Class endpoints
    async getClasses() {
        return this.request<any>('/classes', { method: 'GET' });
    }

    async getClassesByDay(dayOfWeek: number) {
        return this.request<any>(`/assignments/classes?day_of_week=${dayOfWeek}`, { method: 'GET' });
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
    async bookClass(classId: string, targetDate?: string) {
        return this.request<any>('/bookings', {
            method: 'POST',
            body: JSON.stringify({
                class_id: classId,
                target_date: targetDate
            }),
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
        return this.request<any>(`/achievements/${userId}`, { method: 'GET' });
    }

    async getAllAchievements() {
        return this.request<any>('/achievements', { method: 'GET' });
    }

    // Notification endpoints
    async getUnreadNotifications() {
        return this.request<any[]>('/notifications/unread', { method: 'GET' });
    }

    async markNotificationRead(id: string) {
        return this.request<any>(`/notifications/${id}/read`, { method: 'POST' });
    }

    // Changelog endpoints
    async getChangelogs() {
        return this.request<any>('/changelog', { method: 'GET' });
    }

    async createChangelog(data: any) {
        return this.request<any>('/changelog', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateChangelog(id: string, data: any) {
        return this.request<any>(`/changelog/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteChangelog(id: string) {
        return this.request<any>(`/changelog/${id}`, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
