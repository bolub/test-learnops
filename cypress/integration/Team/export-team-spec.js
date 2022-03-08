describe('Export Teams Button on Teams List Page', () => {
  let constants, team;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('team').then((content) => (team = content));
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
    cy.interceptApiRequests();
  });

  it('Checks if export button exists', () => {
    const { routes, api } = constants;
    const { selectors, stubbedTeam } = team;
    cy.intercept('GET', api.ldTeams, stubbedTeam).as('teams');
    cy.visit(routes.teams);
    cy.wait('@teams').then((response) => {
      expect(response.response.body.code).to.equal(200);
    });
    cy.get(selectors.exportTeamsButton)
      .scrollIntoView()
      .should('be.visible')
      .should('be.disabled')
      .first()
      .should('have.text', 'Export');

    cy.get(selectors.tableRow.replace('$', '1')).within(() => {
      cy.get('input').click();
    });

    cy.intercept('POST', api.exportRequest, {
      statusCode: 200,
      body: { code: 200, data: { fileLocation: '' } },
    }).as('export');

    cy.get(selectors.exportTeamsButton)
      .scrollIntoView()
      .should('be.visible')
      .should('not.be.disabled')
      .first()
      .should('have.text', 'Export')
      .click();

    cy.wait('@export').then((response) => {
      expect(response.response.body.code).to.equal(200);
    });
  });
});
