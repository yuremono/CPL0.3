# API Documentation

**Last Updated**: 2026-02-05
**Version**: 1.0.0

## Overview

Content Projection Layer provides REST API endpoints for AI-powered content editing. This document describes the available endpoints, request/response formats, and authentication requirements.

---

## Base URL

```
http://localhost:3000/api
```

---

## Endpoints

### 1. AI Edit Endpoint

Edits content using AI providers.

#### Endpoint

```
POST /api/ai/edit
```

#### Request Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| Content-Type | string | Yes | `application/json` |

#### Request Body

```typescript
{
  elementId: string;           // Target element ID (e.g., "blk_abc123")
  currentContent: string;      // Current content of the element
  editInstruction: string;     // Natural language edit instruction
  elementType?: string;        // Element type (e.g., "heading", "paragraph")
  provider?: "openai" | "anthropic" | "google";  // AI provider (default: openai)
}
```

#### Example Request

```bash
curl -X POST http://localhost:3000/api/ai/edit \
  -H "Content-Type: application/json" \
  -d '{
    "elementId": "blk_hero_heading",
    "currentContent": "Creative Developer",
    "editInstruction": "Change to Full Stack Developer with more impact",
    "elementType": "heading",
    "provider": "openai"
  }'
```

#### Response

Success Response (200 OK):

```typescript
{
  success: true;
  data: {
    originalContent: string;   // Original content before edit
    editedContent: string;      // AI-generated edited content
    elementId: string;          // Target element ID
    provider: string;           // AI provider used
    model: string;              // Model used (e.g., "gpt-4")
    timestamp: string;          // ISO 8601 timestamp
  };
}
```

Error Response (400 Bad Request):

```typescript
{
  success: false;
  error: string;               // Error message
  details?: {
    field?: string;            // Field that caused the error
    issue?: string;            // Specific issue
  };
}
```

Error Response (500 Internal Server Error):

```typescript
{
  success: false;
  error: string;               // Error message
  details?: {
    provider?: string;         // Provider that failed
    reason?: string;           // Failure reason
  };
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "originalContent": "Creative Developer",
    "editedContent": "Full Stack Developer & Creative Technologist",
    "elementId": "blk_hero_heading",
    "provider": "openai",
    "model": "gpt-4",
    "timestamp": "2026-02-05T00:00:00Z"
  }
}
```

---

## Authentication

Currently, API keys are configured via environment variables and managed server-side. Client-side requests do not require authentication headers.

### Environment Variables

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_GOOGLE_API_KEY=...
```

**Security Note**: In production, implement proper authentication and API key management server-side.

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 401 | Unauthorized (missing or invalid API key) |
| 429 | Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable (AI provider down) |

---

## Rate Limiting

Currently, rate limiting is not enforced. Consider implementing rate limiting for production:

- Per-user limits
- Per-endpoint limits
- Burst vs. sustained rate limits

---

## OpenAPI/Swagger Specification

### OpenAPI 3.0 Specification

```yaml
openapi: 3.0.0
info:
  title: Content Projection Layer API
  version: 1.0.0
  description: AI-powered content editing API

servers:
  - url: http://localhost:3000/api
    description: Development server

paths:
  /ai/edit:
    post:
      summary: Edit content using AI
      operationId: editContent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - elementId
                - currentContent
                - editInstruction
              properties:
                elementId:
                  type: string
                  description: Target element ID
                currentContent:
                  type: string
                  description: Current content of the element
                editInstruction:
                  type: string
                  description: Natural language edit instruction
                elementType:
                  type: string
                  description: Element type
                  enum: [heading, paragraph, image, list, button]
                provider:
                  type: string
                  description: AI provider
                  enum: [openai, anthropic, google]
                  default: openai
      responses:
        '200':
          description: Successful edit
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      originalContent:
                        type: string
                      editedContent:
                        type: string
                      elementId:
                        type: string
                      provider:
                        type: string
                      model:
                        type: string
                      timestamp:
                        type: string
                        format: date-time
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  error:
                    type: string
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  error:
                    type: string
```

---

## Future Enhancements

### Planned Endpoints

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/api/ai/suggest` | POST | Get AI suggestions for content | Medium |
| `/api/storage/save` | POST | Save edits to storage | High |
| `/api/storage/load` | GET | Load saved edits | High |
| `/api/history` | GET | Get edit history | Medium |
| `/api/history/undo` | POST | Undo last edit | High |
| `/api/history/redo` | POST | Redo undone edit | High |

### Authentication & Authorization

- Implement JWT-based authentication
- Add API key validation
- Implement role-based access control (RBAC)

### Validation

- Add request validation using Zod schemas
- Implement rate limiting per user
- Add request signing for production use

---

## Integration Examples

### JavaScript/TypeScript

```typescript
async function editContent(elementId: string, instruction: string) {
  const response = await fetch('/api/ai/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      elementId,
      currentContent: document.getElementById(elementId)?.textContent || '',
      editInstruction: instruction,
      provider: 'openai',
    }),
  });

  const result = await response.json();

  if (result.success) {
    return result.data.editedContent;
  } else {
    throw new Error(result.error);
  }
}
```

### Python

```python
import requests

def edit_content(element_id: str, current_content: str, instruction: str, provider: str = "openai"):
    url = "http://localhost:3000/api/ai/edit"
    payload = {
        "elementId": element_id,
        "currentContent": current_content,
        "editInstruction": instruction,
        "provider": provider
    }
    response = requests.post(url, json=payload)
    return response.json()
```

---

## Support

For issues or questions regarding the API, please open an issue on GitHub.

---

**Related Documents**:
- [Quick Start Guide](QUICKSTART.md)
- [Branch Strategy](BRANCH_STRATEGY.md)
- [Project Structure](../README.md#project-structure)
