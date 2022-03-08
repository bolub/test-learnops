describe('View Users', () => {
  let users, constants;

  before('Load Fixtures', () => {
    cy.fixture('user').then((content) => (users = content));
    cy.fixture('constants').then((content) => (constants = content));
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      'refreshToken',
      'clockDrift',
      'username',
      'connect.sid',
      'csrf-token',
      'jwtToken'
    );
    cy.signInLD();
  });

  it('admin views all users', () => {
    const { selectors, allUsers } = users;
    const { api, routes } = constants;
    cy.intercept(api.usersApi, allUsers).as('users');
    cy.visit(routes.settings);
    cy.wait('@users').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
    });
    cy.contains(selectors.userName).should('be.visible');
    cy.contains(selectors.userType).should('be.visible');
    cy.contains(selectors.team).should('be.visible');
    cy.contains(selectors.jobTitle).should('be.visible');
    cy.contains(selectors.employmentType).should('be.visible');
    cy.contains(selectors.location).should('be.visible');
    cy.contains(selectors.hourlyRate).should('be.visible');
    cy.contains(selectors.status).should('be.visible');
  });
});
