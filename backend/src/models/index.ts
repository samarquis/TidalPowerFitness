// Export all database models
export { default as User } from './User';
export { default as TrainerProfile } from './TrainerProfile';
export { default as Appointment } from './Appointment';
export { default as Payment } from './Payment';
export { default as Form } from './Form';

// Export types
export type { User as UserType, CreateUserInput, UpdateUserInput } from './User';
export type { TrainerProfile as TrainerProfileType, CreateTrainerProfileInput, UpdateTrainerProfileInput } from './TrainerProfile';
export type { Appointment as AppointmentType, CreateAppointmentInput, UpdateAppointmentInput, AppointmentStatus } from './Appointment';
export type { Payment as PaymentType, CreatePaymentInput, UpdatePaymentInput, PaymentStatus } from './Payment';
export type { Form as FormType, CreateFormInput } from './Form';
