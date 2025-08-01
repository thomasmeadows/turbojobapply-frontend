describe('Authorization', () => {
  it('should allow a user to log in with a magic link', () => {
    const email = 'test@example.com';

    cy.visit('/login');
    cy.get('input[name="email"').type(email);
    cy.get('button[type="submit"]').click();

    cy.contains('Check your email for a magic link to log in.').should(
      'be.visible'
    );
  });

  it('should redirect unauthenticated users from protected routes', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
    cy.contains('Please log in to access this page.').should('be.visible');
  });

  it('should allow admin users to access admin routes', () => {
    cy.login('admin@example.com', ['admin']);
    cy.visit('/employer-integrations');
    cy.url().should('include', '/employer-integrations');
    cy.contains('ATS Integration Requests').should('be.visible');
  });

  it('should redirect non-admin users from admin routes', () => {
    cy.login('user@example.com', ['user']);
    cy.visit('/employer-integrations');
    cy.url().should('not.include', '/employer-integrations');
    cy.contains('You are not authorized to access this page.').should(
      'be.visible'
    );
  });
});
