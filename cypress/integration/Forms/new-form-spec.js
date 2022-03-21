describe('Create Forms', () => {
  let constants, forms, project;

  before('Load Fixtures', () => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('forms').then((content) => (forms = content));
    cy.fixture('projectsProcesses').then((content) => (project = content));
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

  it('Checks if user can create new form', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept('GET', api.fetchAllForms, forms.forms).as('forms');
    cy.visit(routes.settings);
    cy.wait('@forms');
    cy.get(projectSelector.platformTab).should('be.visible').click();
    cy.get(formSelector.platformRequest).should('be.visible').click();
    cy.get(formSelector.addFormBtn).should('be.visible').click();

    cy.get(formSelector.formTitleInput).should('be.visible').type('Form Title');
    cy.get(formSelector.formRequestType).should('be.visible').click();
    cy.get(formSelector.typeOption).click();
    cy.get(formSelector.formDescriptionInput)
      .should('be.visible')
      .type('Form Description');
    cy.intercept('POST', api.updateForm.replace('$', ''), forms.newForm).as(
      'newForm'
    );
    cy.get(formSelector.formNextBtn)
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get(formSelector.formSaveBtn)
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.wait('@newForm');
  });
});
