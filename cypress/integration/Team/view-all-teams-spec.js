let organization, constants;
describe('View All teams', () => {
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

  it('User can see all LD teams', () => {
    const { selectors, orgMockData } = organization;
    const { routes, api } = constants;
    const { ldTableHeader } = selectors;
    cy.intercept(api.organization, orgMockData).as('organization');
    cy.visit(routes.settings);
    cy.wait('@organization').then(({ response }) => {
      const ldTeams = response.body.data.learningTeams;
      cy.get(selectors.organizationTab).should('be.visible').click();
      cy.get(selectors.learningTeamsTab).should('be.visible').click();
      Object.keys(ldTableHeader).map((selector) => {
        cy.get(ldTableHeader[selector]).should('be.visible');
      });
      ldTeams.map((data) => {
        cy.get(selectors.ldTeamRow.replace('$', data.id)).should('be.visible');
      });
    });
  });

  it('User can see empty LD teams', () => {
    const { selectors, orgMockData } = organization;
    const { routes, api } = constants;
    const { ldTableHeader } = selectors;
    cy.intercept(api.organization, {
      ...orgMockData,
      data: { ...orgMockData.data, learningTeams: [] },
    }).as('organization');
    cy.visit(routes.settings);
    cy.wait('@organization');
    cy.get(selectors.organizationTab).should('be.visible').click();
    cy.get(selectors.learningTeamsTab).should('be.visible').click();
    Object.keys(ldTableHeader).map((selector) => {
      cy.get(ldTableHeader[selector]).should('be.visible');
    });
    cy.get(selectors.teamsTableEmpty).should('be.visible');
  });

  it('User can see all business teams', () => {
    const { selectors, orgMockData } = organization;
    const { routes, api } = constants;
    const { businessTableHeader } = selectors;
    cy.intercept(api.organization, orgMockData).as('organization');
    cy.visit(routes.settings);
    cy.wait('@organization').then(({ response }) => {
      const businessTeams = response.body.data.businessTeams;
      cy.get(selectors.organizationTab).should('be.visible').click();
      cy.get(selectors.businessTeamsTab).should('be.visible').click();
      Object.keys(businessTableHeader).map((selector) => {
        cy.get(businessTableHeader[selector]).should('be.visible');
      });
      businessTeams.map((data) => {
        cy.get(selectors.businessTeamRow.replace('$', data.id)).should(
          'be.visible'
        );
      });
    });
  });

  it('User can see empty business teams', () => {
    const { selectors, orgMockData } = organization;
    const { routes, api } = constants;
    const { businessTableHeader } = selectors;
    cy.intercept(api.organization, {
      ...orgMockData,
      data: { ...orgMockData.data, businessTeams: [] },
    }).as('organization');
    cy.visit(routes.settings);
    cy.wait('@organization');
    cy.get(selectors.organizationTab).should('be.visible').click();
    cy.get(selectors.businessTeamsTab).should('be.visible').click();
    Object.keys(businessTableHeader).map((selector) => {
      cy.get(businessTableHeader[selector]).should('be.visible');
    });
    cy.get(selectors.teamsTableEmpty).should('be.visible');
  });
});
