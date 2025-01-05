FROM prom/prometheus:latest

COPY ./config/prometheus.yml /etc/prometheus/prometheus.yml
COPY ./config/alert_rules.yml /etc/prometheus/alert_rules.yml

CMD [ "--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus" ]
