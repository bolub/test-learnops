const { _ } = Cypress;

describe('Projects Processes', () => {
  let constans, projectsProcesses, newProcess;

  before('Load Fixtures', () => {
    cy.fixture('constants').then((content) => (constans = content));
    cy.fixture('newProcess').then((content) => (newProcess = content));
    cy.fixture('projectsProcesses').then(
      (content) => (projectsProcesses = content)
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

  const navigateToProjectsSettingsPage = () => {
    const { routes, api } = constans;
    const { selectors } = projectsProcesses;
    cy.intercept(api.fetchAllProjectProcesses).as('fetchAllProjectProcesses');
    cy.visit(routes.settings);
    cy.wait('@fetchAllProjectProcesses');
    cy.get(selectors.platformTab).click();
    cy.get(selectors.projectsTab).click();
    cy.get(selectors.processesTable).should('be.visible');
  };

  it('Validates process form modal functionality', () => {
    navigateToProjectsSettingsPage();
    const {
      selectors: { processForm, addProcessButton },
    } = projectsProcesses;
    cy.get(addProcessButton).should('be.visible').click();
    cy.get(processForm.container).should('be.visible');
    cy.get(processForm.confirmButton).should('be.disabled');
    cy.get(processForm.processNameField).type('Test Process');
    cy.get(processForm.processDescriptionField).type('Test Process');
    cy.get(processForm.confirmButton).should('be.disabled');
    cy.get(processForm.removeProcessStageButton.replace('$', '0')).should(
      'not.exist'
    );
    cy.get(processForm.processStageNameField.replace('$', '0')).type(
      'Stage One'
    );
    cy.get(processForm.confirmButton).should('not.be.disabled');
    cy.get(processForm.processStageDescriptionField.replace('$', '0')).type(
      'Stage One'
    );
    cy.get(
      processForm.processStageMinCompletionTimeField.replace('$', '0')
    ).type(20);
    cy.get(
      processForm.processStageMaxCompletionTimeField.replace('$', '0')
    ).type(40);
    cy.get(processForm.addProcessStageButton).click();
    cy.get(processForm.confirmButton).should('be.disabled');
    cy.get(processForm.removeProcessStageButton.replace('$', '0')).should(
      'be.visible'
    );
    cy.get(processForm.removeProcessStageButton.replace('$', '1'))
      .should('be.visible')
      .click();
    cy.get(processForm.confirmButton).should('not.be.disabled');
    cy.get(processForm.cancelButton).click();
    cy.get(processForm.container).should('not.exist');
  });

  it('Creates a new project process', () => {
    const { routes, api, selectors } = constans;
    const {
      selectors: { addProcessButton, processForm, processesTableRow },
      constantTexts,
    } = projectsProcesses;
    cy.intercept('POST', api.addProjectProcess).as('addNewProjectProcess');
    navigateToProjectsSettingsPage();
    cy.get(addProcessButton).click();
    cy.get(processForm.processNameField).type('Add process e2e test');
    cy.get(processForm.processDescriptionField).type('Add process e2e test');
    cy.get(processForm.processStageNameField.replace('$', '0')).type(
      'Stage One'
    );
    cy.get(processForm.processStageDescriptionField.replace('$', '0')).type(
      'Stage One'
    );
    cy.get(
      processForm.processStageMinCompletionTimeField.replace('$', '0')
    ).type(20);
    cy.get(
      processForm.processStageMaxCompletionTimeField.replace('$', '0')
    ).type(40);
    cy.get(processForm.confirmButton).click();
    cy.wait('@addNewProjectProcess').then((interception) => {
      cy.wrap(interception).its('response.statusCode').should('eq', 200);
      const newProcessId = _.get(interception, 'response.body.data.id');
      cy.get(selectors.appInlineNotification)
        .should('be.visible')
        .contains(constantTexts.processAddedSuccesfully);
      cy.get(processesTableRow.replace('$', newProcessId)).contains(
        'td',
        'Add process e2e test'
      );
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.addProjectProcess}/${newProcessId}`
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });

  it('Updates a project process', () => {
    const { api, selectors, routes } = constans;
    const {
      selectors: { editProcessButton, processForm, processesTableRow },
      constantTexts,
    } = projectsProcesses;
    const processId = 'e22fe31f-d28f-4a33-8ad7-1cae54fdf1e9';
    const processName = 'SAM';
    const processStagesCount = 8;
    cy.intercept('PUT', `${api.addProjectProcess}/${processId}`).as(
      'updateProjectProcess'
    );
    navigateToProjectsSettingsPage();
    cy.get(processesTableRow.replace('$', processId))
      .find(editProcessButton)
      .click();
    cy.get(processForm.container).should('be.visible');
    cy.get(processForm.processNameField).contains(processName);
    cy.get(processForm.container).find('.overflow-y-auto').scrollTo('bottom');
    cy.get(processForm.addProcessStageButton).click();
    cy.get(
      processForm.processStageNameField.replace('$', processStagesCount)
    ).type('Test stage');
    cy.get(
      processForm.processStageDescriptionField.replace('$', processStagesCount)
    ).type('Stage One');
    cy.get(
      processForm.processStageMinCompletionTimeField.replace(
        '$',
        processStagesCount
      )
    ).type(20);
    cy.get(
      processForm.processStageMaxCompletionTimeField.replace(
        '$',
        processStagesCount
      )
    ).type(40);
    cy.get(processForm.confirmButton).click();
    cy.wait('@updateProjectProcess').then((interception) => {
      cy.wrap(interception).its('response.statusCode').should('eq', 200);
      const newStageId = _.get(
        interception,
        `response.body.data.stagesOrdering.${processStagesCount}`
      );
      console.log('[newStageId]', newStageId);
      cy.get(selectors.appInlineNotification)
        .should('be.visible')
        .contains(constantTexts.processUpdatedSuccesfully);
      cy.get(processesTableRow.replace('$', processId)).contains(
        'td',
        '20 - 40'
      );
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.removeProjectStage}/${newStageId}`
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });

  it('Removes a project process', () => {
    const { api, selectors, routes } = constans;
    const {
      selectors: {
        removeProcessButton,
        removeProcessConfirmationModal,
        processesTableRow,
      },
      constantTexts,
    } = projectsProcesses;
    cy.visit(routes.projectsList);
    cy.customRequest(
      'POST',
      `${routes.backendURL}${api.addProjectProcess}`,
      newProcess
    ).then((resp) => {
      expect(resp.status).to.eq(200);
      const processId = _.get(resp, 'body.data.id');
      cy.intercept('DELETE', `${api.addProjectProcess}/${processId}`).as(
        'removeProjectProcess'
      );
      navigateToProjectsSettingsPage();
      cy.get(processesTableRow.replace('$', processId))
        .find(removeProcessButton)
        .click();
      cy.get(removeProcessConfirmationModal.container).should('be.visible');
      cy.get(removeProcessConfirmationModal.confirmButton).click();
      cy.wait('@removeProjectProcess');
      cy.get(selectors.appInlineNotification)
        .should('be.visible')
        .contains(constantTexts.processRemovedSuccesfully);
      cy.get(processesTableRow.replace('$', processId)).should('not.exist');
    });
  });

  it('Cannot remove default process or its stages', () => {
    const {
      selectors: {
        removeProcessButton,
        editProcessButton,
        processesTableRow,
        processForm,
      },
    } = projectsProcesses;
    const processId = '73009fc1-19d2-405d-9ea8-7576177d747f';
    const processName = 'ADDIE';
    navigateToProjectsSettingsPage();
    cy.get(processesTableRow.replace('$', processId)).contains(
      'td',
      processName
    );
    cy.get(processesTableRow.replace('$', processId))
      .find(removeProcessButton)
      .should('be.disabled');
    cy.get(processesTableRow.replace('$', processId))
      .find(editProcessButton)
      .click();
    cy.get(processForm.processNameField).should('be.disabled');
    cy.get(processForm.processDescriptionField).should('not.be.disabled');
    cy.get(processForm.processStageNumber).each((_, index) => {
      cy.get(processForm.removeProcessStageButton.replace('$', index)).should(
        'not.exist'
      );
      cy.get(processForm.processStageNameField.replace('$', index)).should(
        'be.disabled'
      );
      cy.get(
        processForm.processStageDescriptionField.replace('$', index)
      ).should('not.be.disabled');
      cy.get(
        processForm.processStageMinCompletionTimeField.replace('$', index)
      ).should('not.be.disabled');
      cy.get(
        processForm.processStageMaxCompletionTimeField.replace('$', index)
      ).should('not.be.disabled');
    });
  });

  it('Cannot remove a process or its stages attached to projects', () => {
    const {
      selectors: {
        removeProcessButton,
        editProcessButton,
        processesTableRow,
        processForm,
      },
    } = projectsProcesses;
    const processId = '107adf39-6c1f-4650-87d7-5c71b3f2cb73';
    const processName = 'DELIVERY';
    navigateToProjectsSettingsPage();
    cy.get(processesTableRow.replace('$', processId)).contains(
      'td',
      processName
    );
    cy.get(processesTableRow.replace('$', processId))
      .find(removeProcessButton)
      .should('be.disabled');
    cy.get(processesTableRow.replace('$', processId))
      .find(editProcessButton)
      .click();
    cy.get(processForm.processNameField).contains(processName);
    cy.get(processForm.container).find('.overflow-y-auto').scrollTo('bottom');
    cy.get(processForm.removeProcessStageButton.replace('$', 0)).should(
      'not.exist'
    );
    cy.get(processForm.removeProcessStageButton.replace('$', 1)).should(
      'be.visible'
    );
    cy.get(processForm.removeProcessStageButton.replace('$', 2)).should(
      'not.exist'
    );
  });
});
