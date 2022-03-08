describe('Close a completed project', () => {
  let constants, projects, projectPage, newProjectData;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
    cy.fixture('newProject').then((content) => (newProjectData = content));
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

  it('Closes a completed project', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList },
    } = projects;
    const {
      selectors: {
        moreActionsMenu,
        closeProject,
        viewLinkedRequestModalCloseButton,
      },
    } = projectPage;
    const finalComments =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    cy.intercept(
      api.fetchProjects,
      {
        times: 1,
        method: 'GET',
      },
      projectList
    ).as('teamProjectsList');
    cy.intercept(`${api.createProject}/**`).as('projectDetail');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.customRequest(
      'POST',
      `${routes.backendURL}${api.createProject}`,
      newProjectData
    ).then((response) => {
      expect(response.status).to.eq(200);
      const newProject = response.body.data;
      cy.visit(`${routes.projectPage}${newProject.id}`);
      cy.wait('@projectDetail');
      cy.get(moreActionsMenu.triggerButton).click();
      cy.get(moreActionsMenu.optionsList).should('be.visible');
      cy.get(closeProject.trigger).click();
      cy.get(closeProject.modalWindow).should('be.visible');
      cy.get(closeProject.confirmButton).should('be.disabled');
      cy.get(closeProject.finalCommentsInput).type(finalComments);
      cy.get(closeProject.confirmButton).should('not.be.disabled').click();
      cy.get(closeProject.closedNotification).should('be.visible');
      cy.get(closeProject.closedNotificationDate)
        .should('be.visible')
        .and('not.be.empty');
      cy.get(closeProject.viewDetailsButton).click();
      cy.get(closeProject.modalWindow).should('be.visible');
      cy.get(closeProject.confirmButton).should('not.exist');
      cy.get(closeProject.finalCommentsInput)
        .contains(finalComments)
        .and('to.be.disabled');
      cy.get(viewLinkedRequestModalCloseButton).click();
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createProject}/${newProject.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });
});
