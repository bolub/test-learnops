import get from 'lodash/get';

describe('Project List View', () => {
  let constants, projects;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));

    cy.initAmplifyConfiguration();
    cy.signInNew();
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
    // cy.signInLD();
    // cy.interceptApiRequests();
  });

  // const isVisible = (elem) =>
  //   !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

  it('test new signIN', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: {
          myProjectsTab,
          myProjectsEmpty,
          teamProjectsEmpty,
        },
      },
    } = projects;

    cy.intercept(api.fetchProjects, {
      status: 200,
      data: [],
      success: true,
    }).as('teamProjectsList');

    cy.intercept(api.myProjects, {
      status: 200,
      data: [],
      success: true,
    }).as('myProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList');
    cy.wait('@myProjectsList');

    cy.get(teamProjectsEmpty).should('be.visible');

    cy.get(myProjectsTab).click();

    cy.get(myProjectsEmpty).should('be.visible');
  });
});
