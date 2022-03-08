import get from 'lodash/get';

describe('Request Cancellation Notifications', () => {
  let constants, requestList, notifications, request, comments;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('requestList').then((content) => (requestList = content));
    cy.fixture('request').then((content) => (request = content));
    cy.fixture('notifications').then((content) => (notifications = content));
    cy.fixture('comments').then((content) => (comments = content));
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
      cy.checkEmptyNotificationList(responseData);
    });
  });

  it('Checks new notification for comment on request', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { requestCommentsNewNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, requestCommentsNewNotification).as(
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
          .contains('added a comment')
          .contains(data.data.requestTitle);
      });
    });
  });

  it('Checks read notifications for comment on request', () => {
    const { routes, api } = constants;
    const { stubbedResponses } = requestList;
    const {
      stubbedResponses: { requestCommentsReadNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(api.fetchNotifications, requestCommentsReadNotification).as(
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
          .should('have.class', 'bg-neutral-white')
          .contains(data.data.triggererName)
          .contains('added a comment')
          .contains(data.data.requestTitle);
      });
    });
  });

  it('Open a read request comment notification', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses,
      selectors: { details },
    } = requestList;
    const {
      selectors: { requestDetailsTab, additionalDetailsTab, moreActionsButton },
    } = request;
    const { stubRequestDetail, stubRequestPropertyCommentsByProperty } =
      comments.stubbedData;

    const {
      stubbedResponses: { requestCommentsReadNotification },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );

    cy.intercept(api.fetchNotifications, requestCommentsReadNotification).as(
      'fetchNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');
      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[0].data.requestId),
        stubRequestDetail
      ).as('fetchRequestDetail');

      cy.intercept(
        'GET',
        api.fetchRequestPropertyComments.replace(
          '$',
          responseData[0].data.requestId
        ),
        stubRequestPropertyCommentsByProperty
      ).as('fetchRequestPropertyComments');

      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')
          .contains(data.data.triggererName)
          .contains('added a comment')
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
    });

    cy.wait('@fetchRequestPropertyComments').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      expect(responseData.requestPropertyCommentsByProperty).not.to.be.empty;
      cy.get('[data-testid=comments_topbar-button]').first().click();
      cy.get(details.requestNumberCommentBox)
        .should('be.visible')
        .contains('1')
        .should('have.class', 'text-neutral')
        .click();
    });
  });

  it('Open a new request comment notification', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses,
      selectors: { details },
    } = requestList;

    const {
      selectors: { requestDetailsTab, additionalDetailsTab, moreActionsButton },
    } = request;
    const { stubRequestDetail, stubRequestPropertyCommentsByProperty } =
      comments.stubbedData;
    const {
      stubbedResponses: {
        openUnreadNotification,
        requestCommentsNewNotification,
      },
      selectors,
    } = notifications;

    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );

    cy.intercept(api.fetchNotifications, requestCommentsNewNotification).as(
      'fetchNotifications'
    );

    cy.visit(routes.requestList);
    cy.openNotifications();

    cy.wait('@fetchNotifications').then((payload) => {
      const responseData = get(payload, 'response.body.data.notifications');

      cy.intercept(
        'GET',
        api.fetchRequestDetail.replace('**', responseData[0].data.requestId),
        stubRequestDetail
      ).as('fetchRequestDetail');

      cy.intercept(
        'GET',
        api.fetchRequestPropertyComments.replace(
          '$',
          responseData[0].data.requestId
        ),
        stubRequestPropertyCommentsByProperty
      ).as('fetchRequestPropertyComments');

      expect(responseData).not.to.be.empty;

      responseData.map((data) => {
        cy.get(selectors.notificationRow.replace('$', data.id))
          .should('be.visible')
          .contains(data.data.triggererName)
          .contains('added a comment')
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
    });

    cy.wait('@fetchRequestPropertyComments').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      expect(responseData.requestPropertyCommentsByProperty).not.to.be.empty;
      cy.get('[data-testid=comments_topbar-button]').first().click();
      cy.get(details.requestNumberCommentBox)
        .should('be.visible')
        .contains('1')
        .should('have.class', 'text-neutral')
        .click();
    });
  });
});
