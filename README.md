# Tao of the Day

## Introduction

Tao of The Day is my demo application used to demonstrate a few capabilities and services of AWS. It is a quote of the day application that serves chapters from the [Tao Te Ching](https://en.wikipedia.org/wiki/Tao_Te_Ching).

## Launching

Follow these steps to deploy into your own AWS account.

1. Grab a copy of the repository by creating a fork. The deployment steps assume that you're going to keep using GitHub to deploy code from.
2. Search and replace the following placeholders:

   | Token                 | Example        | Description                                                                                                            |
   | --------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
   | @@camel-case-name@@   | TaoOfTheDay    | CameCase name, can be a mix of upper and lower alphabetic characters only. Also used for naming things.                |
   | @@kebab-case-name@@   | tao-of-the-day | Kebab-case name, needs to be all lowercase alphabetic characters and dashes. Used in naming resources like S3 Buckets. |
   | @@github-repo-owner@@ | mechanicalpete | Most likely your GitHub username.                                                                                      |
   | @@github-repo-name@@  | tao-of-the-day | The name of the repo you forked the original project into.                                                             |
   | @@aws-profile-name@@  | default        | The AWS CLI profile to use to deploy everything.                                                                       |
   | @@aws-account-id@@    | 111122223333   | The AWS account you are deploying into (used by the cleanup commands at the end of this readme).                       |
   | @@aws-region-hub@@    | ap-southeast-2 | Which region you would like to deploy everything into.                                                                 |

3. Generate a **GitHub Personal Access Token** which is used by CodePipeline to configure a webhook to receive notifications.
   1. Navigate to [Personal Access Tokens](https://github.com/settings/tokens)
   2. Click **Generate new token**
   3. Give it a friendly name in **Note**
   4. Select `repo` and `admin:repo_hook`
   5. Click **Generate token**
   6. Copy the value (this is the only time you will see it).
4. Deploy the GitHub Webhook secrets (required for the webhook to run)

   ```bash
   aws --profile @@aws-profile-name@@ secretsmanager create-secret --name "github/webhook/@@kebab-case-name@@" --secret-string "Th1\$C@nB3@ny0ldV@lu3"
   aws --profile @@aws-profile-name@@ secretsmanager create-secret --name "github/patoken/@@kebab-case-name@@" --secret-string "<github-personal-access-token>"
   ```

5. Run:

    ```bash
    cd pipeline
    chmod +x init.sh
    ./init.sh
    ```

6. Watch and wait for everything to deploy!

## Tear Down

1. Empty all the S3 buckets (remember, you cannot delete a bucket that contains objects).
2. Delete the deployed CloudFormation stacks in this order:
   1. @@camel-case-name@@-dev
   2. @@camel-case-name@@Infrastructure
   3. @@camel-case-name@@GitHubActions
   4. @@camel-case-name@@RegionalBucket in `@@aws-region-hub@@` and `us-east-1`
   5. @@camel-case-name@@Notifications
   6. @@camel-case-name@@Inception
3. Remove your Secrets Manager secrets:

   ```bash
   aws --profile @@aws-profile-name@@ secretsmanager delete-secret --force-delete-without-recovery --secret-id "arn:aws:secretsmanager:@@aws-region-hub@@:@@aws-account-id@@:secret:github/webhook/@@kebab-case-name@@"
   aws --profile @@aws-profile-name@@ secretsmanager delete-secret --force-delete-without-recovery --secret-id "arn:aws:secretsmanager:@@aws-region-hub@@:@@aws-account-id@@:secret:github/patoken/@@kebab-case-name@@"
   ```
