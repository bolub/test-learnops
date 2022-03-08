import get from 'lodash/get';

describe('Notifications for Assigning New Request Owner', () => {
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

  it('Checks empty request owner notification list', () => {
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
      cy.checkEmptyNotificationList(responseData);
    });
  });

  it('Checks new notifications for assigning a new request owner', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { assignNewOwnerNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, assignNewOwnerNotification).as(
      'fetchNotificationsList'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();
    cy.get(
      selectors.notificationRow.replace(
        '$',
        assignNewOwnerNotification.data.notifications[0].id
      )
    )
      .should('be.visible')
      .should('have.class', 'bg-primary-lightest')
      .contains(
        assignNewOwnerNotification.data.notifications[0].data.triggererName
      )
      .contains('assigned you as owner')
      .contains(
        assignNewOwnerNotification.data.notifications[0].data.requestTitle
      );
  });

  it('Checks read notifications for assigning a new request owner', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { assignReadOwnerNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, assignReadOwnerNotification).as(
      'fetchNotificationsList'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();
    cy.get(
      selectors.notificationRow.replace(
        '$',
        assignReadOwnerNotification.data.notifications[0].id
      )
    )
      .should('be.visible')
      .should('have.class', 'bg-neutral-white')
      .contains(
        assignReadOwnerNotification.data.notifications[0].data.triggererName
      )
      .contains('assigned you as owner')
      .contains(
        assignReadOwnerNotification.data.notifications[0].data.requestTitle
      );
  });

  it('Open a read notification for assigning a new request owner', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { requestListResponse },
      selectors: {
        details: { addRequestOwnerButton },
      },
    } = requestList;
    const {
      stubbedResponses: { requestLdUsers, approvedRequestResponse },
      selectors: {
        moreActionsButton,
        landDTab,
        ldOnlyTitle,
        ldOnlyEstimatedCost,
        ldOnlyEstimatedEffort,
      },
    } = request;
    const {
      stubbedResponses: { assignReadOwnerNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, requestListResponse).as('allRequests');

    cy.intercept(api.fetchNotifications, assignReadOwnerNotification).as(
      'fetchNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');
      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[0].data.requestId),
        approvedRequestResponse
      ).as('fetchRequestDetail');
      cy.intercept('GET', api.ldUsers, requestLdUsers).as('requestOwners');
      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')

          .contains(data.data.triggererName)
          .contains('assigned you as owner')
          .contains(data.data.requestTitle);
      });
      cy.get(
        selectors.notificationRow.replace('$', responseData[0].id)
      ).click();

      cy.url().should('include', `/request/${responseData[0].data.requestId}`);

      cy.wait('@fetchRequestDetail');

      cy.get(addRequestOwnerButton).should('be.visible').click();

      cy.wait('@requestOwners');

      cy.get(landDTab).click();
      cy.get(ldOnlyTitle).should('be.visible').and('have.text', 'L&D Only');
      cy.get(ldOnlyEstimatedCost).should('be.visible');
      cy.get(ldOnlyEstimatedEffort).should('be.visible');
      cy.get(moreActionsButton).should('be.visible');
    });
  });

  it('Open a new notification for assigning a new request owner', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { requestListResponse },
      selectors: {
        details: { addRequestOwnerButton },
      },
    } = requestList;
    const {
      stubbedResponses: { requestLdUsers, approvedRequestResponse },
      selectors: {
        moreActionsButton,
        landDTab,
        ldOnlyTitle,
        ldOnlyEstimatedCost,
        ldOnlyEstimatedEffort,
      },
    } = request;
    const {
      stubbedResponses: { openUnreadNotification, assignNewOwnerNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, requestListResponse).as('allRequests');

    cy.intercept(api.fetchNotifications, assignNewOwnerNotification).as(
      'fetchNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');

      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[0].data.requestId),
        approvedRequestResponse
      ).as('fetchRequestDetail');
      cy.intercept('GET', api.ldUsers, requestLdUsers).as('requestOwners');
      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')

          .contains(data.data.triggererName)
          .contains('assigned you as owner')
          .contains(data.data.requestTitle);
      });

      cy.intercept(
        'PUT',
        api.fetchNotification.replace('**', responseData[0].id),
        openUnreadNotification
      ).as('updateNotification');

      cy.get(
        selectors.notificationRow.replace('$', responseData[0].id)
      ).click();

      cy.wait('@updateNotification').then((payload) => {
        const responseData = get(payload, 'response.body.data.notification');
        expect(responseData.status).eq('read');
      });

      cy.url().should('include', `/request/${responseData[0].data.requestId}`);

      cy.wait('@fetchRequestDetail');
      cy.get(addRequestOwnerButton).should('be.visible').click();

      cy.wait('@requestOwners');
      cy.get(landDTab).click();
      cy.get(ldOnlyTitle).should('be.visible').and('have.text', 'L&D Only');
      cy.get(ldOnlyEstimatedCost).should('be.visible');
      cy.get(ldOnlyEstimatedEffort).should('be.visible');
      cy.get(moreActionsButton).should('be.visible');
    });
  });
});
