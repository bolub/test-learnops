import Amplify from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import { get } from 'lodash';

Cypress.Commands.add('initAmplifyConfiguration', () => {
  cy.fixture('amplifyConfig').then((config) => {
    return Amplify.configure({
      Auth: {
        ...config,
        userPoolId: Cypress.env('COGNITO_USER_POOL_ID'),
        userPoolWebClientId: Cypress.env('COGNITO_USER_POOL_WEB_CLIENT'),
      },
    });
  });
});

Cypress.Commands.add('signIn', () => {
  cy.fixture('auth').then((content) => {
    cy.fixture('user').then((userData) => {
      cy.visit('/login');
      const { selectors } = content;
      const { businessUser, stubRoute } = userData;

      cy.get(selectors.loginInputEmail)
        .click()
        .type('alex+test@getsynapse.com');
      cy.get(selectors.loginInputPassword).click().type('EKtest1#');

      cy.intercept(stubRoute).as('loginIntercept');
      cy.get(selectors.loginSubmitButton).click();

      cy.wait(2000);
      cy.wait('@loginIntercept');
    });
  });
});

Cypress.Commands.add('signInLD', () => {
  cy.fixture('auth').then((auth) => {
    cy.fixture('user').then((content) => {
      cy.visit('/login');
      const { ldUser, stubRoute } = content;
      const { selectors } = auth;

      cy.get(selectors.loginInputEmail)
        .click()
        .type('alex+test@getsynapse.com');
      cy.get(selectors.loginInputPassword).click().type('EKtest1#');

      cy.intercept(stubRoute).as('loginIntercept');
      cy.get(selectors.loginSubmitButton).click();

      cy.wait(2000);
      cy.wait('@loginIntercept');
    });
  });
});

Cypress.Commands.add('afterLogin', (cognitoUser) => {
  const hostname = Cypress.env('DOMAIN_NAME');
  cy.setCookie(
    'refreshToken',
    get(cognitoUser, 'signInUserSession.refreshToken.token'),
    { path: '', domain: hostname }
  );
  cy.setCookie(
    'clockDrift',
    get(cognitoUser, 'signInUserSession.clockDrift').toString(),
    { path: '', domain: hostname }
  );
  cy.setCookie('username', get(cognitoUser, 'username'), {
    path: '',
    domain: hostname,
  });
  cy.setCookie(
    'jwtToken',
    get(cognitoUser, 'signInUserSession.idToken.jwtToken', '')
  );
});

Cypress.Commands.add('interceptApiRequests', () => {
  let constants;

  cy.fixture('constants').then((content) => {
    constants = content;
    const { api } = constants;
    cy.intercept(api.myRequests).as('myRequests');
    cy.intercept(api.allRequests).as('allRequests');
  });
});

Cypress.Commands.add('checkDropdownItemVisibility', (label, value) => {
  const data = {
    label,
    value,
  };

  cy.get(`[data-value='${JSON.stringify(data)}']`).should('be.visible');
});

Cypress.Commands.add('selectDropdownItem', (label, value) => {
  const data = {
    value,
    label,
  };

  cy.get(`[data-value='${JSON.stringify(data)}']`)
    .should('be.visible')
    .click();
});

Cypress.Commands.add('checkSuccessMessage', (message) => {
  if (message) {
    cy.get('.bg-success-lighter')
      .should('be.visible')
      .and('have.text', message);
  } else {
    cy.get('.bg-success-lighter').should('be.visible');
  }
});

Cypress.Commands.add('signInRequestOwner', () => {
  cy.fixture('auth').then((auth) => {
    cy.fixture('user').then((content) => {
      cy.visit('/login');
      const { requestOwner, stubRoute } = content;
      const { selectors } = auth;
      cy.get(selectors.loginInputEmail).type(Cypress.env('USER_EMAIL'));
      cy.get(selectors.loginInputPassword).type(Cypress.env('USER_PASSWORD'));
      cy.get(selectors.loginSubmitButton).click();
      cy.intercept('GET', stubRoute, requestOwner).as('loginIntercept');
      cy.wait('@loginIntercept');
    });
  });
});

Cypress.Commands.add('openNotifications', () => {
  cy.fixture('notifications').then((content) => {
    const { selectors } = content;
    cy.get(selectors.notificationBell).should('be.visible').click();
    cy.get(selectors.notificationList).should('be.visible');
  });
});

Cypress.Commands.add('checkEmptyNotificationList', (response) => {
  expect(response).to.be.empty;
});

Cypress.Commands.add(
  'pickStartAndEndDates',
  (datePickerSelector, startDate = 14, endDate = 20) => {
    cy.get(datePickerSelector).click();
    cy.get(`[data-value=${startDate}]`).click();
    cy.get(`[data-value=${endDate}]`).click();
    cy.get(datePickerSelector).click();
  }
);

Cypress.Commands.add('customRequest', (method, url, body) => {
  const getJwtToken = Auth.currentAuthenticatedUser().then(
    (user) => user.signInUserSession.idToken.jwtToken
  );
  cy.wrap(getJwtToken).then((token) =>
    cy.request({
      method,
      url,
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`,
      },
    })
  );
});
