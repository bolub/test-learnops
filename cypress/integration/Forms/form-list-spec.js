describe('Vew Forms', () => {
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

  it('Checks if platform request forms and colums are visible', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept(api.usersApi).as('users');
    cy.visit(routes.settings);
    cy.wait('@users');
    cy.get(projectSelector.platformTab).should('be.visible').click();
    cy.get(formSelector.platformRequest).should('be.visible').click();
    cy.get(formSelector.tableHeader).should('be.visible');
    cy.contains(formSelector.formTitle).should('be.visible');
    cy.contains(formSelector.requestTitle).should('be.visible');
    cy.get(formSelector.formWindow)
      .contains('Description')
      .should('be.visible');
    cy.contains(formSelector.formCreator).should('be.visible');
    cy.contains(formSelector.lastUpdate).should('be.visible');
    cy.get(formSelector.formWindow)
      .contains(formSelector.platformStatus)
      .should('be.visible');
    cy.get(formSelector.formWindow)
      .contains(formSelector.creationDate)
      .should('be.visible');
  });

  it('Checks if search filter works on form', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept(api.usersApi).as('users');
    cy.visit(routes.settings);
    cy.wait('@users');
    cy.get(projectSelector.platformTab).should('be.visible').click();
    cy.get(formSelector.platformRequest).should('be.visible').click();
    cy.get(formSelector.tableHeader).should('be.visible');
    cy.contains(formSelector.formTitle).should('be.visible');
    cy.contains(formSelector.requestTitle).should('be.visible');
    cy.get(formSelector.formWindow)
      .contains('Description')
      .should('be.visible');
    cy.contains(formSelector.formCreator).should('be.visible');
    cy.contains(formSelector.lastUpdate).should('be.visible');
    cy.get(formSelector.formWindow)
      .contains(formSelector.platformStatus)
      .should('be.visible');
    cy.get(formSelector.formWindow)
      .contains(formSelector.creationDate)
      .should('be.visible');
    cy.get(formSelector.formSearch).should('be.visible').type('Request 6');
    cy.get(formSelector.formWindow)
      .contains(formSelector.filteredSearch)
      .should('be.visible');
  });

  it('User can duplicate form and be redirected to it', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept('GET', api.fetchAllForms, forms.forms).as('forms');
    cy.visit(routes.settings);
    cy.wait('@forms');
    cy.get(projectSelector.platformTab).click();
    cy.get(formSelector.platformRequest).click();
    cy.get(formSelector.formRow.replace('$$', formSelector.formId)).within(() =>
      cy.get(formSelector.formListActions).click()
    );
    cy.get(formSelector.duplicateOption).eq(0).click();
    cy.get(formSelector.duplicateModal).should('be.visible');
    cy.get(formSelector.originalName).contains(forms.forms.data[0].title);
    cy.get(formSelector.newName)
      .should('be.visible')
      .should('have.value', `${forms.forms.data[0].title} - Copy`);
    cy.intercept(
      'POST',
      api.updateForm.replace('$', `duplicate/${formSelector.formId}`),
      forms.newForm
    ).as('duplicateForm');
    cy.get(formSelector.saveOpen).click();
    cy.wait('@duplicateForm');
    cy.location('pathname').should('include', `${routes.settings}/form/`);
  });

  it('User can duplicate form and stay in form list', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept('GET', api.fetchAllForms, forms.forms).as('forms');
    cy.visit(routes.settings);
    cy.wait('@forms');
    cy.get(projectSelector.platformTab).click();
    cy.get(formSelector.platformRequest).click();
    cy.get(formSelector.formRow.replace('$$', formSelector.formId)).within(() =>
      cy.get(formSelector.formListActions).click()
    );
    cy.get(formSelector.duplicateOption).eq(0).click();
    cy.get(formSelector.duplicateModal).should('be.visible');
    cy.get(formSelector.originalName).contains(forms.forms.data[0].title);
    cy.get(formSelector.newName)
      .should('be.visible')
      .should('have.value', `${forms.forms.data[0].title} - Copy`);
    cy.intercept(
      'POST',
      api.updateForm.replace('$', `duplicate/${formSelector.formId}`),
      forms.newForm
    ).as('duplicateForm');
    cy.get(formSelector.save).click();
    cy.wait('@duplicateForm');
    cy.location('pathname').should('eq', routes.settings);
  });

  it('User can cancel duplication of form', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept('GET', api.fetchAllForms, forms.forms).as('forms');
    cy.visit(routes.settings);
    cy.wait('@forms');
    cy.get(projectSelector.platformTab).click();
    cy.get(formSelector.platformRequest).click();
    cy.get(formSelector.formRow.replace('$$', formSelector.formId)).within(() =>
      cy.get(formSelector.formListActions).click()
    );
    cy.get(formSelector.duplicateOption).eq(0).click();
    cy.get(formSelector.duplicateModal).should('be.visible');
    cy.get(formSelector.originalName).contains(forms.forms.data[0].title);
    cy.get(formSelector.newName)
      .should('be.visible')
      .should('have.value', `${forms.forms.data[0].title} - Copy`);
    cy.get(formSelector.cancel).click();
    cy.get(formSelector.duplicateModal).should('not.exist');
  });

  it('User can delete form from the list', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;

    cy.intercept('GET', api.fetchAllForms, forms.forms).as('forms');
    cy.visit(routes.settings);
    cy.wait('@forms');
    cy.get(projectSelector.platformTab).click();
    cy.get(formSelector.platformRequest).click();
    cy.get(formSelector.formRow.replace('$$', formSelector.formId)).within(() =>
      cy.get(formSelector.formListActions).click()
    );
    cy.get(formSelector.deleteOption).eq(0).click();
    cy.get(formSelector.deleteModal).should('be.visible');
    cy.intercept('DELETE', api.updateForm.replace('$', formSelector.formId), {
      ...forms.newForm,
      data: forms.forms.data[0],
    }).as('deleteForm');
    cy.get(formSelector.deleteFormButton).click();
    cy.wait('@deleteForm');
    cy.get(formSelector.deleteModal).should('not.exist');
    cy.get(formSelector.formRow.replace('$$', formSelector.formId)).should(
      'not.exist'
    );
  });
});
