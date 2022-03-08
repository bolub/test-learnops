describe('Edit Vendors', () => {
  let selector;

  before('Load Fixtures', () => {
    cy.fixture('vendors').then((content) => (selector = content));
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

  it('Admin can see an individual vendor', () => {
    const { selectors, routes, vendors, newVendor } = selector;
    const vendorId = '0c6da2aa-0a9e-4266-a5c5-bdf36c99265b';
    cy.intercept(routes.vendorsApi, vendors).as('vendors');
    cy.visit(routes.vendorsPage);
    cy.contains(selectors.organiztionTab).click();
    cy.contains(selectors.vendorsTab).click();
    cy.wait('@vendors');
    cy.intercept(`${routes.vendorsApi}/${vendorId}`, newVendor).as('vendor');
    cy.get(selectors.vendorRow.replace('$', vendorId))
      .should('be.visible')
      .click();
    cy.wait('@vendor');
    cy.get(selectors.vendorDetailTitle)
      .should('be.visible')
      .should('have.text', `Vendor/${newVendor.data.vendor.vendorName}`);
    cy.get(selectors.vendorNameInput)
      .should('be.visible')
      .should('have.value', selectors.vendorName);
    cy.get(selectors.vendorAddressInput)
      .should('be.visible')
      .should('have.value', selectors.vendorAddress);
    cy.get(selectors.vendorCountryInput)
      .find('input')
      .should('have.value', 'Austria');
    cy.get(selectors.vendorWebsiteInput)
      .should('be.visible')
      .should('have.value', selectors.vendorWebsite);
    cy.get(selectors.vendorEmailInput)
      .should('be.visible')
      .should('have.value', selectors.vendorEmail);
    cy.get(selectors.vendorDescriptionInput)
      .should('be.visible')
      .should('have.value', selectors.vendorDescription);
    cy.get(selectors.vendorProvinceInput)
      .find('input')
      .should('have.value', newVendor.data.vendor.data.province);
    cy.get(selectors.vendorContactInput)
      .should('be.visible')
      .should('have.value', selectors.vendorName);
    cy.get(selectors.vendorPhoneInput)
      .should('be.visible')
      .should('have.value', selectors.vendorPhone);
    cy.get(selectors.saveVendorDetails).should('be.disabled');
  });

  it('Admin can edit vendor', () => {
    const { selectors, routes, vendors, newVendor } = selector;
    const vendorId = '0c6da2aa-0a9e-4266-a5c5-bdf36c99265b';
    const editVendor = {
      id: vendorId,
      country_iso_3166_1_alpha_2_code: 'CA',
      vendorName: 'Edit name',
      description: 'Edit description',
      data: {
        email: 'Edit email',
        phone: 'Edit phone',
        address: 'Edit address',
        website: 'Edit website',
        province: 'Ontario',
        contactName: 'Edit contactName',
      },
    };

    cy.intercept(routes.vendorsApi, vendors).as('vendors');
    cy.visit(routes.vendorsPage);
    cy.contains(selectors.organiztionTab).click();
    cy.contains(selectors.vendorsTab).click();
    cy.wait('@vendors');
    cy.intercept(`${routes.vendorsApi}/${vendorId}`, newVendor).as('vendor');
    cy.get(selectors.vendorRow.replace('$', vendorId))
      .should('be.visible')
      .click();
    cy.wait('@vendor');
    cy.get(selectors.vendorNameInput).type(
      `{selectall}{del}${editVendor.vendorName}`
    );
    cy.get(selectors.vendorAddressInput).type(
      `{selectall}{del}${editVendor.data.address}`
    );
    cy.get(selectors.vendorCountryInput).click();
    cy.contains('Canada').click();
    cy.get(selectors.vendorWebsiteInput).type(
      `{selectall}{del}${editVendor.data.website}`
    );
    cy.get(selectors.vendorEmailInput).type(
      `{selectall}{del}${editVendor.data.email}`
    );
    cy.get(selectors.vendorDescriptionInput).type(
      `{selectall}{del}${editVendor.description}`
    );
    cy.get(selectors.vendorProvinceInput).should('be.visible').click();
    cy.contains(editVendor.data.province).click();
    cy.get(selectors.vendorContactInput).type(
      `{selectall}{del}${editVendor.data.contactName}`
    );
    cy.get(selectors.vendorPhoneInput).type(
      `{selectall}{del}${editVendor.data.phone}`
    );
    cy.intercept('PUT', `${routes.vendorsApi}/${vendorId}`, {
      ...newVendor,
      vendor: editVendor,
    }).as('editVendor');
    cy.get(selectors.saveVendorDetails).should('not.be.disabled').click();
    cy.wait('@editVendor');
    cy.location('pathname').should('eq', '/settings');
  });

  it('Admin can cancel an edit', () => {
    const { selectors, routes, vendors, newVendor } = selector;
    const vendorId = '0c6da2aa-0a9e-4266-a5c5-bdf36c99265b';

    cy.intercept(routes.vendorsApi, vendors).as('vendors');
    cy.visit(routes.vendorsPage);
    cy.contains(selectors.organiztionTab).click();
    cy.contains(selectors.vendorsTab).click();
    cy.wait('@vendors');
    cy.intercept(`${routes.vendorsApi}/${vendorId}`, newVendor).as('vendor');
    cy.get(selectors.vendorRow.replace('$', vendorId))
      .should('be.visible')
      .click();
    cy.wait('@vendor');
    cy.get(selectors.vendorNameInput).type('{selectall}{del}edit name');
    cy.get(selectors.cancelButton).should('not.be.disabled').click();
    cy.location('pathname').should('eq', '/settings');
  });

  it('Admin can enable vendor', () => {
    const { selectors, routes, vendors, newVendor } = selector;
    const vendorId = '0c6da2aa-0a9e-4266-a5c5-bdf36c99265b';

    cy.intercept(routes.vendorsApi, vendors).as('vendors');
    cy.visit(routes.vendorsPage);
    cy.contains(selectors.organiztionTab).click();
    cy.contains(selectors.vendorsTab).click();
    cy.wait('@vendors');
    cy.intercept(`${routes.vendorsApi}/${vendorId}`, newVendor).as('vendor');
    cy.get(selectors.vendorRow.replace('$', vendorId))
      .should('be.visible')
      .click();
    cy.wait('@vendor');
    cy.get(selectors.vendorSwitch).should('not.be.checked');
    cy.intercept('PUT', `${routes.vendorsApi}/${vendorId}`, {
      ...newVendor,
      data: {
        vendor: { ...newVendor.data.vendor, enabled: false },
      },
    }).as('enabledVendor');
    cy.get(selectors.vendorSwitch).check({ force: true });
    cy.wait('@enabledVendor');
  });

  it('Admin can disable vendor', () => {
    const { selectors, routes, vendors, newVendor } = selector;
    const vendorId = '0c6da2aa-0a9e-4266-a5c5-bdf36c99265b';

    cy.intercept(routes.vendorsApi, vendors).as('vendors');
    cy.visit(routes.vendorsPage);
    cy.contains(selectors.organiztionTab).click();
    cy.contains(selectors.vendorsTab).click();
    cy.wait('@vendors');
    cy.intercept(`${routes.vendorsApi}/${vendorId}`, {
      ...newVendor,
      data: {
        vendor: { ...newVendor.data.vendor, enabled: true },
      },
    }).as('vendor');
    cy.get(selectors.vendorRow.replace('$', vendorId))
      .should('be.visible')
      .click();
    cy.wait('@vendor');
    cy.get(selectors.vendorSwitch).should('be.checked');
    cy.intercept('PUT', `${routes.vendorsApi}/${vendorId}`, {
      ...newVendor,
      enabled: false,
    }).as('disabledVendor');
    cy.get(selectors.vendorSwitch).uncheck({ force: true });
    cy.wait('@disabledVendor');
  });
});
