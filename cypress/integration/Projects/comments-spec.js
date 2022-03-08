describe('Project comments', () => {
  let constants, projects, projectPage;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
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

  it('Should display empty tray when not comments available', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, newProject },
    } = projects;
    const {
      selectors: { comments },
      constantTexts: { emptyCommentsMessage },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    cy.intercept(`${api.fetchProjects}/${newProject.data.id}`, newProject).as(
      'fetchProjectDetail'
    );
    cy.intercept(
      `${api.fetchAllProjectComments.replace('$', newProject.data.id)}`
    ).as('fetchProjectComments');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(comments.trigger).should('be.visible').click();
    cy.get(comments.list).contains(emptyCommentsMessage);
  });

  it('Creates a new comment successfully', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, newProject },
    } = projects;
    const {
      selectors: { comments },
      stubbedResponses: { newComment },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    cy.intercept(`${api.fetchProjects}/${newProject.data.id}`, newProject).as(
      'fetchProjectDetail'
    );
    cy.intercept(
      `${api.fetchAllProjectComments.replace('$', newProject.data.id)}`
    ).as('fetchProjectComments');
    cy.intercept('POST', `${api.submitComment}`, {
      statusCode: 200,
      body: {
        ...newComment,
        data: { ...newComment.data, projectId: newProject.data.id },
      },
    }).as('submitProjectComment');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(comments.trigger).should('be.visible').click();
    cy.get(comments.addCommentInput).type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    );
    cy.get(comments.cancelComment).should('be.visible');
    cy.get(comments.submitComment).should('be.visible').click();
    cy.wait('@submitProjectComment');
    cy.get(comments.cancelComment).should('not.exist');
    cy.get(comments.submitComment).should('not.exist');
  });

  it('Cannot update comments which were not created by the current user', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, newProject },
    } = projects;
    const {
      selectors: { comments },
      stubbedResponses: { commentsList },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    cy.intercept(`${api.fetchProjects}/${newProject.data.id}`, newProject).as(
      'fetchProjectDetail'
    );
    cy.intercept(
      `${api.fetchAllProjectComments.replace('$', newProject.data.id)}`,
      { statusCode: 200, body: commentsList }
    ).as('fetchProjectComments');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(comments.trigger).should('be.visible').click();
    cy.get(
      comments.comment.replace('$', commentsList.data.projectComments[0].id)
    ).within(() => {
      cy.get(comments.actionsMenu.triggerButton).should('not.exist');
    });
  });

  it('Updates a user comment successfully', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, newProject },
    } = projects;
    const {
      selectors: { comments },
      stubbedResponses: { commentsList },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    cy.intercept(`${api.fetchProjects}/${newProject.data.id}`, newProject).as(
      'fetchProjectDetail'
    );
    cy.intercept(
      `${api.fetchAllProjectComments.replace('$', newProject.data.id)}`,
      { statusCode: 200, body: commentsList }
    ).as('fetchProjectComments');
    const userComment =
      commentsList.data.projectComments[
        commentsList.data.projectComments.length - 1
      ];
    const { commentCreator, ...otherCommentData } = userComment;
    cy.intercept('PUT', `${api.submitComment}/${userComment.id}`, {
      statusCode: 200,
      body: { data: { ...otherCommentData, content: 'Test One' } },
    }).as('editProjectComment');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(comments.trigger).should('be.visible').click();
    cy.get(comments.comment.replace('$', userComment.id)).within(() => {
      cy.get(comments.actionsMenu.triggerButton).should('be.visible').click();
    });
    cy.get(comments.actionsMenu.editButton).click();
    cy.get(comments.editCommentInput)
      .should('be.visible')
      .clear()
      .type('Test One');
    cy.get(comments.comment.replace('$', userComment.id)).within(() => {
      cy.get(comments.editCommentButton).should('be.visible').click();
      cy.wait('@editProjectComment');
      cy.get(comments.editCommentInput).should('not.exist');
      cy.get(comments.editCommentButton).should('not.exist');
      cy.contains('Test One');
    });
  });

  it('Deletes a user comment successfully', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, newProject },
    } = projects;
    const {
      selectors: { comments },
      stubbedResponses: { commentsList },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    cy.intercept(`${api.fetchProjects}/${newProject.data.id}`, newProject).as(
      'fetchProjectDetail'
    );
    cy.intercept(
      `${api.fetchAllProjectComments.replace('$', newProject.data.id)}`,
      { statusCode: 200, body: commentsList }
    ).as('fetchProjectComments');
    const userComment =
      commentsList.data.projectComments[
        commentsList.data.projectComments.length - 1
      ];
    cy.intercept('DELETE', `${api.submitComment}/${userComment.id}`, {
      statusCode: 200,
    }).as('deleteProjectComment');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(comments.trigger).should('be.visible').click();
    cy.get(comments.comment.replace('$', userComment.id)).within(() => {
      cy.get(comments.actionsMenu.triggerButton).should('be.visible').click();
    });
    cy.get(comments.actionsMenu.deleteButton).click();
    cy.wait('@deleteProjectComment');
    cy.get(comments.comment.replace('$', userComment.id)).should('not.exist');
  });

  it('Displays the hidden comments', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, newProject },
    } = projects;
    const {
      selectors: { comments },
      stubbedResponses: { commentsList },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    cy.intercept(`${api.fetchProjects}/${newProject.data.id}`, newProject).as(
      'fetchProjectDetail'
    );
    cy.intercept(
      `${api.fetchAllProjectComments.replace('$', newProject.data.id)}`,
      { statusCode: 200, body: commentsList }
    ).as('fetchProjectComments');
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.visit(`${routes.projectPage}${newProject.data.id}`);
    cy.wait('@fetchProjectDetail');
    cy.get(comments.trigger).should('be.visible').click();
    cy.get(comments.hiddenCommentsList).should('not.exist');
    cy.get(comments.hiddenCommentsButton).should('be.visible').click();
    cy.get(comments.hiddenCommentsList)
      .should('be.visible')
      .within(() => {
        cy.get(
          comments.comment.replace('$', commentsList.data.projectComments[1].id)
        ).should('be.visible');
        cy.get(
          comments.comment.replace('$', commentsList.data.projectComments[2].id)
        ).should('be.visible');
      });
    cy.get(comments.hiddenCommentsButton).click();
    cy.get(comments.hiddenCommentsList).should('not.exist');
  });
});
