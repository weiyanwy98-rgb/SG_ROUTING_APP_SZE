# SG Routing Application – Test Procedures

## Overview

This document defines the test procedures for the **SG Routing Application**, which allows users to visualize road networks, calculate routes, and manage road blockages dynamically on an interactive map.

The test cases validate:
- Server readiness handling
- Road type visualization
- Route search by transport mode
- Map interaction
- Blockage creation and deletion
- Error handling and retry logic

---

## Test Environment

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Modern web browser (Chrome, Firefox, Edge)
- Internet connection (map tiles & API access)
- Backend Routing Server running
- Frontend React Application running

### URLs
- **Frontend URL**: `http://localhost:5173`
- **Routing API Base URL**: `https://routing-web-service-ityenzhnyq-an.a.run.app`

---

## Test Cases

---

### TC-001: Server Readiness Check

**Objective**: Verify that the application correctly detects routing server availability.

**User Story**: US-001

**Pre-conditions**:
- Application is loaded
- Server may be ready or busy

**Test Steps**:
1. Open the application in a browser
2. Observe the server status indicator
3. Wait for automatic refresh (10 seconds)

**Expected Results**:
- Green badge when server is ready
- Red badge when server is unavailable or busy
- Status updates automatically

**Pass/Fail Criteria**:
- Pass: Status reflects server state correctly
- Fail: Status is incorrect or does not update

---

### TC-002: Load All Road Types

**Objective**: Verify that all available road types are fetched and displayed.

**User Story**: US-002

**Pre-conditions**:
- Server is ready

**Test Steps**:
1. Load the application
2. Observe the Road Types section

**Expected Results**:
- Road types list is displayed
- Each road type appears once
- Loading indicator disappears after fetch

**Pass/Fail Criteria**:
- Pass: All road types are shown correctly
- Fail: List is empty, duplicated, or errors occur

---

### TC-003: Toggle Road Type Visibility

**Objective**: Verify that selecting road types displays corresponding routes on the map.

**User Story**: US-002

**Pre-conditions**:
- Road types loaded successfully

**Test Steps**:
1. Select a road type checkbox
2. Observe the map
3. Deselect the checkbox

**Expected Results**:
- Routes appear when selected
- Routes disappear when deselected
- Each road type has a consistent color

**Pass/Fail Criteria**:
- Pass: Map updates correctly
- Fail: Routes do not appear or disappear correctly

---

### TC-004: Search Route (Default Mode)

**Objective**: Verify route calculation using default routing mode.

**User Story**: US-003

**Pre-conditions**:
- Server is ready
- Map is visible

**Test Steps**:
1. Click Enable Marker
2. Click on the map to select origin
3. Save origin
4. Click on the map to select destination
5. Save destination
6. Click “Search Route”

**Expected Results**:
- Route appears on the map
- Route connects origin and destination
- Route information popup is available

**Pass/Fail Criteria**:
- Pass: Route is displayed correctly
- Fail: No route or incorrect route displayed

---

### TC-005: Search Route by Transport Mode

**Objective**: Verify route calculation for car, cycle, and walk modes.

**User Story**: US-003

**Pre-conditions**:
- Origin and destination selected

**Test Steps**:
1. Select Car mode
2. Search route
3. Repeat for Cycle and Walk modes

**Expected Results**:
- Routes differ by transport mode
- Only allowed road types are used per mode
- Map updates instantly

**Pass/Fail Criteria**:
- Pass: Correct routes per mode
- Fail: Same route regardless of mode

---

### TC-006: Map Interaction – Pan & Zoom

**Objective**: Verify map navigation functionality.

**User Story**: US-006

**Pre-conditions**:
- Map is visible

**Test Steps**:
1. Drag the map
2. Zoom in and out
3. Observe tile loading

**Expected Results**:
- Smooth panning and zooming
- No lag or freezing
- Tiles load correctly

**Pass/Fail Criteria**:
- Pass: Map interaction is smooth
- Fail: Lag, freeze, or broken tiles

---

### TC-007: View Route & Road Feature Details

**Objective**: Verify popup information for routes and roads.

**User Story**: US-004

**Pre-conditions**:
- Routes are displayed

**Test Steps**:
1. Click on a route or road segment
2. Observe popup

**Expected Results**:
- Popup appears immediately
- Shows road name, type, and distance
- Information is readable

**Pass/Fail Criteria**:
- Pass: Popup displays correct data
- Fail: Popup missing or incorrect

---

### TC-008: Add Blockage

**Objective**: Verify that users can add a blockage.

**User Story**: US-006

**Pre-conditions**:
- Server is ready

**Test Steps**:
1. Click on "Enable Marker”
2. Click on the map
3. Enter blockage name, radius, and description
4. Click “Add Blockage”

**Expected Results**:
- Blockage marker appears on map
- Radius circle is shown
- Blockage is added to the list

**Pass/Fail Criteria**:
- Pass: Blockage is added successfully
- Fail: Blockage does not appear or error occurs

---

### TC-009: Delete Blockage

**Objective**: Verify that users can delete an existing blockage.

**User Story**: US-008

**Pre-conditions**:
- At least one blockage exists

**Test Steps**:
1. Select a blockage from dropdown or map
2. Click “Delete Blockage”
3. Confirm deletion

**Expected Results**:
- Blockage is removed from map
- Blockage list updates
- Route is recalculated if applicable

**Pass/Fail Criteria**:
- Pass: Blockage removed correctly
- Fail: Blockage remains or errors occur

---
