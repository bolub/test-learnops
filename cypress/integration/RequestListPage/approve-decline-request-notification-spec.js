import get from 'lodash/get';

describe('Request Approval / Declination  Notifications', () => {
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
      selectors: { notificationEmptyList },
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
      cy.get(notificationEmptyList)
        .should('be.visible')
        .should('have.text', 'No notifications yet!')
        .contains('No notifications yet!');
    });
  });

  it('Checks new notifications for request status change', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { unreadRequestStatusNotificationsList },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(
      api.fetchNotifications,
      unreadRequestStatusNotificationsList
    ).as('fetchNotificationsList');

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotificationsList').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');
      expect(responseData).not.to.be.empty;
      let status;

      responseData.map((data) => {
        if (data.data.currentStatus === 'rejected') {
          status = 'declined';

          cy.get(selectors.notificationRow.replace('$', data.id))
            .should('be.visible')
            .should('have.class', 'bg-primary-lightest')
            .contains(
              `The request form ${data.data.requestTitle} has been ${status} by the request owner`
            );
        }
      });
    });
  });

  it('Checks read request status change notifications', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { readRequestStatusNotificationsList },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, readRequestStatusNotificationsList).as(
      'fetchNotificationsList'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotificationsList').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');
      expect(responseData).not.to.be.empty;
      let status;

      responseData.map((data) => {
        if (data.data.currentStatus === 'rejected') {
          status = 'declined';

          cy.get(selectors.notificationRow.replace('$', data.id))
            .should('be.visible')
            .should('have.class', 'bg-neutral-white')
            .contains(
              `The request form ${data.data.requestTitle} has been ${status} by the request owner`
            );
        }
      });
    });
  });

  it('Open a read request status change notification', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { submittedRequestResponse },
      selectors: { requestDetailsTab, additionalDetailsTab, moreActionsButton },
    } = request;
    const {
      stubbedResponses: { readRequestStatusNotificationsList },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );

    cy.intercept(api.fetchNotifications, readRequestStatusNotificationsList).as(
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
      let status;

      responseData.map((data) => {
        if (data.data.currentStatus === 'rejected') {
          status = 'declined';

          cy.get(selectors.notificationRow.replace('$', data.id))
            .should('be.visible')
            .contains(
              `The request form ${data.data.requestTitle} has been ${status} by the request owner`
            );
        }
      });
      cy.get(
        selectors.notificationRow.replace('$', responseData[0].id)
      ).click();

      cy.url().should('include', `/request/${responseData[0].data.requestId}`);

      cy.wait('@fetchRequestDetail');
      cy.get(requestDetailsTab).should('be.visible');
      cy.get(additionalDetailsTab).should('be.visible');
      cy.get(moreActionsButton).should('be.visible');
    });
  });

  it('Open a new notification for request status change', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { submittedRequestResponse },
      selectors: { requestDetailsTab, additionalDetailsTab, moreActionsButton },
    } = request;
    const {
      stubbedResponses: {
        openUnreadNotification,
        unreadRequestStatusNotificationsList,
      },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );

    cy.intercept(
      api.fetchNotifications,
      unreadRequestStatusNotificationsList
    ).as('fetchNotifications');

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');

      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[0].data.requestId),
        submittedRequestResponse
      ).as('fetchRequestDetail');

      let status;
      responseData.map((data) => {
        if (data.data.currentStatus === 'rejected') {
          status = 'declined';

          cy.get(selectors.notificationRow.replace('$', data.id))
            .should('be.visible')
            .contains(
              `The request form ${data.data.requestTitle} has been ${status} by the request owner`
            );
        }
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

      cy.url().should('include', `/request/${responseData[1].data.requestId}`);

      cy.wait('@fetchRequestDetail');

      cy.get(requestDetailsTab).should('be.visible');
      cy.get(additionalDetailsTab).should('be.visible');
      cy.get(moreActionsButton).should('be.visible');
    });
  });

  it('Test mark all as read', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: {
        unreadRequestStatusNotificationsList,
        markReadNotifications,
      },
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(
      api.fetchNotifications,
      unreadRequestStatusNotificationsList
    ).as('fetchNotifications');

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
