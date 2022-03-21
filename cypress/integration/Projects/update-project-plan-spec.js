describe('Update project plan e2e', () => {
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
    cy.interceptApiRequests();
  });

  const visitProjectBudgetPage = () => {
    const { api, routes } = constants;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');

    cy.visit(`${routes.projectPage}${projectId}?tab=budget`);
    cy.wait('@fetchProject');
  };

  it('Checks for budget plan fields and components', () => {
    const {
      selectors: {
        projectBudgetSource,
        projectAllocationBudget,
        projectEstimatedBudget,
        updateProjectBudgetPlanSaveButton,
        updateProjectBudgetPlanCancelButton,
      },
    } = projects;

    visitProjectBudgetPage();

    cy.get('[data-testid=tab-0]').should('have.text', 'Budget Plan');

    cy.get(projectBudgetSource).should('be.visible');
    cy.get(projectAllocationBudget).should('be.visible');
    cy.get(projectEstimatedBudget).should('be.visible');
    cy.get(updateProjectBudgetPlanCancelButton).should('be.visible');
    cy.get(updateProjectBudgetPlanSaveButton).should('be.visible');
  });

  it('Checks if cancel option works', () => {
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';

    const {
      selectors: { updateProjectBudgetPlanCancelButton },
    } = projects;

    visitProjectBudgetPage();

    cy.get(updateProjectBudgetPlanCancelButton).click();
    cy.url().should('include', `/project/${projectId}?tab=overview`);
  });

  it('Checks if budget plan fields are updated', () => {
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    const { api } = constants;

    const {
      selectors: {
        projectBudgetSource,
        projectAllocationBudget,
        projectEstimatedBudget,
        updateProjectBudgetPlanSaveButton,
      },
    } = projects;

    visitProjectBudgetPage();

    cy.get(projectBudgetSource).click();
    cy.selectDropdownItem({ label: 'Special funding', value: 'special' });
    cy.get(projectEstimatedBudget).clear().type('4000');
    cy.get(projectAllocationBudget).clear().type('8000');

    cy.intercept('PUT', `${api.fetchProjects}/${projectId}`).as(
      'updateProject'
    );

    cy.get(updateProjectBudgetPlanSaveButton).click();

    cy.wait('@updateProject');
    cy.checkSuccessMessage();

    cy.reload();
    cy.wait('@fetchProject');

    cy.get(projectEstimatedBudget).should('have.value', '4000');
    cy.get(projectAllocationBudget).should('have.value', '8000');
    cy.get(projectBudgetSource).should('have.text', 'Special funding');
  });
});
