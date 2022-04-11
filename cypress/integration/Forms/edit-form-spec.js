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

  it('Checks if user can publish a form', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;

    cy.intercept(
      'GET',
      api.updateForm.replace('$', formSelector.formId),
      forms.newForm
    ).as('form');
    cy.visit(`${routes.settings}/form/${formSelector.formId}`);
    cy.wait('@form');

    cy.get(formSelector.formSwitch).should('not.be.checked');
    cy.intercept('PUT', api.updateForm.replace('$', '**'), {
      ...forms.newForm,
      data: { ...forms.newForm.data, data: { published: true } },
    }).as('publishedForm');
    cy.get(formSelector.formSwitch).check({ force: true });
    cy.wait('@publishedForm');
    cy.get(formSelector.formSwitch).should('be.checked');
  });

  it('Checks if user can unpublish a form', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;

    cy.intercept('GET', api.updateForm.replace('$', '**'), {
      ...forms.newForm,
      data: { ...forms.newForm.data, data: { published: true } },
    }).as('form');
    cy.visit(`${routes.settings}/form/${formSelector.formId}`);
    cy.wait('@form');

    cy.get(formSelector.formSwitch).should('be.checked');
    cy.intercept('PUT', api.updateForm.replace('$', '**'), forms.newForm).as(
      'publishedForm'
    );
    cy.get(formSelector.formSwitch).uncheck({ force: true });
    cy.wait('@publishedForm');
    cy.get(formSelector.formSwitch).should('not.be.checked');
  });

  it('Checks if user can delete a form from individual view', () => {
    const { routes, api } = constants;
    const { selectors: formSelector } = forms;
    const { selectors: projectSelector } = project;
    const deletedForms = forms.forms.data.filter(
      (form) => form.id !== formSelector.formId
    );

    cy.intercept('GET', api.updateForm.replace('$', '**'), {
      ...forms.forms,
      data: forms.forms.data[0],
    }).as('form');
    cy.visit(`${routes.settings}/form/${formSelector.formId}`);
    cy.wait('@form');

    cy.get(formSelector.formListActions).click();
    cy.get(formSelector.deleteOption).eq(0).click();
    cy.get(formSelector.deleteModal).should('be.visible');

    cy.intercept('DELETE', api.updateForm.replace('$', formSelector.formId), {
      ...forms.forms,
      data: forms.forms.data[0],
    }).as('deleteForm');
    cy.intercept('GET', api.fetchAllForms, {
      ...forms.forms,
      data: deletedForms,
    }).as('getForms');

    cy.get(formSelector.deleteFormButton).click();
    cy.wait('@deleteForm');
    cy.get(formSelector.deleteModal).should('not.exist');
    cy.location('pathname').should('eq', routes.settings);

    cy.wait('@getForms');
    cy.get(projectSelector.platformTab).should('be.visible').click();
    cy.get(formSelector.platformRequest).should('be.visible').click();
    cy.get(formSelector.formRow.replace('$$', formSelector.formId)).should(
      'not.exist'
    );
  });
});
