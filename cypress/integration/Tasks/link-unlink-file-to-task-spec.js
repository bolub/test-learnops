describe('Link unlink file to task', () => {
  let tasks, projects, constants, projectPage;

  before(() => {
    cy.fixture('tasks').then((content) => (tasks = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
    cy.fixture('constants').then((content) => (constants = content));

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
    cy.interceptApiRequests();
  });

  it('Links a project file to a task', () => {
    const {
      routes,
      api,
      selectors: {
        appInlineNotification,
        autoCompleteSearchInput,
        autoCompleteOptionsList,
      },
    } = constants;
    const {
      selectors: { singleTaskPage, taskTab, linkFiles },
      constantTexts,
    } = tasks;
    const {
      selectors: { tabs, filesTab },
    } = projectPage;
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    const taskId = '9d1e89c0-f9cf-4559-860f-87c423231ea0';
    const singleTaskRoute = `/project/${projectId}/tasks/${taskId}`;
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');
    cy.intercept(singleTaskRoute).as('fetchTaskDetail');
    cy.intercept('PUT', `${api.fetchProjects}/${projectId}`).as(
      'updateProject'
    );
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks');
    cy.visit(singleTaskRoute);
    cy.wait('@fetchTaskDetail');
    cy.get(singleTaskPage.taskSaveButton).should('be.disabled');
    cy.get(singleTaskPage.linkedFilesTable)
      .should('be.visible')
      .contains('td', constantTexts.noFilesLinked);
    cy.get(singleTaskPage.linkFileButton).click();
    cy.get(autoCompleteSearchInput)
      .should('be.visible')
      .type(constantTexts.linkedFileName);
    cy.get(autoCompleteOptionsList)
      .children()
      .should('have.length', 1)
      .first()
      .click();
    cy.get(linkFiles.confirmLinkFileButton).should('not.be.disabled').click();
    cy.get(singleTaskPage.taskSaveButton).should('not.be.disabled').click();
    cy.wait('@updateProject');
    cy.get(appInlineNotification).should('be.visible');
    cy.get(tabs.files).click();
    cy.get(filesTab.filesTable).contains(
      'td',
      constantTexts.linkedFileTaskName
    );
  });

  it('Unlinks a file from a task', () => {
    const {
      routes,
      api,
      selectors: { appInlineNotification },
    } = constants;
    const {
      selectors: { singleTaskPage, taskTab, linkFiles },
      constantTexts,
    } = tasks;
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    const taskId = '9d1e89c0-f9cf-4559-860f-87c423231ea0';
    const singleTaskRoute = `/project/${projectId}/tasks/${taskId}`;
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');
    cy.intercept(singleTaskRoute).as('fetchTaskDetail');
    cy.intercept('PUT', `${api.fetchProjects}/${projectId}`).as(
      'updateProject'
    );
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks');
    cy.visit(singleTaskRoute);
    cy.wait('@fetchTaskDetail');
    cy.get(singleTaskPage.taskSaveButton).should('be.disabled');
    cy.get(singleTaskPage.linkedFilesTable).contains(
      'td',
      constantTexts.linkedFileName
    );
    cy.get(linkFiles.unlinkFileButton).click();
    cy.get(singleTaskPage.linkedFilesTable).contains(
      'td',
      constantTexts.noFilesLinked
    );
    cy.get(singleTaskPage.taskSaveButton).should('not.be.disabled').click();
    cy.wait('@updateProject');
    cy.get(appInlineNotification).should('be.visible');
  });
});
