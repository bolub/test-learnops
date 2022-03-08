let selector;
describe('View Team Member', () => {
  before('Load Fixtures', () => {
    cy.fixture('team').then((content) => (selector = content));
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
    cy.signIn();
  });

  it('checks if members of user team is visible', () => {
    const { selectors, routes, stubbedTeam } = selector;
    cy.intercept(routes.teamApi, stubbedTeam).as('teams');
    cy.visit(routes.base);
    cy.wait('@teams').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
    });
    cy.contains(selectors.employmentType).should('be.visible');
    cy.contains(selectors.teamMember).should('be.visible');
    cy.contains(selectors.hourlyRate).should('be.visible');
    cy.contains(selectors.jobTitle).should('be.visible');
    cy.contains(selectors.country).should('be.visible');
  });
});
