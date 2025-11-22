// Acuity Scheduling API Client
// Documentation: https://developers.acuityscheduling.com/

const ACUITY_USER_ID = process.env.ACUITY_USER_ID || '';
const ACUITY_API_KEY = process.env.ACUITY_API_KEY || '';
const ACUITY_BASE_URL = 'https://acuityscheduling.com/api/v1';

class AcuityClient {
    private auth: string;

    constructor() {
        // Basic Auth: base64(userId:apiKey)
        const credentials = `${ACUITY_USER_ID}:${ACUITY_API_KEY}`;
        this.auth = Buffer.from(credentials).toString('base64');
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        if (!ACUITY_USER_ID || !ACUITY_API_KEY) {
            console.warn('Acuity credentials not configured - using mock data');
            return this.getMockData(endpoint);
        }

        try {
            const response = await fetch(`${ACUITY_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Authorization': `Basic ${this.auth}`,
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`Acuity API error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Acuity API request failed:', error);
            throw error;
        }
    }

    // Mock data for development/testing
    private getMockData(endpoint: string) {
        if (endpoint.includes('/appointments')) {
            return {
                appointments: [
                    {
                        id: 'mock-1',
                        datetime: new Date(Date.now() + 86400000).toISOString(),
                        duration: 60,
                        appointmentTypeID: 1,
                        calendarID: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@example.com',
                        phone: '555-1234',
                    },
                ],
            };
        }
        if (endpoint.includes('/appointment-types')) {
            return [
                { id: 1, name: 'Personal Training Session', duration: 60, price: 100 },
                { id: 2, name: 'Initial Consultation', duration: 30, price: 0 },
                { id: 3, name: 'Group Class', duration: 45, price: 25 },
            ];
        }
        if (endpoint.includes('/calendars')) {
            return [
                { id: 1, name: 'Trainer 1', timezone: 'America/New_York' },
                { id: 2, name: 'Trainer 2', timezone: 'America/New_York' },
            ];
        }
        return null;
    }

    // Get all appointments
    async getAppointments(params?: {
        minDate?: string;
        maxDate?: string;
        calendarID?: number;
    }) {
        const queryParams = new URLSearchParams(params as any).toString();
        return this.request(`/appointments?${queryParams}`);
    }

    // Get appointment by ID
    async getAppointment(appointmentId: string) {
        return this.request(`/appointments/${appointmentId}`);
    }

    // Get available times
    async getAvailability(params: {
        appointmentTypeID: number;
        calendarID?: number;
        month?: string; // YYYY-MM
    }) {
        const queryParams = new URLSearchParams(params as any).toString();
        return this.request(`/availability/times?${queryParams}`);
    }

    // Get appointment types
    async getAppointmentTypes() {
        return this.request('/appointment-types');
    }

    // Get calendars
    async getCalendars() {
        return this.request('/calendars');
    }

    // Create appointment
    async createAppointment(data: {
        appointmentTypeID: number;
        datetime: string;
        calendarID?: number;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        notes?: string;
    }) {
        return this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Cancel appointment
    async cancelAppointment(appointmentId: string) {
        return this.request(`/appointments/${appointmentId}/cancel`, {
            method: 'PUT',
        });
    }

    // Reschedule appointment
    async rescheduleAppointment(appointmentId: string, datetime: string) {
        return this.request(`/appointments/${appointmentId}/reschedule`, {
            method: 'PUT',
            body: JSON.stringify({ datetime }),
        });
    }
}

export const acuityClient = new AcuityClient();
export default acuityClient;
