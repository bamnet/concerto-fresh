#!/bin/bash

# Variables
OWNER="concerto"
REPO="concerto"
LABEL_NAME="2.x"

# Fetch all open and closed issue numbers
issue_numbers=$(gh api --paginate "/repos/$OWNER/$REPO/issues?state=closed" --jq '.[].number')

# Loop through each issue and add the label
for issue_number in $issue_numbers; do
  echo "Adding label '$LABEL_NAME' to issue #$issue_number..."
  gh issue edit "$issue_number" --add-label "$LABEL_NAME" -R "concerto/concerto"
done

echo "Label added to all issues in $OWNER/$REPO."
