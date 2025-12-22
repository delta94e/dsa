variable "domain" {
  description = "Domain name for the application"
  type        = string
  default     = "speakup.example.com"
}

variable "grafana_admin_password" {
  description = "Grafana admin password"
  type        = string
  sensitive   = true
  default     = "admin123"  # Change in production!
}
