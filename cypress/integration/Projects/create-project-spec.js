describe('Projects Page', () => {
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
    cy.signIn();
    cy.interceptApiRequests();
  });

  it('checks if add project button is visible and clickable', () => {
    const { selectors } = projects;
    const { routes } = constants;
    cy.visit(routes.projectsList);
    cy.get(selectors.addProjectButton).should('be.visible').click();
  });

  it('checks if project creation tabs are visible and  clickable', () => {
    const { selectors } = projects;
    const { routes } = constants;
    cy.visit(routes.projectsList);
    cy.get(selectors.addProjectButton).should('be.visible').click();
    cy.get(selectors.basicDetailsTab).should('be.visible').click();
    cy.get(selectors.resourceDetailsTab).should('be.visible').click();
    cy.get(selectors.budgetDetailsTab).should('be.visible').click();
  });

  it('checks if project basic details input is added', () => {
    const { selectors } = projects;
    const { routes } = constants;
    cy.visit(routes.projectsList);
    cy.get(selectors.addProjectButton).should('be.visible').click();
    cy.get(selectors.projectNameInput)
      .should('be.visible')
      .type(selectors.projectName);
    cy.get(selectors.addProjectOwnersButton).click();
    cy.contains(selectors.projectUserInput).click();
    cy.contains(selectors.projectUserInput).click();
    cy.get(selectors.projectCategory).should('be.visible').click();
    cy.contains(selectors.projectCategoryInput).click();
    cy.pickStartAndEndDates(selectors.projectDate);
    cy.get(selectors.projectTargetDate).click();
    cy.get(`[data-value=${21}]`).click();
    cy.get(selectors.projectStatus).should('be.visible').click();
    cy.selectDropdownItem({ label: 'New', value: 'new' });
    cy.get('[data-cy=project-form-body]').scrollTo('bottom');
    cy.get(selectors.projectPrivacy).should('be.visible').click();
    cy.selectDropdownItem({ label: 'Private', value: 'private' });
    cy.get('[data-cy=project-form-body]').scrollTo('top');
    cy.get(selectors.projectBusiness).should('be.visible').click();
    cy.selectDropdownItem({
      label: 'Test Company 1 - Business Team 1',
      value: '2e7449fe-1787-42cf-a7e8-cf478c11bd9f',
    });
    cy.get(selectors.projectProcessInput).click({ force: true });
    cy.selectDropdownItem({
      label: 'ADDIE',
      value: '73009fc1-19d2-405d-9ea8-7576177d747f',
    });
    cy.get(selectors.projectStageInput).should('be.visible').click();
    cy.selectDropdownItem({
      label: 'Analysis',
      value: '575eebd2-c629-4550-88c7-bf668067f559',
    });
    cy.get(selectors.projectPriorityInput).click({ force: true });
    cy.selectDropdownItem({ label: 'High', value: 'high' });
    cy.get(selectors.nextButton).should('be.visible').click();
  });

  it('checks if project resources details input is added', () => {
    const { routes } = constants;
    const { selectors } = projects;
    cy.visit(routes.projectsList);
    cy.get(selectors.addProjectButton).should('be.visible').click();
    cy.get(selectors.resourceDetailsTab).should('be.visible').click();
    cy.get(selectors.nextButton).should('be.visible').click();
  });

  it('checks if project budget details input is added', () => {
    const { selectors } = projects;
    const { routes } = constants;
    cy.visit(routes.projectsList);
    cy.get(selectors.addProjectButton).should('be.visible').click();
    cy.get(selectors.budgetDetailsTab).should('be.visible').click();
    cy.get(selectors.projectBudgetSource).click();
    cy.selectDropdownItem({
      label: 'Business budget',
      value: 'business_budget',
    });
    cy.get(selectors.projectAllocationBudget).type(
      selectors.projectEstimateInputValue
    );
    cy.get(selectors.projectEstimatedBudget).type(
      selectors.projectEstimateInputValue
    );
  });

  it.only('checks if project is created successfully', () => {
    const { routes, api } = constants;
    const { selectors, constantTexts } = projects;
    cy.intercept('POST', api.createProject).as('createProject');
    cy.visit(routes.projectsList);
    cy.get(selectors.addProjectButton).should('be.visible').click();
    cy.get(selectors.projectNameInput)
      .should('be.visible')
      .type(selectors.projectName);
    cy.get(selectors.addProjectOwnersButton).click();
    cy.contains(selectors.projectUserInput).click();
    cy.get(selectors.projectCategory).should('be.visible').click();
    cy.contains(selectors.projectCategoryInput).click();
    cy.pickStartAndEndDates(selectors.projectDate);
    cy.get(selectors.projectTargetDate).click();
    cy.get(`[data-value=${21}]`).click();
    cy.get(selectors.projectStatus).should('be.visible').click();
    cy.selectDropdownItem({ label: 'New', value: 'new' });
    cy.get('[data-cy=project-form-body]').scrollTo('bottom');
    cy.get(selectors.projectPrivacy).should('be.visible').click();
    cy.selectDropdownItem({ label: 'Private', value: 'private' });
    cy.get('[data-cy=project-form-body]').scrollTo('top');
    cy.get(selectors.projectBusiness).should('be.visible').click();
    cy.selectDropdownItem({
      label: 'Test Company 1 - Business Team 1',
      value: '2e7449fe-1787-42cf-a7e8-cf478c11bd9f',
    });
    cy.get('[data-cy=project-form-body]').scrollTo('bottom');
    cy.get(selectors.projectDescriptionInput).type(
      constantTexts.projectDescription
    );
    cy.get(selectors.projectProcessInput).click({ force: true });
    cy.selectDropdownItem({
      label: 'ADDIE',
      value: '73009fc1-19d2-405d-9ea8-7576177d747f',
    });
    cy.get(selectors.projectStageInput).should('be.visible').click();
    cy.selectDropdownItem({
      label: 'Analysis',
      value: '575eebd2-c629-4550-88c7-bf668067f559',
    });
    cy.get(selectors.projectPriorityInput).click({ force: true });
    cy.selectDropdownItem({ label: 'High', value: 'high' });
    cy.get(selectors.nextButton).should('be.visible').click();
    cy.get(selectors.resourceDetailsTab).should('be.visible').click();

    cy.get(selectors.projectResourceType).should('be.visible').click();

    cy.selectDropdownItem({
      label: 'Internal',
      value: 'internal',
    });

    cy.get(selectors.nextButton).should('be.visible').click();
    cy.get(selectors.budgetDetailsTab).should('be.visible').click();
    cy.get(selectors.projectBudgetSource).click();
    cy.selectDropdownItem({
      label: 'Business budget',
      value: 'business_budget',
    });
    cy.get(selectors.projectAllocationBudget).type(
      selectors.projectEstimateInputValue
    );
    cy.get(selectors.projectEstimatedBudget).type(
      selectors.projectEstimateInputValue
    );
    cy.get(selectors.saveButton).should('be.visible').click();
    cy.wait('@createProject');
    cy.get(selectors.projectSuccessModal).should('be.visible');
  });
});
