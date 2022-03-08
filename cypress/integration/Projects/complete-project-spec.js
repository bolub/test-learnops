describe('Complete project', () => {
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
  });

  it('Sets project status to complete and pick a completion date', () => {
    const { api, routes } = constants;
    const datePick = new Date().getDate();
    const {
      stubbedResponses: { projectList },
      selectors,
    } = projects;
    const userProject = projectList.data[0];
    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    cy.intercept(
      api.singleProject.replace('*', userProject.id),
      { times: 1, method: 'GET' },
      {
        statusCode: 200,
        body: {
          code: 200,
          data: { ...userProject },
          success: true,
        },
      }
    ).as('projectDetail');
    cy.intercept('PUT', `${api.createProject}/**`, (req) => {
      if (req.url.includes('/status')) {
        req.alias = 'updateProjectStatus';
        req.reply({ statusCode: 200 });
      }
    }).as('updateProject');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.visit(`${routes.projectPage}${userProject.id}`);
    cy.wait('@projectDetail');
    cy.get(selectors.projectStatus).should('be.visible').click();
    cy.selectDropdownItem('Completed', 'completed');
    cy.get(selectors.projectActualCompletionDate).should('be.visible').click();
    cy.get(`[data-value=${datePick}]`).click();
    cy.get(selectors.updateProjectButton).should('not.have.attr', 'disabled');
    cy.get(selectors.updateProjectButton).click();
    cy.wait('@updateProject');
    cy.wait('@updateProjectStatus');
  });

  it('Cannot update status from a project which user is not owner', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList },
      selectors,
    } = projects;
    const noOwnerProject = projectList.data[1];
    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    cy.intercept(`${api.fetchProjects}/${noOwnerProject.id}`, {
      statusCode: 200,
      body: {
        code: 200,
        data: { ...noOwnerProject },
        success: true,
      },
    }).as('projectDetail');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.visit(`${routes.projectPage}${noOwnerProject.id}`);
    cy.wait('@projectDetail');
    cy.get(selectors.projectStatus).should(
      'have.attr',
      'aria-disabled',
      'true'
    );
  });
});
