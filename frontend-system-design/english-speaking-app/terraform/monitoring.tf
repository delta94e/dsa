# Prometheus & Grafana Monitoring Stack

resource "helm_release" "prometheus" {
  name             = "prometheus"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "kube-prometheus-stack"
  namespace        = "monitoring"
  create_namespace = true
  version          = "55.0.0"

  values = [
    <<-EOF
    prometheus:
      prometheusSpec:
        retention: 15d
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        storageSpec:
          volumeClaimTemplate:
            spec:
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 20Gi

    grafana:
      enabled: true
      adminPassword: ${var.grafana_admin_password}
      ingress:
        enabled: true
        ingressClassName: nginx
        hosts:
          - grafana.${var.domain}
        tls:
          - secretName: grafana-tls
            hosts:
              - grafana.${var.domain}
      persistence:
        enabled: true
        size: 5Gi

    alertmanager:
      enabled: true
      alertmanagerSpec:
        storage:
          volumeClaimTemplate:
            spec:
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 5Gi

    # ServiceMonitor for our apps
    additionalServiceMonitors:
      - name: speakup-frontend
        selector:
          matchLabels:
            app: frontend
        namespaceSelector:
          matchNames:
            - speakup
        endpoints:
          - port: http
            path: /metrics
            interval: 30s

      - name: speakup-backend
        selector:
          matchLabels:
            app: backend
        namespaceSelector:
          matchNames:
            - speakup
        endpoints:
          - port: http
            path: /metrics
            interval: 30s
    EOF
  ]

  depends_on = [module.eks]
}

# Loki for logging
resource "helm_release" "loki" {
  name             = "loki"
  repository       = "https://grafana.github.io/helm-charts"
  chart            = "loki-stack"
  namespace        = "monitoring"
  create_namespace = true
  version          = "2.10.0"

  values = [
    <<-EOF
    loki:
      enabled: true
      persistence:
        enabled: true
        size: 20Gi

    promtail:
      enabled: true

    grafana:
      enabled: false  # Using grafana from kube-prometheus-stack
    EOF
  ]

  depends_on = [module.eks, helm_release.prometheus]
}
