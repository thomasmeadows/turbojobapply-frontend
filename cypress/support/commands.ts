Cypress.Commands.add('login', (email, roles = ['user']) => {
  cy.intercept('POST', '/api/auth/send-magic-link', { statusCode: 200, body: { success: true } }).as('magicLink');
  cy.intercept('GET', '/api/auth/profile', {
    statusCode: 200,
    body: {
      id: 'test-user-id',
      email,
      roles,
    },
  }).as('profile');
});
