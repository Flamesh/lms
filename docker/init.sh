#!bin/bash

if [ -d "/home/frappe/frappe-bench/apps/frappe" ]; then
    echo "Bench already exists, skipping init"
    cd frappe-bench
    bench start
else
    echo "Creating new bench..."
fi

export PATH="${NVM_DIR}/versions/node/v${NODE_VERSION_DEVELOP}/bin/:${PATH}"

bench init --skip-redis-config-generation frappe-bench

cd frappe-bench

# Use containers instead of localhost
bench set-mariadb-host mariadb
bench set-redis-cache-host redis:6379
bench set-redis-queue-host redis:6379
bench set-redis-socketio-host redis:6379



# Remove redis, watch from Procfile
sed -i '/redis/d' ./Procfile
sed -i '/watch/d' ./Procfile

bench get-app https://5kywa1k3r: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@github.com/Flamesh/lms.git


bench new-site lms.demo \
--force \
--mariadb-root-password 123 \
--admin-password admin \
--no-mariadb-socket
bench --site lms.demo add-to-hosts
bench --site lms.demo install-app lms
bench --site lms.demo set-config developer_mode 1
bench --site lms.demo clear-cache
bench use lms.demo
bench import-translations vi apps/lms/lms/locale/vi.po
bench set-config -g lang vi

bench start 
