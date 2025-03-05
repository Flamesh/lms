#!/bin/bash
FORCE=false

if [[ "$1" == "-f" ]]; then
    FORCE=true
fi

APP_PATH="/root/tuyen/lms/docker"
APP_PATH_DOCKER="/home/frappe/frappe-bench/apps/lms"
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
    if ["$FORCE" = false]; then 
    	exit 0
    fi
    
    echo "force updating..." 
else
    echo "Changes detected! Pulling latest code..."
fi

echo "Updating Frappe..."
docker exec -it "$CONTAINER_NAME" bash -c "

    if [ ! -d "$APP_PATH_DOCKER" ]; then
        echo 'Getting lms app...'
        cd /home/frappe/frappe-bench/
        bench get-app https://5kywa1k3r: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@github.com/Flamesh/lms.git
    else
        echo 'lms already exists, updating...'
        cd /home/frappe/frappe-bench/apps/lms
        git reset --hard origin/$BRANCH
        git pull origin $BRANCH
    fi

    cd /home/frappe/frappe-bench/
    bench update --patch
    bench build
    bench migrate
    bench setup socketio
    bench setup supervisor
    bench setup redis
    bench restart
"

git reset --hard origin/$BRANCH
git pull origin $BRANCH
docker logs -100f "$CONTAINER_NAME"
