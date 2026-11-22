---
title: "Youtube Clone"
slug: youtube-clone-backend
pubDatetime: 2024-11-05T13:30:28.441Z
modDatetime: 2026-03-10T14:15:57.980Z
draft: false
category: project
tags:
  - cloud
  - authentication
  - firebase
  - gcp
  - nextjs
  - typescript
ogImage: /images/blog/youtube-clone/cover.png
description: "Building a YouTube clone's video pipeline on Google Cloud: transcoding on Cloud Run, Pub/Sub triggers, Cloud Storage buckets and Firebase auth."
---

![A video moving through processing into several stream sizes](/images/blog/youtube-clone/cover.svg)

<div class="flex justify-between">

[Github Link](https://github.com/ajay-mandal/youtube-clone)

</div>

## Overview

Youtube in itself is a complex app. I have tried to understand and build the video processing model of youtube my means of backend communication. I am using Google cloud as cloud provider and firebase function for required actions. I am also using pub/sub feature of GCP to achieve the requirement

## Tech Stack

-   Next.js - The React Framework for frontend
-   Node.js and Express for backend
-   Docker for backend Containerization
-   Firebase functions for backend actions
-   Firebase Authentication to authenticate the users

## System Design

![system-design](/images/blog/youtube-clone/yt-clone-system-design.svg)

## Video Processing Service

```bash
# youtube-clone/video-processing-service
npm init -y
npx tsc --init
npm i express @types/express
npm i -g ts-node
npm i fluent-ffmpeg @types/fluent-ffmpeg
npm i @google-cloud/storage
npm i firebase-admin

```

-   Also install ffmpeg system

```bash
# For mac using brew
brew install ffmpeg

```

---

### Deploy to Firebase

Sign in to [`console.firebase.google.com`](http://console.firebase.google.com/) and create a new project, analytics diabled, can be enabled for better experience

![firebase-dashboard](/images/blog/youtube-clone/firebase-dashboard.jpeg)

> Project ID: **yt-devclone-d5b1f**

### Setup Cloud

1.  Enable Artifact Registry API on cloud to store docker image
    
2.  Login cloud CLI locally
    

```bash
# Login to account
gcloud auth login

```

3.  Set the project

```bash
# Set project id
gcloud config set project yt-devclone-d5b1f

```

4.  Update the components

```bash
gcloud components update

```

### Create repository on Artifact

![artifact-repo](/images/blog/youtube-clone/artifact-repo.jpeg)

Repository created

### Create 2 buckets (should be unique all over GCP)

1.  ytclone01-raw-videos-bucket
2.  ytclone01-processed-videos-bucket

-   Config for Raw Bucket `ytclone01-raw-videos-bucket`

![raw-bucket-config](/images/blog/youtube-clone/raw-bucket-config.jpeg)

-   Config for Processed Bucket `ytclone01-processed-videos-bucket`

![processed-video-config](/images/blog/youtube-clone/processed-video-config.jpeg)

### Video-processing-service Code

-   video-processing-service code is available [here](https://github.com/ajay-mandal/youtube-clone/tree/main/video-processing-service)

### Create docker image and push to artifact

-   Dockerfile
    
    ```dockerfile
    # Stage 1
    FROM node:20 AS builder

    WORKDIR /app
    COPY package*.json ./
    RUN npm install -g typescript
    RUN npm install

    COPY . .

    RUN npm run build

    #Stage 2
    FROM node:20

    RUN apt-get update && apt-get install -y ffmpeg
    WORKDIR /app
    COPY package*.json ./

    # Install only production dependencies
    RUN npm install --only=production

    COPY --from=builder /app/dist ./dist

    # Expose the port
    EXPOSE 3000
    CMD [ "npm", "run", "serve" ]

    ```
    
-   Docker image build and push to the docker repository, change location and respective fields as per your configuration.
    

```bash
sudo docker build --platform=linux/amd64 -t asia-south1-docker.pkg.dev/yt-devclone-d5b1f/video-processing-repository/video-processing-service .

```

-   Authorize docker to push images to gcloud

```bash
gcloud auth configure-docker asia-south1-docker.pkg.dev

```

-   Push the docker image to Artifact

```bash
docker push asia-south1-docker.pkg.dev/yt-devclone-d5b1f/video-processing-repository/video-processing-service

```

Image pushed successfully

![final-image-pushed](/images/blog/youtube-clone/final-image-pushed.jpeg)

## Cloud Run and Pub/Sub Config

### Create Cloud Run service to run the docker file

1.  Select the image from Artifact

![cloudrun-image-add](/images/blog/youtube-clone/cloudrun-image-add.jpeg)

2.  Set Authentication to "Allow unauthenticated invocation"
3.  Set CPU allocation and pricing to "CPU is only allocated during request processing"
4.  Revision autoscaling can be set as per requirement, I will go with min 0, max 1
5.  Set Ingress Control to "Internal" and create the function.

Copy the URL of the Cloud Run

![url-cloudrun](/images/blog/youtube-clone/url-cloudrun.jpeg)

### Create a Pub/Sub

-   Create a TopicCreate Subscription

![topic-creating](/images/blog/youtube-clone/topic-creating.jpeg)

-   Create Subscription, add the url of cloud run in endpoint url along with `/process-video` endpoint

![add-subscription](/images/blog/youtube-clone/add-subscription.jpeg)

1.  Create a subscription ID
2.  Set Delivery Type to "Push"
3.  Add the Endpoint URL suffix with `/processing-video`
4.  Message retention duration "7 Days" by default values
5.  Expiration period set to "Never expire"
6.  Set Acknowledgement deadline to "600"
7.  Leave rest to default and create the subscription

### Add a notification

`VIP STEP`

```bash
gsutil notification create -t video-processing-topic -f json OBJECT_FINALIZE gs://ytclone-raw-videos-bucket

```

## WEB-APP

-   Frontend is Nextjs App that uses Reactjs, Tailwindcss for rendering of the transcoded videos and user authentication.  
    Get the code [here](https://github.com/ajay-mandal/youtube-clone/tree/main/yt-clone-frontend)

### Generate Firebase SDK for the web-app

-   In firebase, click on webapp and continue to generate the SDK for your frontend app.
-   Add these to the frontend code base `yt-clone-frontend/firebase`

![sdk-code](/images/blog/youtube-clone/sdk-code.jpeg)

### Add Authentication in Firebase

![auth-firebase](/images/blog/youtube-clone/auth-firebase.jpeg)

### Create Firestore Database

-   Create a firestore database in production mode for user data storage.

## Firebase API Service

Install firebase-tools globally

```bash
$ npm install -g firebase-tools

```

Login to firebase

```bash
# youtube-clone/yt-api-service
firebase login

```

Init the firebase api service

```bash
firebase init functions
-- select the existing project
-- select Typescript
-- select EsLint yes

```

Install functions and admin

```bash
npm i firebase-functions@latest firebase-admin@latest

```

-   Get the yt-api-service [here](https://github.com/ajay-mandal/youtube-clone/tree/main/yt-api-service)

Deploy the functions

```bash
npm run deploy
# To separately deploy the functions
firebase deploy --only functions:GenerateUploadUrl

```

After deployment, it should reflect as this on cloud

![generateuplaodurl](/images/blog/youtube-clone/generateuplaodurl.jpeg)

Copy the service url of `GenerateUploadUrl` function to access the raw bucket, copy it from here

![url-generateuploadurl](/images/blog/youtube-clone/url-generateuploadurl.jpeg)

Go to raw bucket → Permissions

![raw-bucket-permission](/images/blog/youtube-clone/raw-bucket-permission.jpeg)

Add the service url and add role `Storage Object Admin`

![principle-raw-uploadurl](/images/blog/youtube-clone/principle-raw-uploadurl.jpeg)

Got IAM & Admin

![IAM](/images/blog/youtube-clone/iam.jpeg)

Grab the same service url and add one more role, `Service Account Token Creator`

![iam-one-more-rule](/images/blog/youtube-clone/iam-one-more-rule.jpeg)

## Add cors policy

`youtube-clone/utils/gcp-cors.json`

```json
[
  {
    "origin": ["*"],
    "responseHeader": ["Content-Type"],
    "method": ["PUT"],
    "maxAgeSeconds": 3600
  }
]

```

Implement this cors policy

```bash
gcloud storage buckets update gs://ytclone-raw-videos-bucket --cors-file=utils/gcs-cors.json

```

Enable **`IAM Service Account Credentials API`**

![iam-api](/images/blog/youtube-clone/iam-api.jpeg)

Add `.env.local` file with following attributes in frontend app

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=BCdeFgHiJ0kLmNOP1qR9sTuv2Wxy2Za8B2C5dEf
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yt-clone-64927.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=yt-clone-64927
NEXT_PUBLIC_APPID=1:101057801427:web:g3b15bf505e28f54afd9db
NEXT_PUBLIC_VIDEO_PREFIX=https://storage.googleapis.com/ytclone-processed-videos-bucket/

```

You are good to go, deploy the frontend on platform like vercel, or you can create a docker image for same and deploy through Artifact on GCP.
