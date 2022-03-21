describe('Delete an existing project', () => {
  let constants, projects, projectPage;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
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

  it('Deletes a project', () => {
    const { routes, api, selectors: globalSelectors } = constants;
    const { stubbedResponses, selectors } = projects;
    const { selectors: projectDetailPage } = projectPage;
    cy.intercept(
      api.fetchProjects,
      { times: 1 },
      stubbedResponses.projectSearchResponses
    ).as('fetchProjects');
    cy.intercept(
      `${api.fetchProjects}/${stubbedResponses.projectSearchResponses.data[0].id}`,
      {
        code: 200,
        data: {
          ...stubbedResponses.projectSearchResponses.data[0],
        },
      }
    ).as('fetchProjectDetail');
    cy.intercept(
      'DELETE',
      `${api.fetchProjects}/${stubbedResponses.projectSearchResponses.data[0].id}`,
      { statusCode: 200, body: {} }
    ).as('deleteProject');
    cy.visit(routes.projectsList);
    cy.get(selectors.projectsListTable.teamProjectsTable).should('be.visible');
    cy.get(
      selectors.projectsListTable.tableRow.replace(
        '*',
        stubbedResponses.projectSearchResponses.data[0].id
      )
    )
      .should('be.visible')
      .contains('td', 'QA Project Data 1')
      .click();
    cy.wait('@fetchProjectDetail');
    cy.intercept(api.fetchProjects, {
      code: 200,
      data: stubbedResponses.projectSearchResponses.data.slice(1),
    }).as('fetchUpdatedProjectsList');
    cy.get(projectDetailPage.moreActionsMenu.triggerButton)
      .should('be.visible')
      .click();
    cy.get(projectDetailPage.moreActionsMenu.optionsList).should('be.visible');
    cy.get(projectDetailPage.deleteProjectButton).should('be.visible').click();
    cy.get(projectDetailPage.deleteProjectModal.modalWindow).should(
      'be.visible'
    );
    cy.get(projectDetailPage.deleteProjectModal.confirmButton).click();
    cy.wait('@deleteProject');
    cy.url().should('eq', `${Cypress.config().baseUrl}${routes.projectsList}`);
    cy.wait('@fetchUpdatedProjectsList');

    cy.checkSuccessMessage();

    cy.get(
      selectors.projectsListTable.tableRow.replace(
        '*',
        stubbedResponses.projectSearchResponses.data[0].id
      )
    ).should('not.exist');
  });
});
