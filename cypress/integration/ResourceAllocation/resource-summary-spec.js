describe('View resource summary table', () => {
  let constants, newProject, projects, projectPage, resourceAllocation;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('newProject').then((content) => (newProject = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
    cy.fixture('resourceAllocation').then(
      (content) => (resourceAllocation = content)
    );
    cy.initAmplifyConfiguration();
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

  const createNewProject = () => {
    const { routes, api } = constants;
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const targetCompletionDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    return cy.customRequest(
      'POST',
      `${routes.backendURL}${api.createProject}`,
      {
        ...newProject,
        startDate,
        targetCompletionDate,
      }
    );
  };

  const deleteProject = (projectId) => {
    const { routes, api } = constants;
    cy.customRequest(
      'DELETE',
      `${routes.backendURL}${api.createProject}/${projectId}`,
      {}
    ).then((resp) => expect(resp.status).to.eq(200));
  };

  it('Display resource summary table', () => {
    const { api, routes } = constants;
    const {
      selectors: { tabs },
      stubbedResponses: { resourceSummary },
    } = projectPage;

    const {
      selectors: { tabs: resourcesTabs, resourceSummaryTab },
    } = resourceAllocation;
    cy.intercept(api.fetchProjects).as('fetchProjects');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    createNewProject().then((response) => {
      expect(response.status).to.eq(200);
      const newProjectData = response.body.data;
      cy.intercept(`${api.fetchProjects}/${newProjectData.id}`).as(
        'fetchProjectDetail'
      );
      cy.intercept(
        `${api.fetchProjects}/${newProjectData.id}/allocationSummary`,
        {
          statusCode: 200,
          body: resourceSummary,
        }
      ).as('fetchResourceSummary');
      cy.visit(`${routes.projectPage}${newProjectData.id}`);
      cy.wait('@fetchProjectDetail');
      cy.get(tabs.people).click();
      cy.wait('@fetchResourceSummary');
      cy.get(resourcesTabs.summaryTab).click();
      cy.get(resourceSummaryTab.summaryTable).should('be.visible');
      cy.get(resourceSummaryTab.totalHours).should('contain', '105h');
      cy.get(resourceSummaryTab.totalReource).should('contain', '4');
      deleteProject(newProjectData.id);
    });
  });
});
