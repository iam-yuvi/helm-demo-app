{{- define "gateway.labels" -}}
app: gateway
{{- end }}

{{- define "users.labels" -}}
app: users
{{- end }}

{{- define "products.labels" -}}
app: products
{{- end }}

{{- define "common.labels" -}}
{{- .Values.commonEnv.name}}: {{ .Values.commonEnv.value }}
{{- end}}

