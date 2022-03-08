import get from 'lodash/get';

describe('Request Cancellation Notifications', () => {
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
    cy.signIn();
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
      cy.checkEmptyNotificationList(responseData);
    });
  });

  it('Checks new notification for request cancellation', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { newRequestCancellationNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, newRequestCancellationNotification).as(
      'fetchNotificationsList'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotificationsList').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');
      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')
          .should('have.class', 'bg-primary-lightest')
          .contains(data.data.triggererName)
          .contains(data.data.requestTitle);
      });
    });
  });

  it('Checks read notifications for request cancellation', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { readRequestCancellationNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(
      api.fetchNotifications,
      readRequestCancellationNotification
    ).as('fetchNotificationsList');

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotificationsList').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');
      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')
          .should('have.class', 'bg-neutral-white')
          .contains(data.data.triggererName)
          .contains(data.data.requestTitle);
      });
    });
  });

  it('Open a read request cancellation notification', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { cancelledRequestDetail },
      selectors: {
        requestDetailsTab,
        additionalDetailsTab,
        moreActionsButton,
        pendingCancellationBanner,
        pendingCancellationButton,
      },
    } = request;
    const {
      stubbedResponses: { newRequestCancellationNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );

    cy.intercept(api.fetchNotifications, newRequestCancellationNotification).as(
      'fetchNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');
      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[0].data.requestId),
        cancelledRequestDetail
      ).as('fetchRequestDetail');

      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')
          .contains(data.data.triggererName)
          .contains(data.data.requestTitle);
      });
      cy.get(
        selectors.notificationRow.replace('$', responseData[0].id)
      ).click();

      cy.url().should('include', `/request/${responseData[0].data.requestId}`);

      cy.wait('@fetchRequestDetail');
      cy.get(requestDetailsTab).should('be.visible');
      cy.get(additionalDetailsTab).should('be.visible');
      cy.get(moreActionsButton).should('be.visible');
      cy.get(pendingCancellationBanner).should('be.visible');
      cy.get(pendingCancellationButton).should('be.visible');
    });
  });

  it('Open a new request cancellation notification', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { cancelledRequestDetail },
      selectors: {
        requestDetailsTab,
        additionalDetailsTab,
        moreActionsButton,
        pendingCancellationBanner,
        pendingCancellationButton,
      },
    } = request;
    const {
      stubbedResponses: {
        openUnreadNotification,
        newRequestCancellationNotification,
      },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );

    cy.intercept(api.fetchNotifications, newRequestCancellationNotification).as(
      'fetchNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');

      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[0].data.requestId),
        cancelledRequestDetail
      ).as('fetchRequestDetail');

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')
          .contains(data.data.triggererName)
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

      cy.get(requestDetailsTab).should('be.visible');
      cy.get(additionalDetailsTab).should('be.visible');
      cy.get(moreActionsButton).should('be.visible');
      cy.get(pendingCancellationBanner).should('be.visible');
      cy.get(pendingCancellationButton).should('be.visible');
    });
  });

  it('Test mark all request cancellation notifications as read', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: {
        newRequestCancellationNotification,
        markReadNotifications,
      },
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, newRequestCancellationNotification).as(
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
