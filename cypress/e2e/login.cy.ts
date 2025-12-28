describe('Login Flow', () => {
    beforeEach(() => {
        // Intercept the API call for login and provide a mock response
        cy.intercept('POST', '**/api/auth/login', {
            statusCode: 200,
            body: {
                token: 'fake-e2e-token',
                user: {
                    id: 'e2e-user-id',
                    email: 'test@example.com',
                    first_name: 'E2E',
                    last_name: 'User',
                    roles: ['client'],
                },
            },
        }).as('loginRequest');

        // Intercept the profile fetch call that happens on load
        cy.intercept('GET', '**/api/auth/profile', {
            statusCode: 401,
            body: { error: 'Not authenticated' },
        }).as('getProfile');
    });

    it('should allow a user to log in and redirect to the dashboard', () => {
        // Visit the login page
        cy.visit('/login');

        // Wait for the initial profile fetch to fail
        cy.wait('@getProfile');

        // Fill in the form
        cy.get('input[id="email"]').type('test@example.com');
        cy.get('input[id="password"]').type('password123');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for the login API call to be made
        cy.wait('@loginRequest');

        // Assert that the URL has changed - it should be the home page (dashboard)
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should show an error message on failed login', () => {
        // Override the intercept for this specific test
        cy.intercept('POST', '**/api/auth/login', {
            statusCode: 401,
            body: { error: 'Invalid credentials' },
        }).as('failedLoginRequest');

        cy.visit('/login');

        cy.get('input[id="email"]').type('wrong@example.com');
        cy.get('input[id="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        cy.wait('@failedLoginRequest');

        // Assert that the error message is visible
        cy.get('.bg-red-600\/20').should('contain.text', 'Invalid credentials');
        cy.url().should('not.include', '/dashboard');
    });
});
