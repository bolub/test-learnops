let route, selector;
describe('Test for left sidebar', () => {
  before('Load Fixtures', () => {
    cy.fixture('constants').then((content) => (route = content));
    cy.fixture('requestList').then((content) => (selector = content));
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

  it('checks if left sidebar is visible and if nav icon links to respective screen', () => {
    const { routes } = route;
    const {
      selectors: { leftSideBar },
    } = selector;
    cy.get(leftSideBar.sideBarLogo).should('be.visible');

    cy.get(leftSideBar.sideBarExpandCollapseButton)
      .should('be.visible')
      .click();

    cy.get(leftSideBar.sidebarInsights).should('be.visible').click();
    cy.url().should('eq', `http://localhost:3005${routes.insight}`);

    cy.get(leftSideBar.sidebarIntake).should('be.visible').click();
    cy.url().should('eq', `http://localhost:3005${routes.requestList}`);

    cy.get(leftSideBar.sidebarProjects).should('be.visible').click();
    cy.url().should('eq', `http://localhost:3005${routes.projectsList}`);

    cy.get(leftSideBar.sidebarDesign).should('be.visible').click();
    cy.url().should('eq', `http://localhost:3005${routes.design}`);

    cy.get(leftSideBar.sidebarTeams).should('be.visible').click();
    cy.url().should('eq', `http://localhost:3005${routes.teams}`);

    cy.get(leftSideBar.sidebarSettings).should('be.visible').click();
    cy.url().should('eq', `http://localhost:3005${routes.settings}`);

    cy.get(leftSideBar.sidebarLogout).should('be.visible').click();
    cy.url().should('eq', `http://localhost:3005${routes.loginPage}`);
  });
});
