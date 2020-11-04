#!/bin/bash
set -e
reset

# # Update to use a different AWS profile
PROFILE="@@aws-profile-name@@"
PIPELINE_STACK_NAME="@@camel-case-name@@Inception"
HUB_REGION="@@aws-region-hub@@"
SPOKE_REGIONS="@@aws-region-hub@@ us-east-1"
REGION_STACK_NAME="@@camel-case-name@@RegionalBucket"
GITHUB_REPO="https://github.com/@@github-repo-owner@@/@@github-repo-name@@.git"

echo "Create S3 buckets in all applicable SPOKE_REGIONS (space-separated list): ${SPOKE_REGIONS}"
for SPOKE_REGION in $SPOKE_REGIONS; do
    echo "Creating bucket in ${SPOKE_REGION}"
    aws \
        --region ${SPOKE_REGION} \
        --profile ${PROFILE} \
        cloudformation \
            create-stack \
            --stack-name ${REGION_STACK_NAME} \
            --template-body file://init_bucket.yml \
            --parameters file://init_bucket-cli-parameters.json \
            --output text
done
echo "Wait until all S3 buckets have been created"
for SPOKE_REGION in $SPOKE_REGIONS; do
    echo "Waiting for the CloudFormation stack in region '${SPOKE_REGION}' to finish being created."
    aws \
        --region ${SPOKE_REGION} \
        --profile ${PROFILE} \
        cloudformation \
            wait stack-create-complete \
            --stack-name ${REGION_STACK_NAME}
done

echo "Create the initial CloudFormation Stack"
aws --region ${HUB_REGION} --profile ${PROFILE} cloudformation create-stack --stack-name ${PIPELINE_STACK_NAME} --template-body file://pipeline.yml --parameters file://pipeline-cli-parameters.json --capabilities "CAPABILITY_NAMED_IAM" --output text
echo "Waiting for the CloudFormation stack to finish being created."
aws --region ${HUB_REGION} --profile ${PROFILE} cloudformation wait stack-create-complete --stack-name ${PIPELINE_STACK_NAME}
# Print out all the CloudFormation outputs.
aws --region ${HUB_REGION} --profile ${PROFILE} cloudformation describe-stacks --stack-name ${PIPELINE_STACK_NAME} --output table --query "Stacks[0].Outputs"

echo "Adding all changed files"
git add ../
echo "Committing files"
git commit -m "Initial commit"
echo "Pushing to ${GITHUB_REPO}"
git push
