import get from 'lodash/get';

describe('Request Owner Notification for Submitted Request', () => {
  let constants, requestList, notifications, request;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('requestList').then((content) => (requestList = content));
    cy.fixture('request').then((content) => (request = content));
    cy.fixture('notifications').then((content) => (notifications = content));
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

  it('Checks empty notification list', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { emptyNotifications },
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, emptyNotifications).as(
      'fetchNotificationsList'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();
    cy.wait('@fetchNotificationsList').then(({ response }) => {
      const responseData = get(response, 'body.data.notifications');
      expect(responseData).to.be.empty;
    });
  });

  it('Checks new notifications', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { newRequestOwnerNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, newRequestOwnerNotification).as(
      'fetchNotificationsList'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();
    cy.get(
      selectors.notificationRow.replace(
        '$',
        newRequestOwnerNotification.data.notifications[0].id
      )
    )
      .should('be.visible')
      .should('have.class', 'bg-primary-lightest')
      .contains(
        newRequestOwnerNotification.data.notifications[0].data.triggererName
      )
      .contains(
        newRequestOwnerNotification.data.notifications[0].data.requestFormName
      );
  });

  it('Checks read notifications', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { readRequestOwnerNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, readRequestOwnerNotification).as(
      'fetchNotificationsList'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();
    cy.get(
      selectors.notificationRow.replace(
        '$',
        readRequestOwnerNotification.data.notifications[0].id
      )
    )
      .should('be.visible')
      .should('have.class', 'bg-neutral-white')
      .contains(
        readRequestOwnerNotification.data.notifications[0].data.triggererName
      )
      .contains(
        readRequestOwnerNotification.data.notifications[0].data.requestFormName
      );
  });

  it('Open a read notification', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { submittedRequestResponse },
      selectors: {
        moreActionsButton,
        lDOnlyTab,
        ldOnlyTitle,
        ldOnlyEstimatedCost,
        ldOnlyEstimatedEffort,
      },
    } = request;
    const {
      stubbedResponses: { requestOwnerNotificationsList },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );

    cy.intercept(api.fetchNotifications, requestOwnerNotificationsList).as(
      'fetchNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');
      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[0].data.requestId),
        submittedRequestResponse
      ).as('fetchRequestDetail');

      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')

          .contains(data.data.triggererName)
          .contains(data.data.requestFormName);
      });
      cy.get(
        selectors.notificationRow.replace('$', responseData[0].id)
      ).click();

      cy.url().should('include', `/request/${responseData[0].data.requestId}`);

      cy.wait('@fetchRequestDetail');

      cy.get(lDOnlyTab).click();
      cy.get(ldOnlyTitle).should('be.visible').and('have.text', 'L&D Only');
      cy.get(ldOnlyEstimatedCost).should('be.visible');
      cy.get(ldOnlyEstimatedEffort).should('be.visible');
      cy.get(moreActionsButton).should('be.visible');
    });
  });

  it('Open a new notification', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { submittedRequestResponse },
      selectors: {
        moreActionsButton,
        lDOnlyTab,
        ldOnlyTitle,
        ldOnlyEstimatedCost,
        ldOnlyEstimatedEffort,
      },
    } = request;
    const {
      stubbedResponses: {
        openUnreadNotification,
        requestOwnerNotificationsList,
      },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );

    cy.intercept(api.fetchNotifications, requestOwnerNotificationsList).as(
      'fetchNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');

      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[1].data.requestId),
        submittedRequestResponse
      ).as('fetchRequestDetail');

      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')

          .contains(data.data.triggererName)
          .contains(data.data.requestFormName);
      });

      cy.intercept(
        'PUT',
        api.fetchNotification.replace('**', responseData[1].id),
        openUnreadNotification
      ).as('updateNotification');

      cy.get(
        selectors.notificationRow.replace('$', responseData[1].id)
      ).click();

      cy.wait('@updateNotification').then((payload) => {
        const responseData = get(payload, 'response.body.data.notification');
        expect(responseData.status).eq('read');
      });

      cy.url().should('include', `/request/${responseData[1].data.requestId}`);

      cy.wait('@fetchRequestDetail');

      cy.get(lDOnlyTab).click();
      cy.get(ldOnlyTitle).should('be.visible').and('have.text', 'L&D Only');
      cy.get(ldOnlyEstimatedCost).should('be.visible');
      cy.get(ldOnlyEstimatedEffort).should('be.visible');
      cy.get(moreActionsButton).should('be.visible');
    });
  });

  it('Test mark all as read', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: {
        requestOwnerNotificationsList,
        markReadNotifications,
      },
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, requestOwnerNotificationsList).as(
      'fetchNotifications'
    );

    cy.intercept('PUT', api.markNotificationAsRead, markReadNotifications).as(
      'updateNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();
    cy.contains('Mark All As Read').should('be.visible').click();

    cy.wait('@updateNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.updatedRows');
      expect(responseData).to.be.empty;
    });
  });
});
