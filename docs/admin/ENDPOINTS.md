# Admin API Endpoints (Implemented)

Base: /api/v1/admin

- GET /themes?portalId={uuid}
- POST /themes { name, portalId, tokens, isActive? }
- PUT /themes/:id { name?, tokens?, isActive? }
- POST /themes/:id/activate
- GET /themes/active/tokens?portalId={uuid}

- GET /users?portalId={uuid}&page=1&pageSize=20

- GET /audit-logs?portalId={uuid}

- GET /security-alerts?portalId={uuid}
- PUT /security-alerts/:id/resolve

- GET /permissions/audit?portalId={uuid}

Analytics (separate module)
- POST /api/v1/analytics/track { event, pageId?, portalId, sessionId?, metadata? }
- GET /api/v1/admin/analytics/dashboard?portalId={uuid}
