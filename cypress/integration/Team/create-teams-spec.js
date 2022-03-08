let organization, constants;
describe('Create LD team', () => {
  before('Load Fixtures', () => {
    cy.fixture('organization').then((content) => (organization = content));
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

  it('User can create LD teams', () => {
    const { selectors, orgMockData, newLDTeamMock } = organization;
    const { routes, api } = constants;
    cy.intercept(api.organization, orgMockData).as('organization');
    cy.visit(routes.settings);
    cy.wait('@organization');
    cy.get(selectors.organizationTab).should('be.visible').click();
    cy.get(selectors.learningTeamsTab).should('be.visible').click();
    cy.get(selectors.addLDTeam).should('be.visible').click();
    cy.get(selectors.addLDTeamModal).should('be.visible');
    cy.get(selectors.newLdTeamModal.name)
      .should('be.visible')
      .type('Team name');
    cy.get(selectors.newLdTeamModal.description)
      .should('be.visible')
      .type('Team description');
    cy.get(selectors.newLdTeamModal.parent).should('be.visible').click();
    cy.get(selectors.newLdTeamModal.parentOption).should('be.visible').click();
    cy.get(selectors.newLdTeamModal.manager).should('be.visible').click();
    cy.get(selectors.newLdTeamModal.managerOption)
      .should('be.visible')
      .find(`input[type='checkbox']`)
      .click();
    cy.get(selectors.newLdTeamModal.manager).should('be.visible').click();
    cy.intercept('POST', api.ldTeams, newLDTeamMock).as('newLDTeam');
    cy.get(selectors.newLdTeamModal.save).should('be.visible').click();
    cy.wait('@newLDTeam').then(() => {
      cy.get(selectors.newLdTeamModal.newTeamRow).should('be.visible');
    });
  });

  it('User can create business teams', () => {
    const { selectors, orgMockData, newBusinessMock } = organization;
    const { routes, api } = constants;
    cy.intercept(api.organization, orgMockData).as('organization');
    cy.visit(routes.settings);
    cy.wait('@organization');
    cy.get(selectors.organizationTab).should('be.visible').click();
    cy.get(selectors.businessTeamsTab).should('be.visible').click();
    cy.get(selectors.addBusinessTeam).should('be.visible').click();
    cy.get(selectors.addBusinessTeamModal).should('be.visible');
    cy.get(selectors.newBusinessTeamModal.name)
      .should('be.visible')
      .type('Team name');
    cy.get(selectors.newBusinessTeamModal.description)
      .should('be.visible')
      .type('Team description');
    cy.intercept('POST', api.businessTeams, newBusinessMock).as(
      'newBusinessTeam'
    );
    cy.get(selectors.newBusinessTeamModal.save).should('be.visible').click();
    cy.wait('@newBusinessTeam').then(() => {
      cy.get(selectors.newBusinessTeamModal.newTeamRow).should('be.visible');
    });
  });
});
