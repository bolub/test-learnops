import get from 'lodash/get';

describe('Project List View', () => {
  let constants, projects;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
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

  it('Checks if table does not show if no projects are available', () => {
    const { routes, } = constants;
    const {
      selectors: {
        projectsListTable: {
          myProjectsTab,
          myProjectsEmpty,
          teamProjectsEmpty,
        },
      },
    } = projects;


    cy.visit(routes.projectsList);

   

});
