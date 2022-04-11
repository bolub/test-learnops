describe('Update Project', () => {
  let constants, projects, newProjectData;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
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
    cy.signIn();
    cy.interceptApiRequests();
  });

  it('checks if update project button is disabled when no project edit is made', () => {
    const { routes, api } = constants;
    const {
      selectors,
      stubbedResponses: { newProject },
    } = projects;

    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(
      `${api.fetchProjects}/${newProject.data.id}`,
      { times: 1 },
      {
        statusCode: 200,
        body: { ...newProject },
      }
    ).as('fetchProjectDetail');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(selectors.updateProjectButton).should('be.disabled');
  });

  it('checks if cancel button returns to projects list page', () => {
    const { routes, api } = constants;
    const {
      selectors,
      stubbedResponses: { newProject },
    } = projects;

    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(
      `${api.fetchProjects}/${newProject.data.id}`,
      { times: 1 },
      {
        statusCode: 200,
        body: { ...newProject },
      }
    ).as('fetchProjectDetail');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(selectors.updateProjectButton).should('be.disabled');
    cy.get(selectors.cancelProjectUpdate).should('be.visible').click();
    cy.wait('@fetchAllProjects');
    cy.url().should('eq', `http://localhost:3005${routes.projectsList}`);
  });

  it('checks if an error banner appears notifying the user that the project is missing information when not all details are inputed', () => {
    const { routes, api } = constants;
    const {
      selectors,
      stubbedResponses: { newProject },
      constantTexts,
    } = projects;
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${newProject.data.id}`, newProject).as(
      'fetchProjectDetail'
    );
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(selectors.projectNameInput).should('be.visible').type(`-updated`);
    cy.get(selectors.projectDescriptionInput).type(
      `${constantTexts.projectDescription}-updated`
    );
    cy.get(selectors.projectBusiness).should('be.visible').click();
    cy.selectDropdownItem({
      label: 'Test Company 1 - Business Team 1',
      value: '2e7449fe-1787-42cf-a7e8-cf478c11bd9f',
    });
    cy.get(selectors.projectCategory).should('be.visible').click();
    cy.contains(selectors.projectCategoryInput).click();
    cy.get(selectors.projectDate).click();
    cy.get(selectors.projectStartDate).click();
    cy.get(selectors.projectPriorityInput).click({ force: true });
    cy.selectDropdownItem({ label: 'Medium', value: 'medium' });
    cy.get(selectors.projectStatus).should('be.visible').click();
    cy.selectDropdownItem({ label: 'Completed', value: 'completed' });
    cy.get(selectors.projectPrivacy).should('be.visible').click();
    cy.selectDropdownItem({ label: 'Team', value: 'team' });
    cy.get('[data-cy=project-form-body]').scrollTo('bottom');
    cy.get(selectors.projectProcessInput).click();
    cy.get(selectors.updateProjectButton).should('be.visible').click();
    cy.get('.bg-error-lighter').should('be.visible');
  });

  it('checks if project is updated successfully', () => {
    const { routes, api } = constants;
    const { selectors, constantTexts } = projects;
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.customRequest('POST', `${routes.backendURL}${api.createProject}`, {
      ...newProjectData,
      status: 'new',
    }).then((response) => {
      const newProject = response.body.data;
      cy.intercept(`${api.fetchProjects}/${newProject.id}`).as('fetchProject');
      cy.intercept('PUT', `${api.fetchProjects}/${newProject.id}`).as(
        'updateProject'
      );
      cy.intercept('PUT', `${api.fetchProjects}/${newProject.id}/status`).as(
        'updateProjectStatus'
      );

      cy.visit(`/project/${newProject.id}`);
      cy.wait('@fetchProject');

      cy.get(selectors.projectNameInput)
        .should('be.visible')
        .clear()
        .type(`${selectors.projectName}-updated`);
      cy.get(selectors.projectDescriptionInput)
        .clear()
        .type(`${constantTexts.projectDescription}-updated`);
      cy.get(selectors.projectBusiness).should('be.visible').click();
      cy.selectDropdownItem({
        label: 'Test Company 1 - Business Team 1',
        value: '2e7449fe-1787-42cf-a7e8-cf478c11bd9f',
      });
      cy.get(selectors.projectCategory).should('be.visible').click();
      cy.contains(selectors.projectCategoryInput).click();
      cy.pickStartAndEndDates(selectors.projectDate);
      cy.get(selectors.projectTargetDate).click();
      cy.get(`[data-value=${21}]`).click();
      cy.get(selectors.projectPriorityInput).click({ force: true });
      cy.selectDropdownItem({ label: 'Medium', value: 'medium' });
      cy.get(selectors.projectStatus).should('be.visible').click();
      cy.selectDropdownItem({ label: 'In Progress', value: 'in_progress' });
      cy.get(selectors.projectPrivacy).should('be.visible').click();
      cy.selectDropdownItem({ label: 'Team', value: 'team' });
      cy.get('[data-cy=project-form-body]').scrollTo('bottom');
      cy.get(selectors.projectProcessInput).click();
      cy.get(selectors.projectStageInput).should('be.visible').click();
      cy.selectDropdownItem({
        label: 'Analysis',
        value: '575eebd2-c629-4550-88c7-bf668067f559',
      });
      cy.get(selectors.updateProjectButton).should('be.visible').click();
      cy.wait('@updateProject');
      cy.wait('@updateProjectStatus');
      cy.get(selectors.projectSuccessModal).should('be.visible');
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createProject}/${newProject.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });
});
