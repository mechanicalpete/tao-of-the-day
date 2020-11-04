#!/bin/bash

set -e
reset

TEMPLATE_FILES=$(ls -R -d infrastructure/*.yml && ls -R -d infrastructure/**/*.yml 2> /dev/null || exit 0)

for TEMPLATE_FILE in $TEMPLATE_FILES; do
    echo "Validating CloudFormation template file '${TEMPLATE_FILE}'"
    aws --profile @@aws-profile-name@@ cloudformation validate-template --template-body file://$TEMPLATE_FILE
    cfn-lint $TEMPLATE_FILE
    checkov -f $TEMPLATE_FILE
done