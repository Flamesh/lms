#!/bin/bash

APP_PATH="/root/tuyen/lms/docker"
BRANCH="master"

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
    git reset --hard HEAD
    git pull origin $BRANCH
fi

echo "Updating Frappe..."
docker exec -it "$CONTAINER_NAME" bash -c "
    cd /home/frappe/frappe-bench
    bench update --reset
    bench restart
"

docker logs -f "$CONTAINER_NAME"
