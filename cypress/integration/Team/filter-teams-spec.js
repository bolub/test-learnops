describe('Filter Teams', () => {
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
    cy.signIn();
    cy.interceptApiRequests();
  });

  it.only('filters teams using different conditionals', () => {
    const { routes } = constants;
    const { selectors, stubbedTeam, routes: teamRoutes } = team;
    cy.intercept(teamRoutes.teamApi, stubbedTeam).as('teams');
    cy.visit(routes.teams);

    cy.get(selectors.filterRequestButton).click();

    // Job title
    cy.get(selectors.columnTitleDropdown).click();
    cy.get(`[data-value*=JOB_TITLE]`).click();
    cy.get(selectors.operatorDropdown).click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filterValueInput).first().type('Software Developer');
    cy.get(selectors.applyButton).click();
    cy.get(selectors.tableRow).its('length').should('greaterThan', 4);
    cy.get(selectors.totalResultsCounter.replace('$', '4')).contains(
      '4 Results'
    );
    cy.contains('Clear All').click();

    // Employment type
    cy.get(selectors.columnTitleDropdown).click();
    cy.get(`[data-value*=EMPLOYMENT_TYPE]`).click();
    cy.get(selectors.operatorDropdown).click();
    cy.contains('Equal to').should('be.visible').click();
    cy.get(selectors.dropdownValues).click();
    cy.get(`[data-value*='Full Time']`).click();
    cy.get(selectors.applyButton).click();
    cy.get(selectors.tableRow).its('length').should('greaterThan', 2);
    cy.get(selectors.totalResultsCounter.replace('$', '2')).contains(
      '2 Results'
    );
    cy.contains('Clear All').click();

    // Country
    cy.get(selectors.columnTitleDropdown).click();
    cy.get(`[data-value*=COUNTRY]`).click();
    cy.get(selectors.operatorDropdown).click();
    cy.contains('Not equal to').should('be.visible').click();
    cy.get(selectors.dropdownValues).click();
    cy.get(`[data-value*='Tonga']`).click();
    cy.get(selectors.applyButton).click();
    cy.get(selectors.tableRow).its('length').should('greaterThan', 6);
    cy.get(selectors.totalResultsCounter.replace('$', '6')).contains(
      '6 Results'
    );
    cy.contains('Clear All').click();

    // Hourly rate
    cy.get(selectors.columnTitleDropdown).click();
    cy.get(`[data-value*=HOURLY_RATE]`).click();
    cy.get(selectors.operatorDropdown).click();
    cy.contains('Equal to').should('be.visible').click();
    cy.get(selectors.filterNumberInput).first().type(38);
    cy.get(selectors.applyButton).click();
    cy.get(selectors.tableRow).its('length').should('greaterThan', 3);
    cy.get(selectors.totalResultsCounter.replace('$', '3')).contains(
      '3 Results'
    );
    cy.contains('Clear All').click();
  });
});
