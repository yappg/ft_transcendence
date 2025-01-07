FROM grafana/grafana:latest

ENV GF_SERVER_ROOT_URL=https://localhost/monitor
ENV GF_SERVER_SERVE_FROM_SUB_PATH=true

COPY ./provisioning /etc/grafana/provisioning
