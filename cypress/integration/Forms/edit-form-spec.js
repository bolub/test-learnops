describe('Edit Form', () => {
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

  it('Checks if user can view a form', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept('GET', api.fetchAllForms, forms.forms).as('forms');
    cy.visit(routes.settings);
    cy.wait('@forms');
    cy.get(projectSelector.platformTab).should('be.visible').click();
    cy.get(formSelector.platformRequest).should('be.visible').click();

    cy.intercept(
      'GET',
      api.updateForm.replace('$', formSelector.formId),
      forms.newForm
    ).as('form');
    cy.get(formSelector.formRow.replace('$$', formSelector.formId))
      .should('be.visible')
      .click();
    cy.wait('@form');

    cy.get(formSelector.formTitleInput).should('be.visible');
    cy.get(formSelector.formRequestType).should('be.visible');
    cy.get(formSelector.formOwner).should('be.visible');
    cy.get(formSelector.formDescriptionInput).should('be.visible');
    cy.get(formSelector.formNextBtn).should('be.visible').click();
    cy.get(formSelector.formSaveBtn).should('be.visible').should('be.disabled');
  });

  it('Checks if user can edit a form', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept('GET', api.fetchAllForms, forms.forms).as('forms');
    cy.visit(routes.settings);
    cy.wait('@forms');
    cy.get(projectSelector.platformTab).should('be.visible').click();
    cy.get(formSelector.platformRequest).should('be.visible').click();

    cy.intercept(
      'GET',
      api.updateForm.replace('$', formSelector.formId),
      forms.newForm
    ).as('form');
    cy.get(formSelector.formRow.replace('$$', formSelector.formId))
      .should('be.visible')
      .click();
    cy.wait('@form');

    cy.get(formSelector.formTitleInput).type('{selectAll}{del}Form Title edit');
    cy.get(formSelector.formRequestType).click();
    cy.get(formSelector.typeOption).click();
    cy.get(formSelector.formDescriptionInput).type(
      '{selectAll}{del}Form Description edit'
    );
    cy.get(formSelector.formNextBtn).click();

    cy.intercept('PUT', api.updateForm.replace('$', '**'), {
      ...forms.newForm,
      data: {
        ...forms.newForm.data,
        title: 'Form Title edit',
        form_description: 'Form Description edit',
      },
    }).as('editedForm');
    cy.get(formSelector.formSaveBtn).should('not.be.disabled').click();
    cy.get(formSelector.unpublishedFormWarning).should('be.visible');
    cy.get(formSelector.unpublishedFormSave).should('be.visible').click();
    cy.wait('@editedForm');
    cy.location('pathname').should('eq', routes.settings);
  });
});
