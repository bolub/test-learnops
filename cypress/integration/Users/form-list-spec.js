describe('View Users', () => {
  let selector;

  before('Load Fixtures', () => {
    cy.fixture('user').then((content) => (selector = content));
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
    const { selectors, routes, allUsers } = selector;
    cy.intercept(routes.usersApi, allUsers).as('users');
    cy.visit(routes.usersPage);
    cy.wait('@users').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
    });
    cy.get(selectors.platformTab).should('be.visible').click();
    cy.get(selectors.platformRequest).should('be.visible').click();
    cy.get(selectors.tableHeader).should('be.visible');
    cy.contains(selectors.formTitle).should('be.visible');
    cy.contains(selectors.requestTitle).should('be.visible');
    cy.get(selectors.formWindow).contains('Description').should('be.visible');
    cy.contains(selectors.formCreator).should('be.visible');
    cy.contains(selectors.lastUpdate).should('be.visible');
    cy.get(selectors.formWindow)
      .contains(selectors.platformStatus)
      .should('be.visible');
    cy.get(selectors.formWindow)
      .contains(selectors.creationDate)
      .should('be.visible');
  });

  it('Checks if search filter works on form', () => {
    const { selectors, routes, allUsers } = selector;
    cy.intercept(routes.usersApi, allUsers).as('users');
    cy.visit(routes.usersPage);
    cy.wait('@users').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
    });
    cy.get(selectors.platformTab).should('be.visible').click();
    cy.get(selectors.platformRequest).should('be.visible').click();
    cy.get(selectors.tableHeader).should('be.visible');
    cy.contains(selectors.formTitle).should('be.visible');
    cy.contains(selectors.requestTitle).should('be.visible');
    cy.get(selectors.formWindow).contains('Description').should('be.visible');
    cy.contains(selectors.formCreator).should('be.visible');
    cy.contains(selectors.lastUpdate).should('be.visible');
    cy.get(selectors.formWindow)
      .contains(selectors.platformStatus)
      .should('be.visible');
    cy.get(selectors.formWindow)
      .contains(selectors.creationDate)
      .should('be.visible');
    cy.get(selectors.formSearch).should('be.visible').type('Request 6');
    cy.get(selectors.formWindow)
      .contains(selectors.filteredSearch)
      .should('be.visible');
  });
});
