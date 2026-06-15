Feature: User Sign In

  Description:
  As a user, I want to sign in with my valid credentials
  so that I can access my dashboard and account information.

  @SCRUM-5
  Scenario: User logs in successfully with valid credentials
    Given a user is on the Sign In page
    When the user enters "user@test.com" into the email field
    And the user enters "Password123" into the password field
    And the user clicks the sign in submit button
    Then the user should be redirected to the dashboard page
