# External API Endpoints Documentation

## Overview

This document describes how the frontend service communicate with external routing service API to retrieve data.

**Routing URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app`
**NYC URL :** `https://nyc-bus-routing-k3q4yvzczq-an.a.run.app`

---

## Endpoints

### 1. Server Readiness Check

**Purpose:** Check if the Routing server is working and operational

**Endpoint:** `GET /ready`

**Routing URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app/ready`

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
  string
}
```

**Example Request:**
```bash
curl -X GET https://routing-web-service-ityenzhnyq-an.a.run.app/ready
```

**Example Response:**
#### Server Ready
```json
{
  "Ready"
}
```
#### Server Starting Up
```json
{
  "Wait"
}
```

**Usage Notes:**
- Check if server is working and operational

---

### 2. Get all road types

**Purpose:** Retrieve a list of all road types.

**Endpoint:** `GET /allAxisTypes`

**NYC URL:** `https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/allAxisTypes`

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
    "bridleway",
    "cycleway",
    "footway"
  ...
]
```

**Example Request:**
```bash
curl -X GET https://routing-web-service-ityenzhnyq-an.a.run.app/allAxisTypes
```

**Usage Notes:**
- Returns a list of road type from the external server
- Used to populate the road type checkboxes

---

### 3. Get Road Types used by routing algorithm

**Purpose:** Retrieve list of road types used by the routing algorithm

**Endpoint:** `GET /validAxisTypes`

**NYC URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app/validAxisTypes`

**Request Method:** `GET`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**
- None

**Response Format:** 
- JSON array of strings

**Response Schema:**
```typescript
{
  string[]
}
```

**Example Request:**
```bash
curl -X GET https://routing-web-service-ityenzhnyq-an.a.run.app/validAxisTypes
```

**Example Response:**
```json
[
 "footway",
 "residential"
]
```

**Usage Notes:**
- Returns road types used in routing algorithm

---

### 4. Get GEO json data of a specific road type

**Purpose:** Retrieve a Geojson data of a specific road type

**Endpoint:** `GET /axisType/:RoadType`

**Routing URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app/axisType/:RoadType`

**Request Method:** `GET`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Parameters:** - `RoadType` (string, required): (e.g., "motorway")

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

**Example Response:**
```json
{
    "axis_type": "motorway",
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        103.897400,
                        1.297156
                    ],
                    [
                        103.898384,
                        1.297519
                    ]
                ]
            },
            "properties": {
                "road name": "East Coast Parkway",
                "road type": "motorway",
                "distance": 116
            }
        }
    ]
}
```

**Example Request:**
```bash
curl -X GET https://routing-web-service-ityenzhnyq-an.a.run.app/axisType/:RoadType
```

**Usage Notes:**
- Return Geojson data of a specific road type

---

### 5. Change Road Type in Routing algorithm

**Purpose:** Change the road type used in the routing algorithm

**Endpoint:** `POST /changeValidRoadTypes`

**Routing URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app/changeValidRoadTypes`

**Request Method:** `POST`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**
- none

**Response Format:** 
- JSON array of strings

**Response Schema:**
```typescript
{
  string[]
}
```

**Example Request:**
```bash
curl -X GET https://routing-web-service-ityenzhnyq-an.a.run.app/changeValidRoadTypes
```

**Example Response:**
```json
{
  ["motorway"]
}
```

**Usage Notes:**
- Change the road types used in the routing algorithm


### 6. Routing Algorithm

**Purpose:** Find the fastest route to reach from origin to destination

**Endpoint:** `POST /route`

**Routing URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app/route`

**Request Method:** `POST`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**
- none

**Response Format:** 
- GEOJSON features

**Response Schema:**
```typescript
{
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
}
```

**Example Request:**
```bash
curl -X POST https://routing-web-service-ityenzhnyq-an.a.run.app/route
```

**Example Response:**
```json
{
      "app_name": "MY_ROUTING (time taken : 48ms)",
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.864517,
                    1.383342
                ]
            },
            "properties": {
                "point type": "start"
            }
        },
    ]
    ...
}
```

**Usage Notes:**
- Find the fastest road from origin to destination

### 7. Change Road Type in Routing algorithm

**Purpose:** Retrieve GEOJSON data of all the blockages

**Endpoint:** `GET /blockage`

**Routing URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app/blockage`

**Request Method:** `GET`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**
- none

**Response Format:** 
- JSON array of strings

**Response Schema:**
```typescript
{
  {
    "items": "blockages",
    "type": "FeatureCollection",
    "features": []
}
}
```

**Example Request:**
```bash
curl -X GET https://routing-web-service-ityenzhnyq-an.a.run.app/blockage
```

**Example Response:**
```json
{
  {
    "items": "blockages",
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.870239,
                    1.364579
                ]
            },
            "properties": {
                "name": "block 1",
                "description": "test",
                "distance (meters)": 200
            }
        }
    ]
}
}
```

**Usage Notes:**
- Get geojson data of all the blockages


### 8. Add blockages

**Purpose:** Add new blockages

**Endpoint:** `POST /blockage`

**Routing URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app/blockage`

**Request Method:** `POST`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**
- none

**Response Format:** 
- GEOJSON features

**Response Schema:**
```typescript
{
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
}
}
```

**Example Request:**
```bash
curl -X POST https://routing-web-service-ityenzhnyq-an.a.run.app/blockage
```

**Example Response:**
```json
{
    "items": "blockages",
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.870239,
                    1.364579
                ]
            },
            "properties": {
                "name": "block 1",
                "description": "test",
                "distance (meters)": 200
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.519836,
                    1.352083
                ]
            },
            "properties": {
                "name": "block 2",
                "description": "description 2",
                "distance (meters)": 200
            }
        }
    ]
}
```

**Usage Notes:**
- Add new blockages


### 9. Delete blockage

**Purpose:** Delete blockage

**Endpoint:** `DELETE /blockage/:BlockageName`

**Routing URL:** `https://routing-web-service-ityenzhnyq-an.a.run.app//blockage/:BlockageName`

**Request Method:** `DELETE`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Path Paramete(rs:**
- blockageName (string), eg("block 1")

**Response Format:** 
- GEOJSON

**Response Schema:**
```typescript
{
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
}
```

**Example Request:**
```bash
curl -X DELETE https://routing-web-service-ityenzhnyq-an.a.run.app/blockage/:BlockageName
```

**Example Response:**
```json
{
  {
    "items": "blockages",
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.519836,
                    1.352083
                ]
            },
            "properties": {
                "name": "block 2",
                "description": "description 2",
                "distance (meters)": 200
            }
        }
    ]
}
}
```

**Usage Notes:**
- Delete blockage

## Error Handling

All endpoints may return the following error responses:

### HTTP Status Codes

| Status Code | Meaning | Description |
|------------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | Resource not found (invalid vehicle/line ID) |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable