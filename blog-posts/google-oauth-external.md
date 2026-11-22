---
title: "Google OAuth Service"
slug: google-oauth-external
pubDatetime: 2024-12-10T06:29:08.126Z
modDatetime: 2026-03-10T14:15:56.289Z
draft: false
category: findings
tags:
  - google
  - Oauth
  - gcp
ogImage: /images/blog/google-oauth/cover.png
description: "Set up Google OAuth on GCP for an external app, step by step: create the project, configure the consent screen and generate OAuth client credentials."
---

![A key next to a shield with a check mark](/images/blog/google-oauth/cover.svg)

### Google OAuth Service Configuration on external app

![Admin panel login form with the Google sign-in button highlighted](/images/blog/google-oauth/google-oauth.jpeg)

To use the OAuth service of Google in our app, we need to create a project in our gcp console and create a API service in it.

1.  Go to [GCP Console](https://console.cloud.google.com/) and login with your google account. Create a project to get started.
    
2.  Select the created project and click on "API and Services"  
    ![Google Cloud console with the new project selected in the project picker](/images/blog/google-oauth/project-selected.jpeg)
    
3.  Create a OAuth Consent screen for external access  
    ![Google Cloud OAuth consent screen setup with the External user type](/images/blog/google-oauth/oauth-consent-screen.jpeg)
    

-   Select User Type as "External" and click on Create.

4.  Add the webapp details where you will add this Oauth service  
    ![OAuth consent screen app registration: app name, support email and logo](/images/blog/google-oauth/app-registration.jpeg)

-   Add your App name
-   User support email will be the mail which you use to create the project.
-   Adding logo for the app is optional

5.  Add the authorized domain that is going to use this service. The subsequent sub-domain can use it afterwards.  
    ![OAuth consent screen authorized domains and developer contact email](/images/blog/google-oauth/auth-domain.jpeg)

-   Also add a developer contact email (can be any)

6.  Now create a `OAuth client ID` in Credentials  
    ![Google Cloud Credentials page, creating an OAuth client ID](/images/blog/google-oauth/oauth-client-id.jpeg)
    
7.  Add all the details about the domain that is going to use service along with callback url  
    ![OAuth client ID details with authorized JavaScript origins and redirect URIs](/images/blog/google-oauth/oauth-client-details.jpeg)
    

-   Select Application Type as "Web App"
-   Add the Name of App (This will appear to users when trying to authenticate with google)
-   Add the domain or sub-domain in the `Authorized Javascript Origin`
-   The redirect URL formats goes as `{{url}}/api/auth/callback/google`
-   Finally click create to get the client ID and secret to add our app and use the service.

This post can be very helpful while creating OAuth for in-house authentication.
