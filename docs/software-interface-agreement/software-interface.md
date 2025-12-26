# External API Endpoints Documentation

## Overview

This document describes how the NYC backend service communicates with the external NYC API to retrieve live or storaged data

**NYC URL:** `https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip`

**Backend URL:** `http://localhost:5000/api/bus_trip`

---

## Endpoints

### 1. Server Readiness Check

**Purpose:** Check if the NYC Bus API server is ready and operational. The server requires a cold start and may not be available 24/7.

**Endpoint:** `GET /ready`

**NYC URL:** `https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/ready`

**Backend URL:** `http://localhost:5000/api/bus_trip/ready`

**Request Method:** `GET`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Parameters:** None

**Response:**
- **Success (200 OK)**
- **Error (4xx/5xx)**

**Response Format:**
```typescript
{
  status: string;
}
```

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/bus_trip/ready
```

**Example Response:**
#### Server Ready
```json
{
  "status": "Ready"
}
```
#### Server Starting Up
```json
{
  "status": "Wait"
}
```

**Usage Notes:**
- Check if data are retrieved from BE storage or from nyc server
- The server may require several seconds to complete cold start
- Recommended to poll this endpoint every 30 seconds

---

### 2. Get Vehicle References

**Purpose:** Retrieve a list of all available vehicle reference IDs in the NYC bus system.

**Endpoint:** `GET /getVehRef`

**NYC URL:** `https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/getVehRef`

**Backend URL:** `http://localhost:5000/api/bus_trip/getVehRef`

**Request Method:** `GET`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Parameters:** None

**Response Format:** JSON array of strings

**Response Schema:**
```typescript
string[]
```

**Example Response:**
```json
[
  "NYCT_4614",
  "NYCT_4615",
  "NYCT_4616",
  ...
]
```

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/bus_trip/getVehRef
```

**Usage Notes:**
- Returns approximately 220 vehicle references from nyc server or backend local storage
- Response is stored in backend local storage
- Used to populate the vehicle selector dropdown

---

### 3. Get Bus Trip by Vehicle Reference

**Purpose:** Retrieve GeoJSON trip data for a specific vehicle by its reference ID.

**Endpoint:** `GET /getBusTripByVehRef/{vehicleRef}`

**NYC URL:** `https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/getBusTripByVehRef/{vehicleRef}`

**Backend URL:** `http://localhost:5000/api/bus_trip/getBusTripByVehRef/{vehicleRef}`

**Request Method:** `GET`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**
- `vehicleRef` (string, required): The vehicle reference ID (e.g., "NYCT_4614")

**Response Format:** GeoJSON FeatureCollection

**Response Schema:**
```typescript
{
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: number[] | number[][];
    };
    properties: Record<string, any>;
  }>;
}
```

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/bus_trip/getBusTripByVehRef/NYCT_4614
```

**Example Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-74.006, 40.7128],
          [-74.007, 40.7138]
        ]
      },
      "properties": {
        "vehicleRef": "NYCT_4614",
        "publishedLineName": "Bx2",
        "direction": "0",
        "timestamp": "2024-12-02T10:00:00Z"
      }
    }
  ]
}
```

**Usage Notes:**
- Returns route geometry and trip metadata from nyc server or backend local storage
- Response is saved in backend local storage for each vehicle

---

### 4. Get Published Line Names

**Purpose:** Retrieve a list of all published bus line names in the NYC bus system.

**Endpoint:** `GET /getPubLineName`

**NYC URL:** `https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/getPubLineName`

**Backend URL:** `http://localhost:5000/api/bus_trip/getPubLineName`

**Request Method:** `GET`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Parameters:** None

**Response Format:** JSON array of strings

**Response Schema:**
```typescript
string[]
```

**Example Response:**
```json
[
  "Bx1",
  "Bx2",
  "M1",
  "M15",
  "Q1",
  ...
]
```

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/bus_trip/getPubLineName
```

**Usage Notes:**
- Returns all active bus line names from nyc server or backend local storage
- Response is stored in Backend local storage
- Used to populate the line selector dropdown

---

### 5. Get Bus Trip by Published Line Name

**Purpose:** Retrieve GeoJSON trip data for all buses operating on a specific line.

**Endpoint:** `GET /getBusTripByPubLineName/{lineName}`

**Full URL:** `https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip/getBusTripByPubLineName/{lineName}`

**Backend URL:** `http://localhost:5000/api/bus_trip/getBusTripByPubLineName/{lineName}`

**Request Method:** `GET`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**
- `lineName` (string, required): The published line name (e.g., "Bx2")

**Response Format:** GeoJSON FeatureCollection

**Response Schema:**
```typescript
{
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: number[] | number[][];
    };
    properties: Record<string, any>;
  }>;
}
```

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/bus_trip/getBusTripByPubLineName/Bx2
```

**Example Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-74.006, 40.7128],
          [-74.007, 40.7138],
          [-74.008, 40.7148]
        ]
      },
      "properties": {
        "publishedLineName": "Bx2",
        "direction": "0",
        "routeId": "BX2",
        "tripId": "BX2_123",
        "timestamp": "2024-12-02T10:00:00Z"
      }
    }
  ]
}
```

**Usage Notes:**
- Returns route geometry for all active buses on the specified line from nyc server or backend local storage
- May contain multiple features (one per active bus)
- Response is stored in Backend local storage

---

## Error Handling

All endpoints may return the following error responses:

### HTTP Status Codes

| Status Code | Meaning | Description |
|------------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | Resource not found (invalid vehicle/line ID) |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Server not ready (cold start) |

### Error Response Format Example

```json
{
  "timestamp": "2025-12-02T06:02:39.692+00:00",
  "status": 404,
  "error": "Error message description",
  "path": "/api/bus_trip/readyy"
}
```
--- -->


### Storage Benefits

- **Improved Reliablity:** Application still functions even when NYC server is down

---

## Authentication

**Current Implementation:** None required

All endpoints are publicly accessible without authentication tokens or API keys.

---

### Service Layer Location

All API integrations are implemented in:
```
src/app.jsx
```

### Key Functions

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `checkServerReady()` | `/ready` | Check server availability |
| `getVehicleReferences()` | `/getVehRef` | Get vehicle list |
| `getBusTripByVehicleRef(vehicleRef)` | `/getBusTripByVehRef/{vehicleRef}` | Get vehicle trip |
| `getPublishedLineNames()` | `/getPubLineName` | Get line list |
| `getBusTripByPublishedLineName(lineName)` | `/getBusTripByPubLineName/{lineName}` | Get line trip |

--- -->

For API issues or questions:
- **API Provider:** NYC Bus Engine
- **Hosting:** Google Cloud Run

---

**Document Version:** 1.0
**Last Updated:** December 2, 2024
**Author:** Generated for NYC Bus Trip Viewer Application
External-API-Endpoints.md
Displaying unnamed.jpg.