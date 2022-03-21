describe('Vew Forms', () => {
  let constants, forms, project;

  before('Load Fixtures', () => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('forms').then((content) => (forms = content));
    cy.fixture('projectsProcesses').then((content) => (project = content));
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

  it('Checks if platform request forms and colums are visible', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept(api.usersApi).as('users');
    cy.visit(routes.settings);
    cy.wait('@users');
    cy.get(projectSelector.platformTab).should('be.visible').click();
    cy.get(formSelector.platformRequest).should('be.visible').click();
    cy.get(formSelector.tableHeader).should('be.visible');
    cy.contains(formSelector.formTitle).should('be.visible');
    cy.contains(formSelector.requestTitle).should('be.visible');
    cy.get(formSelector.formWindow)
      .contains('Description')
      .should('be.visible');
    cy.contains(formSelector.formCreator).should('be.visible');
    cy.contains(formSelector.lastUpdate).should('be.visible');
    cy.get(formSelector.formWindow)
      .contains(formSelector.platformStatus)
      .should('be.visible');
    cy.get(formSelector.formWindow)
      .contains(formSelector.creationDate)
      .should('be.visible');
  });

  it('Checks if search filter works on form', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept(api.usersApi).as('users');
    cy.visit(routes.settings);
    cy.wait('@users');
    cy.get(projectSelector.platformTab).should('be.visible').click();
    cy.get(formSelector.platformRequest).should('be.visible').click();
    cy.get(formSelector.tableHeader).should('be.visible');
    cy.contains(formSelector.formTitle).should('be.visible');
    cy.contains(formSelector.requestTitle).should('be.visible');
    cy.get(formSelector.formWindow)
      .contains('Description')
      .should('be.visible');
    cy.contains(formSelector.formCreator).should('be.visible');
    cy.contains(formSelector.lastUpdate).should('be.visible');
    cy.get(formSelector.formWindow)
      .contains(formSelector.platformStatus)
      .should('be.visible');
    cy.get(formSelector.formWindow)
      .contains(formSelector.creationDate)
      .should('be.visible');
    cy.get(formSelector.formSearch).should('be.visible').type('Request 6');
    cy.get(formSelector.formWindow)
      .contains(formSelector.filteredSearch)
      .should('be.visible');
  });
});
