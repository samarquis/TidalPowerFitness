describe('Class Booking Flow', () => {
    beforeEach(() => {
        // Mock user profile
        cy.intercept('GET', '**/api/auth/profile', {
            statusCode: 200,
            body: {
                user: {
                    id: 'e2e-user-id',
                    email: 'test@example.com',
                    first_name: 'E2E',
                    last_name: 'User',
                    roles: ['client'],
                    credits: 5
                },
            },
        }).as('getProfile');

        // Mock classes
        cy.intercept('GET', '**/api/classes', {
            statusCode: 200,
            body: [
                {
                    id: 'class-123',
                    name: 'Morning HIIT',
                    description: 'High intensity interval training',
                    category: 'HIIT',
                    instructor_name: 'Scott Marquis',
                    day_of_week: new Date().getDay(),
                    start_time: '08:00',
                    duration_minutes: 45,
                    max_capacity: 20
                }
            ],
        }).as('getClasses');

        // Mock user credits
        cy.intercept('GET', '**/api/users/e2e-user-id/credits', {
            statusCode: 200,
            body: {
                credits: 5,
                details: []
            },
        }).as('getCredits');

        // Mock booking creation
        cy.intercept('POST', '**/api/bookings', {
            statusCode: 201,
            body: {
                message: 'Class booked successfully',
                booking: { id: 'booking-abc' }
            },
        }).as('bookClass');
    });

    it('should allow a user to view classes and book a spot', () => {
        cy.visit('/classes');
        cy.wait(['@getProfile', '@getClasses', '@getCredits']);

        // Check if class is visible
        cy.contains('Morning HIIT').should('be.visible');

        // Click book button
        cy.contains('Book for 1 Person').click();

        // Check if modal appears
        cy.contains('Confirm Class Booking').should('be.visible');
        cy.contains('Total Cost').should('contain', '1 Credit');

        // Confirm booking
        cy.contains('Book for 1').click();

        // Check for success message
        cy.wait('@bookClass');
        cy.contains('Class booked successfully').should('be.visible');
    });

    it('should allow booking for multiple people', () => {
        cy.visit('/classes');
        cy.wait(['@getProfile', '@getClasses', '@getCredits']);

        // Increment attendee count
        cy.get('button').contains('+').click();
        cy.contains('Book for 2 People').should('be.visible');

        // Click book button
        cy.contains('Book for 2 People').click();

        // Check modal values
        cy.contains('Total Cost').should('contain', '2 Credits');
        
        // Confirm booking
        cy.contains('Book for 2').click();

        cy.wait('@bookClass').its('request.body').should('deep.include', {
            attendee_count: 2
        });
    });
});
