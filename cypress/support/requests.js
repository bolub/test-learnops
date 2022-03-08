import get from 'lodash/get';

Cypress.Commands.add('getRequests', (requestRoute) => {
  cy.server();
  cy.route('GET', requestRoute).as('requests');
  return cy.wait('@requests').then((xhr) => {
    expect(xhr.status).to.eq(200);
    // eslint-disable-next-line no-unused-expressions
    expect(xhr.response).not.to.be.empty;
    const {
      response: { body },
    } = xhr;
    return body;
  });
});

Cypress.Commands.add(
  'createRequestAndGoToRequestList',
  (title = 'New Request', type = 'save') => {
    let requestList, singleRequestFixtures;

    cy.fixture('requestList').then((content) => {
      requestList = content;

      cy.fixture('request').then((content) => {
        singleRequestFixtures = content;
        const { selectors: singleRequestSelectors, stubbedResponses } =
          singleRequestFixtures;
        const { selectors } = requestList;
        const { details } = selectors;

        let requestSaveButton =
          type === 'save'
            ? singleRequestSelectors.saveExitButton
            : singleRequestSelectors.submitButton;

        cy.visit('/requests-list');

        cy.intercept('GET', '/api/form/?organization_id=**&published=true').as(
          'fetchFormOptions',
          stubbedResponses.formOptions
        );
        cy.get(selectors.addRequestButton).click();
        cy.wait('@fetchFormOptions').then((payload) => {
          const responseData = get(payload, 'response.body');

          const firstForm = {
            label: responseData[0].title,
            value: responseData[0].id,
          };

          cy.url().should('include', '/request');

          cy.get(singleRequestSelectors.trainingTypeDropdown).click();
          cy.get('[role=listbox]:first').click();

          cy.get(singleRequestSelectors.formTypeDropdown).click();
          cy.get(`[data-value='${JSON.stringify(firstForm)}']`).click();

          cy.intercept('/api/form/**').as('requestCreation');
          cy.get(singleRequestSelectors.applyButton).click();

          cy.wait('@requestCreation').then((payload) => {
            const responseData = get(payload, 'response.body.data');
            expect(responseData).not.to.be.empty;

            const requestId = responseData.id;

            cy.get(details.requestTitleField).type(title);
            cy.get(singleRequestSelectors.nextButton).click();

            cy.get(details.requestDescriptionField).type(
              'New request description'
            );

            cy.intercept('PUT', '/api/request/$'.replace('$', requestId)).as(
              'saveRequest'
            );
            cy.get(requestSaveButton).click();

            return cy.wait('@saveRequest').then((payload) => {
              const responseData = get(payload, 'response.body.data');
              return responseData;
            });
          });
        });
      });
    });
  }
);

Cypress.Commands.add('deleteRequestFromTable', (requestId) => {
  cy.fixture('requestList').then((content) => {
    const { deleteDraft } = content.selectors;

    cy.get(`[data-cy=request-delete-button-${requestId}]`)
      .first()
      .click({ force: true });
    cy.contains(`${deleteDraft.deleteAction}`).should('be.visible').click();
    cy.get(`${deleteDraft.successFeedback}`).should('be.visible');
    cy.reload();
    cy.contains(`${deleteDraft.draftTitle}`).should('not.exist');
  });
});

Cypress.Commands.add('deleteSubmittedRequest', (requestId) => {
  cy.fixture('request').then((content) => {
    const { selectors: singleRequestSelectors } = content;

    cy.intercept('GET', 'api/form/?organization_id=**&published=true').as(
      'fetchFormOptions'
    );

    cy.visit('/request/**'.replace('**', requestId));

    cy.wait('@fetchFormOptions').then((payload) => {
      const responseData = get(payload, 'response.body');

      const secondForm = {
        label: responseData[0].title,
        value: responseData[0].id,
      };

      cy.get(singleRequestSelectors.formTypeDropdown).click();
      cy.get(`[data-value='${JSON.stringify(secondForm)}']`).click();

      cy.intercept('GET', '/api/request/**').as('requestCreation');

      cy.intercept('DELETE', 'api/request/**'.replace('**', requestId)).as(
        'removeRequest'
      );

      cy.get(singleRequestSelectors.changeFormModal)
        .should('be.visible')
        .get(singleRequestSelectors.changeFormButton)
        .click();

      cy.wait('@removeRequest');
      cy.wait('@requestCreation');
      cy.wait(2000);

      cy.url().then((url) => {
        const newRequestId = url.split('/request/')[1];

        cy.get('[data-cy=field__request-title]')
          .should('be.visible')
          .type('New request title');
        cy.get(singleRequestSelectors.nextButton).click();

        cy.intercept('PUT', '/api/request/$'.replace('$', newRequestId)).as(
          'saveRequest'
        );
        cy.get(singleRequestSelectors.saveExitButton).click();
        cy.wait('@saveRequest');
        cy.visit('/requests-list');
        cy.get('[data-testid=tab-1]').click();
        cy.wait('@myRequests');

        cy.get('[data-cy=request__title-$]'.replace('$', newRequestId)).should(
          'be.visible'
        );

        cy.deleteRequestFromTable(newRequestId);
      });
    });
  });
});
