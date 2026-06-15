Feature: Home Page Navigation

  Description:
    As a user, I want to navigate to key pages from the Home page
    so that I can access my account or register for a new one.

  Scenario: User navigates to Sign In page
    Given a user is on the Home page
    When the user clicks on the "Sign In" button
    Then the user should be taken to the Sign In page

  Scenario: User navigates to Create Account page
    Given a user is on the Home page
    When the user clicks on the "Create Account" button
    Then the user should be taken to the Create Account page
