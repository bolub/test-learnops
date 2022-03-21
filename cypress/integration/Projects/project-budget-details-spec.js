import get from 'lodash/get';

describe('Budget Details Page', () => {
  let projectBudgets, constants, projects;

  before(() => {
    cy.fixture('projectBudgets').then((content) => (projectBudgets = content));
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

  it('Display the budget categories in the budget table', () => {
    const { api, routes } = constants;
    const {
      stubData,
      selectors: {
        budgetHeaderTab,
        budgetTab,
        budgetListTable: {
          budgetTable,
          budgetRow,
          budgetCategoryHeader,
          budgetAllocatedBudgetHeader,
          budgetCostToDateHeader,
          budgetNotesHeader,
        },
      },
    } = projectBudgets;
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(
      api.fetchBudgetCategories.replace('*', projectId),
      stubData
    ).as('fetchProjectBudgetCategories');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(budgetHeaderTab).should('be.visible').click();
    cy.wait('@fetchProjectBudgetCategories').then((payload) => {
      cy.get(budgetTab).should('be.visible').click();
      cy.get(budgetTable).should('be.visible').click();
      const responseData = get(payload, 'response.body.data.budgets');
      expect(responseData).not.to.be.empty;
      cy.get(budgetCategoryHeader).should('be.visible');
      cy.get(budgetAllocatedBudgetHeader).should('be.visible');
      cy.get(budgetCostToDateHeader).should('be.visible');
      cy.get(budgetNotesHeader).should('be.visible');

      responseData.map((data) => {
        cy.get(budgetRow.replace('*', data.id)).should('be.visible');
        return null;
      });
    });
  });

  it('Create budgets for an multiple categories', () => {
    const { api, routes } = constants;
    const {
      selectors: {
        budgetHeaderTab,
        budgetTab,
        budgetListTable: {
          budgetTable,
          budgetRow,
          allocatedBudgetInput,
          costToDateInput,
          notesInput,
          saveBudgetButton,
          editBudgetButton,
        },
      },
    } = projectBudgets;
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchBudgetCategories.replace('*', projectId)).as(
      'fetchProjectBudgetCategories'
    );

    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(budgetHeaderTab).should('be.visible').click();
    cy.wait('@fetchProjectBudgetCategories').then((payload) => {
      cy.get(budgetTab).should('be.visible').click();
      cy.get(budgetTable).should('be.visible').click();
      const responseData = get(payload, 'response.body.data.budgets');
      cy.get(budgetRow.replace('*', responseData[1].id)).should('be.visible');
      cy.get(editBudgetButton.replace('*', responseData[1].id))
        .should('be.visible')
        .click();
      cy.get(allocatedBudgetInput.replace('*', responseData[1].id))
        .should('be.visible')
        .click()
        .clear()
        .type(1000);
      cy.get(costToDateInput.replace('*', responseData[1].id))
        .should('be.visible')
        .click()
        .clear()
        .type(400);
      cy.get(notesInput.replace('*', responseData[1].id))
        .should('be.visible')
        .click()
        .clear()
        .type('Sample budget text');
      cy.get(saveBudgetButton.replace('*', responseData[1].id))
        .should('be.visible')
        .click();
      cy.get(budgetTab).should('be.visible').click();
      cy.get(budgetRow.replace('*', responseData[2].id)).should('be.visible');
      cy.get(editBudgetButton.replace('*', responseData[2].id))
        .should('be.visible')
        .click();
      cy.get(allocatedBudgetInput.replace('*', responseData[2].id))
        .should('be.visible')
        .click()
        .clear()
        .type(4321);
      cy.get(costToDateInput.replace('*', responseData[2].id))
        .should('be.visible')
        .click()
        .clear()
        .type(2100);
      cy.get(notesInput.replace('*', responseData[2].id))
        .should('be.visible')
        .click()
        .clear()
        .type('Lorem Ipsum');
      cy.get(saveBudgetButton.replace('*', responseData[2].id))
        .should('be.visible')
        .click();
      cy.reload();
      cy.get(budgetTab).should('be.visible').click();
      cy.wait('@fetchProject');
      cy.get(budgetRow.replace('*', responseData[1].id))
        .should('be.visible')
        .contains('Sample budget text');
      cy.get(budgetRow.replace('*', responseData[1].id))
        .should('be.visible')
        .contains(1000);
      cy.get(budgetRow.replace('*', responseData[1].id))
        .should('be.visible')
        .contains(400);
      cy.get(budgetRow.replace('*', responseData[2].id))
        .should('be.visible')
        .contains(4321);
      cy.get(budgetRow.replace('*', responseData[2].id))
        .should('be.visible')
        .contains(2100);
      cy.get(budgetRow.replace('*', responseData[2].id))
        .should('be.visible')
        .contains('Lorem Ipsum');
    });
  });

  it('Checks if cancel button works', () => {
    const { api, routes } = constants;
    const {
      stubData,
      selectors: {
        budgetHeaderTab,
        budgetTab,
        budgetListTable: {
          budgetTable,
          budgetRow,
          cancelBudgetButton,
          editBudgetButton,
        },
      },
    } = projectBudgets;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(
      api.fetchBudgetCategories.replace('*', projectId),
      stubData
    ).as('fetchProjectBudgetCategories');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(budgetHeaderTab).should('be.visible').click();
    cy.wait('@fetchProjectBudgetCategories').then((payload) => {
      cy.get(budgetTab).should('be.visible').click();
      cy.get(budgetTable).should('be.visible').click();
      const responseData = get(payload, 'response.body.data.budgets');
      expect(responseData).not.to.be.empty;
      cy.get(budgetRow.replace('*', responseData[0].id)).should('be.visible');
      cy.get(editBudgetButton.replace('*', responseData[0].id))
        .should('be.visible')
        .click();
      cy.get(cancelBudgetButton.replace('*', responseData[0].id))
        .should('be.visible')
        .click();
      cy.get(budgetRow.replace('*', responseData[1].id)).should('be.visible');
      cy.get(editBudgetButton.replace('*', responseData[1].id))
        .should('be.visible')
        .click();
      cy.get(cancelBudgetButton.replace('*', responseData[1].id))
        .should('be.visible')
        .click();
      cy.get(budgetRow.replace('*', responseData[2].id)).should('be.visible');
      cy.get(editBudgetButton.replace('*', responseData[2].id))
        .should('be.visible')
        .click();
      cy.get(cancelBudgetButton.replace('*', responseData[2].id))
        .should('be.visible')
        .click();
    });
  });

  it('Check if tooltip shows if the budget exceeds budget plan', () => {
    const { api, routes } = constants;
    const {
      stubData,
      selectors: {
        budgetHeaderTab,
        budgetTab,
        budgetListTable: {
          budgetTable,
          budgetRow,
          allocatedBudgetInput,
          saveBudgetButton,
          editBudgetButton,
          budgetExceededTooltip,
        },
      },
    } = projectBudgets;

    const {
      selectors: {
        projectBudgetSource,
        projectAllocationBudget,
        updateProjectBudgetPlanSaveButton,
      },
    } = projects;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(
      api.fetchBudgetCategories.replace('*', projectId),
      stubData
    ).as('fetchProjectBudgetCategories');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(budgetHeaderTab).should('be.visible').click();
    cy.get(projectBudgetSource).click();
    cy.selectDropdownItem({ label: 'Special funding', value: 'special' });
    cy.get(projectAllocationBudget).clear().type('8');
    cy.intercept('PUT', `${api.fetchProjects}/${projectId}`).as(
      'updateProject'
    );
    cy.get(updateProjectBudgetPlanSaveButton).click();
    cy.wait('@updateProject');
    cy.checkSuccessMessage();
    cy.reload();
    cy.wait('@fetchProject');
    cy.get(projectAllocationBudget).should('have.value', '8');
    cy.get(projectBudgetSource).should('have.text', 'Special funding');
    cy.wait('@fetchProjectBudgetCategories').then((payload) => {
      cy.get(budgetTab).should('be.visible').click();
      cy.get(budgetTable).should('be.visible').click();
      const responseData = get(payload, 'response.body.data.budgets');
      expect(responseData).not.to.be.empty;
      cy.get(budgetRow.replace('*', responseData[1].id)).should('be.visible');
      cy.get(editBudgetButton.replace('*', responseData[1].id))
        .should('be.visible')
        .click();
      cy.get(allocatedBudgetInput.replace('*', responseData[1].id))
        .should('be.visible')
        .click()
        .clear()
        .type(1000);
      cy.get(saveBudgetButton.replace('*', responseData[1].id))
        .should('be.visible')
        .click();
      cy.get(budgetExceededTooltip.replace('*', 1)).should('be.visible');
    });
  });
});
