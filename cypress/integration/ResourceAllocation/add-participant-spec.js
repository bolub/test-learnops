describe('Add participant', () => {
  let constants, newProject, projectPage, resourceAllocation;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
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
    cy.signIn();
    cy.interceptApiRequests();
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

  it('Validates form functionality', () => {
    const { routes, api } = constants;
    const {
      selectors: { tabs: projectTabs },
    } = projectPage;
    const {
      selectors: {
        tabs: resourcesTabs,
        addParticipantButton,
        participantModal: { participantForm, container },
      },
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
      cy.visit(`${routes.projectPage}${newProjectData.id}`);
      cy.wait('@fetchProjectDetail');
      cy.get(projectTabs.people).click();
      cy.get(resourcesTabs.allocationTab).click();
      cy.get(addParticipantButton).click();
      cy.get(container).should('be.visible');
      cy.get(participantForm.typeField).should(
        'have.attr',
        'data-value',
        'Project Member'
      );
      cy.get(participantForm.saveButton).should('be.disabled');
      cy.get(participantForm.totalAvailability).should('not.exist');
      cy.get(participantForm.allocatedHoursField).should('not.exist');
      cy.get(participantForm.estimatedHoursField).should('not.exist');
      cy.get(participantForm.roleField).click();
      cy.selectDropdownItem('Instructional designer', 'Instructional designer');
      cy.pickStartAndEndDates(participantForm.dateRangeField, 7, 14);
      cy.get(participantForm.dateRangeField).click();
      cy.get(participantForm.userField).click();
      cy.get('[role="option"]').eq(0).click();
      cy.get(participantForm.totalAvailability).should('be.visible');
      cy.get(participantForm.allocatedHoursField).should('be.visible');
      cy.get(participantForm.saveButton).should('not.be.disabled');
      cy.get(participantForm.typeField).click();
      cy.get('[role="option"]').eq(1).click();
      cy.get(participantForm.totalAvailability).should('not.exist');
      cy.get(participantForm.allocatedHoursField).should('not.exist');
      cy.get(participantForm.userField).click();
      cy.get('[role="option"]').eq(0).click();
      cy.get(participantForm.estimatedHoursField).should('be.visible');
      cy.get(participantForm.cancelButton).click();
      cy.get(container).should('not.exist');
      deleteProject(newProjectData.id);
    });
  });

  it('Adds a new participant', () => {
    const {
      routes,
      api,
      selectors: { appInlineNotification },
    } = constants;
    const {
      selectors: { tabs: projectTabs },
    } = projectPage;
    const {
      selectors: {
        tabs: resourcesTabs,
        addParticipantButton,
        participantModal: { participantForm, container },
      },
      constantTexts,
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
        'POST',
        api.addProjectParticipant.replace('$', newProjectData.id)
      ).as('addParticipant');
      cy.visit(`${routes.projectPage}${newProjectData.id}`);
      cy.wait('@fetchProjectDetail');
      cy.get(projectTabs.people).click();
      cy.get(resourcesTabs.allocationTab).click();
      cy.get(addParticipantButton).click();
      cy.get(container).should('be.visible');
      cy.get(participantForm.roleField).click();
      cy.selectDropdownItem('Instructional designer', 'Instructional designer');
      cy.pickStartAndEndDates(participantForm.dateRangeField, 7, 21);
      cy.get(participantForm.dateRangeField).click();
      cy.get(participantForm.userField).click();
      cy.get('[role="option"]').eq(0).click();
      cy.get(participantForm.allocatedHoursField).type(60);
      cy.get(participantForm.saveButton).click();
      cy.wait('@addParticipant').its('response.statusCode').should('eq', 200);
      cy.get(appInlineNotification).contains(
        constantTexts.participantAddedSuccesfully
      );
      deleteProject(newProjectData.id);
    });
  });

  it('Add a new collaborator', () => {
    const {
      routes,
      api,
      selectors: { appInlineNotification },
    } = constants;
    const {
      selectors: { tabs: projectTabs },
    } = projectPage;
    const {
      selectors: {
        tabs: resourcesTabs,
        addParticipantButton,
        participantModal: { participantForm, container },
      },
      constantTexts,
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
        'POST',
        api.addProjectCollaborator.replace('$', newProjectData.id)
      ).as('addCollaborator');
      cy.visit(`${routes.projectPage}${newProjectData.id}`);
      cy.wait('@fetchProjectDetail');
      cy.get(projectTabs.people).click();
      cy.get(resourcesTabs.allocationTab).click();
      cy.get(addParticipantButton).click();
      cy.get(container).should('be.visible');
      cy.get(participantForm.typeField).click();
      cy.get('[role="option"]').eq(1).click();
      cy.get(participantForm.roleField).click();
      cy.selectDropdownItem('Instructional designer', 'Instructional designer');
      cy.pickStartAndEndDates(participantForm.dateRangeField, 7, 21);
      cy.get(participantForm.dateRangeField).click();
      cy.get(participantForm.userField).click();
      cy.get('[role="option"]').eq(0).click();
      cy.get(participantForm.estimatedHoursField).type(60);
      cy.get(participantForm.saveButton).click();
      cy.wait('@addCollaborator').its('response.statusCode').should('eq', 200);
      cy.get(appInlineNotification).contains(
        constantTexts.participantAddedSuccesfully
      );
      deleteProject(newProjectData.id);
    });
  });
});
