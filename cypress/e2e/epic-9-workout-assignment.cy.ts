describe('Epic 9: Workout Assignment UX Overhaul', () => {
  const login = (email, password) => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    
    // Check for error message
    cy.get('body').then(($body) => {
        if ($body.find('.text-red-500').length > 0) {
            cy.log('Login Error Found: ' + $body.find('.text-red-500').text());
        }
    });

    // Wait for redirect to dashboard - check for either /trainer or /admin
    cy.location('pathname', { timeout: 10000 }).should('match', /\/(trainer|admin)/);
  };

  beforeEach(() => {
    // Login as a trainer (Lisa)
    login('lisa.baumgard@tidalpower.com', 'admin123'); 
  });

  it('should navigate through the new assignment wizard order: Recipients -> Date -> Workout -> Review', () => {
    // Navigate to Assign Workout page
    cy.visit('/workouts/assign');

    // --- Step 1: Recipients ---
    // Verify we start at Recipient step
    cy.contains('Recipients').should('have.class', 'text-turquoise-surf');
    // "Date & Time" should NOT be highlighted yet
    cy.contains('Date & Time').should('have.class', 'text-gray-600');

    // Default is "Class" mode, verify
    cy.contains('Select Class').should('be.visible');
    
    // Switch to "Individual" mode
    cy.contains('Individual').click();
    cy.contains('Select Clients').should('be.visible');
    
    // Select the first client available - wait for it to appear
    cy.get('input[type="checkbox"]', { timeout: 10000 }).should('exist').first().check();
    
    // Verify selection count updated
    cy.contains('Select Clients * (1)').should('be.visible');
    
    cy.contains('button', 'Next').click();

    // --- Step 2: Date & Time ---
    cy.contains('Date & Time').should('have.class', 'text-turquoise-surf');
    cy.contains('Session Date').should('be.visible');
    
    // Fill in date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    cy.get('input[type="date"]').type(dateStr);
    
    cy.contains('button', 'Next').click();

    // --- Step 3: Session Builder ---
    cy.contains('Session Builder').should('have.class', 'text-turquoise-surf');
    cy.contains('Use Template').should('be.visible');
    
    // Select a template (We made "Today" public in 9.3)
    // Wait for templates to load
    cy.contains('Today', { timeout: 10000 }).click();
    
    cy.contains('button', 'Next').click();

    // --- Step 4: Review ---
    cy.contains('Review').should('have.class', 'text-turquoise-surf');
    cy.contains('Summary').should('be.visible');
    
    // Verify summary details
    cy.contains('Assigned To').parent().should('contain', 'Individual Client');
    cy.contains('Date & Time').parent().should('contain', new Date(dateStr).toLocaleDateString()); 
    cy.contains('Template:').parent().should('contain', 'Today');

    // Submit
    cy.contains('button', 'Confirm Assignment').click();

    // --- Mission Accomplished ---
    cy.contains('Mission Accomplished', { timeout: 10000 }).should('be.visible');
    cy.contains('Return to Dashboard').should('be.visible');
  });
});