#!/bin/bash

APP_PATH="/root/tuyen/lms/docker"
BRANCH="master"
SITE_NAME="lms.demo"
git fetch origin $BRANCH
LOCAL_COMMIT=$(git rev-parse HEAD)  
REMOTE_COMMIT=$(git rev-parse origin/$BRANCH)
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep frappe)

if [ -z "$CONTAINER_NAME" ]; then
    echo "No running Frappe container found!"
    exit 1
fi

echo "Using container: $CONTAINER_NAME"
echo "Checking for updates in LMS..."

cd $APP_PATH || exit

git fetch origin $BRANCH

if git diff --quiet HEAD origin/$BRANCH; then
    echo "No changes found. Skipping update & restart."
    exit 0
else
    echo "Changes detected! Pulling latest code..."
    git reset --hard origin/$BRANCH
    git pull origin $BRANCH
fi

echo "Updating Frappe..."
docker exec -it "$CONTAINER_NAME" bash -c "
    APP_PATH='/home/frappe/frappe-bench/apps/lms'

    if [ ! -d \"\$APP_PATH\" ]; then
        echo 'Getting lms app...'
        cd /home/frappe/frappe-bench/apps
        bench get-app https://5kywa1k3r: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@github.com/Flamesh/lms.git
    else
        echo 'lms already exists, updating...'
        git reset --hard origin/$BRANCH
        git pull origin $BRANCH
    fi

    bench update --patch
    bench --site \"$SITE_NAME\" migrate
    bench restart
"


docker logs -f "$CONTAINER_NAME"
