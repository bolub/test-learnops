describe('Cancel project', () => {
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

  it('Selects a reson when cancelling a project', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses,
      selectors: { projectSuccessModal },
    } = projects;
    const {
      selectors: { cancelProject, moreActionsMenu },
    } = projectPage;
    cy.intercept(api.allRequests, stubbedResponses.projectSearchResponses).as(
      'fetchProjects'
    );
    cy.intercept(
      `${api.fetchProjects}/${stubbedResponses.newProject.data.id}`,
      { times: 1, method: 'GET' },
      stubbedResponses.newProject
    ).as('fetchProjectDetail');
    cy.intercept(
      `${api.fetchProjects}/${stubbedResponses.newProject.data.id}`,
      { times: 1, method: 'PUT' },
      { statusCode: 200 }
    ).as('updateProject');
    cy.visit(routes.projectsList);
    cy.visit(`${routes.projectPage}${stubbedResponses.newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(moreActionsMenu.triggerButton).should('be.visible').click();
    cy.get(moreActionsMenu.optionsList).should('be.visible');
    cy.get(cancelProject.trigger).should('be.visible').click();
    cy.get(cancelProject.modalWindow).should('be.visible');
    cy.get(cancelProject.confirmButton).should('be.disabled');
    cy.get(cancelProject.reasonPicker).click();

    const data = {
      label: 'Priority change',
      value: 'Priority change',
    };
    cy.get(`[data-value='${JSON.stringify(data)}']`)
      .should('be.visible')
      .click();

    cy.get(cancelProject.confirmButton).should('not.be.disabled').click();
    cy.get(cancelProject.modalWindow).should('not.exist');
    cy.get(projectSuccessModal).should('be.visible');
  });

  it('Specifies a reason when cancelling a project', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses,
      selectors: { projectSuccessModal },
    } = projects;
    const {
      selectors: { cancelProject, moreActionsMenu },
    } = projectPage;
    cy.intercept(api.allRequests, stubbedResponses.projectSearchResponses).as(
      'fetchProjects'
    );
    cy.intercept(
      `${api.fetchProjects}/${stubbedResponses.newProject.data.id}`,
      stubbedResponses.newProject
    ).as('fetchProjectDetail');
    cy.intercept(
      `${api.fetchProjects}/${stubbedResponses.newProject.data.id}`,
      { times: 1, method: 'PUT' },
      { statusCode: 200 }
    ).as('updateProject');
    cy.visit(routes.projectsList);
    cy.visit(`${routes.projectPage}${stubbedResponses.newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(moreActionsMenu.triggerButton).should('be.visible').click();
    cy.get(moreActionsMenu.optionsList).should('be.visible');
    cy.get(cancelProject.trigger).should('be.visible').click();
    cy.get(cancelProject.modalWindow).should('be.visible');
    cy.get(cancelProject.confirmButton).should('be.disabled');
    cy.get(cancelProject.reasonPicker).click();

    const data = {
      label: 'Other',
      value: 'Other',
    };
    cy.get(`[data-value='${JSON.stringify(data)}']`)
      .should('be.visible')
      .click();

    cy.get(cancelProject.specifyReason).should('be.visible');
    cy.get(cancelProject.confirmButton).should('be.disabled');
    cy.get(cancelProject.specifyReason).type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );
    cy.get(cancelProject.confirmButton).should('not.be.disabled').click();
    cy.get(cancelProject.modalWindow).should('not.exist');
    cy.get(projectSuccessModal).should('be.visible');
  });
});
