# NYC Bus Trip Viewer - Test Procedures

## Overview

This document outlines the testing procedures for the NYC Bus Trip Viewer application.

---

## Test Environment

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls and map tiles)
- Backend server running on `http://localhost:5000`
- Frontend server running on `http://localhost:5173`

### Test Data
- **Backend API URL**: `http://localhost:5000/api/bus_trip`
- **Base API URL**: `https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip`
- **Sample Vehicle IDs**: NYCT_4614, NYCT_4615, NYCT_4616
- **Sample Line Names**: Bx2, M1, M15, Q1

---

## Test Cases

### TC-001: Server Readiness Check

**Objective**: Verify that the application correctly detects server availability

**User Story**: US-005, US-011

**Pre-conditions**:
- Application is loaded in browser
- Server may or may not be ready

**Test Steps**:
1. Open the application URL in a browser
2. Observe the server status indicator at the top of the page

**Expected Results**:
- If server is ready: Green "Server: Online" badge is displayed
- If server unavailable: Alert shows "Server: Offline" error
- Status automatically updates every 30 seconds

**Pass/Fail Criteria**:
- Pass: Status indicator accurately reflects nyc server state
- Fail: Status indicator is incorrect or doesn't update

---

### TC-002: Load Vehicle References List

**Objective**: Verify that the vehicle references list loads correctly

**User Story**: US-001, US-003

**Pre-conditions**:
- backend server is ready

**Test Steps**:
1. Navigate to the Vehicle selector section
2. Click on "Search vehicle..." button
3. Observe the dropdown list

**Expected Results**:
- Dropdown opens with search input
- List contains approximately 220 vehicle IDs

**Pass/Fail Criteria**:
- Pass: List loads instantly, all vehicles displayed
- Fail: List doesn't load, takes too long, or shows errors

---

### TC-003: Search for Specific Vehicle

**Objective**: Verify that vehicle search functionality works correctly

**User Story**: US-003

**Pre-conditions**:
- Backend is ready
- Vehicle list is loaded

**Test Steps**:
1. Click "Search vehicle..." button
2. Type "NYCT_4614" in the search box
3. Observe filtered results
4. Select the vehicle from results

**Expected Results**:
- Search filters results as user types
- Only matching vehicles are shown
- Search is case-insensitive
- Selected vehicle appears in the button

**Pass/Fail Criteria**:
- Pass: Search filters instantly and accurately
- Fail: Search is slow, inaccurate, or doesn't work

---

### TC-004: Load Vehicle Trip Data

**Objective**: Verify that vehicle trip data loads and displays on map

**User Story**: US-001, US-007, US-010

**Pre-conditions**:
- Backend server is ready
- Vehicle "NYCT_4614" is selected

**Test Steps**:
1. With vehicle selected, click "Load Trip" button
2. Observe loading state
3. Wait for data to load
4. Observe map display

**Expected Results**:
- Shows loading message
- Route appears on map as red line or markers
- Map automatically centered to the route

**Pass/Fail Criteria**:
- Pass: Data loads successfully and displays correctly
- Fail: Data fails to load, map doesn't update, or errors occur

---

### TC-005: Load Published Line Names List

**Objective**: Verify that the bus line names list loads correctly

**User Story**: US-002, US-004

**Pre-conditions**:
- Backend server is ready

**Test Steps**:
1. Navigate to the Line selector section
2. Click on "Search line..." button
3. Observe the dropdown list

**Expected Results**:
- Dropdown opens with search input
- List contains bus line names (Bx1, M1, etc.)
- Line count is displayed in the description

**Pass/Fail Criteria**:
- Pass: List loads instantly, all lines displayed
- Fail: List doesn't load, takes too long, or shows errors

---

### TC-006: Search for Specific Bus Line

**Objective**: Verify that bus line search functionality works correctly

**User Story**: US-004

**Pre-conditions**:
- Backend server is ready
- Line list is loaded

**Test Steps**:
1. Click "Search line..." button
2. Type "Bx2" in the search box
3. Observe filtered results
4. Select the line from results

**Expected Results**:
- Search filters results as user types
- Only matching lines are shown
- Selected line appears in the button

**Pass/Fail Criteria**:
- Pass: Search filters instantly and accurately
- Fail: Search is slow, inaccurate, or doesn't work

---

### TC-007: Load Bus Line Trip Data

**Objective**: Verify that bus line trip data loads and displays on map

**User Story**: US-002, US-009, US-010

**Pre-conditions**:
- Server is ready
- Line "Bx2" is selected

**Test Steps**:
1. With line selected, click "Load Trip" button
2. Observe loading state
3. Wait for data to load
4. Observe map display

**Expected Results**:
- "Loading..." message is shown
- Routes appear on map as blue lines (may be multiple buses)
- Map automatically centered to bus lines

**Pass/Fail Criteria**:
- Pass: Data loads successfully and displays correctly
- Fail: Data fails to load, map doesn't update, or errors occur

---



**Objective**: Verify that map panning functionality works correctly

**User Story**: US-006

**Pre-conditions**:
- Application loaded
- Map is visible

**Test Steps**:
1. Click and hold on the map
2. Drag the mouse to move the map
3. Release mouse button
4. Observe map position

**Expected Results**:
- Map pans smoothly while dragging
- Map follows mouse movement accurately
- No lag or stuttering
- New map tiles load as needed

**Pass/Fail Criteria**:
- Pass: Pan works smoothly and accurately
- Fail: Pan is laggy, inaccurate, or doesn't work

---

### TC-08: Click Map Marker for Details

**Objective**: Verify that clicking map markers shows detailed information

**User Story**: US-009

**Pre-conditions**:
- Route data is loaded on map
- Route has point features (markers)

**Test Steps**:
1. Click on a route marker (circle point)
2. Observe popup display
3. Read popup content
4. Click elsewhere to close popup

**Expected Results**:
- Popup appears immediately on click
- Popup displays all available properties
- Properties are formatted as key-value pairs
- Popup is readable and well-formatted
- Popup closes when clicking elsewhere

**Pass/Fail Criteria**:
- Pass: Popup displays correctly with all information
- Fail: Popup doesn't appear or information is missing

---

### TC-09: Live or Storaged Data

**Objective**: Verify if data is from NYC server or storaged data in backend

**User Story**: US-008

**Pre-conditions**:
- Backend is ready

**Test Steps**:
1. Check if NYC server is running
2. Retrieve data from backend storage if NYC server is down

**Expected Results**:
- Application function as normally

**Pass/Fail Criteria**:
- Pass: All information displays correctly
- Fail: Information is missing, incorrect, or unreadable

---

### TC-010: Error Handling - Invalid Vehicle

**Objective**: Verify that application handles invalid vehicle IDs gracefully

**User Story**: US-013

**Pre-conditions**:
- backend server is ready
- nyc server is ready

**Test Steps**:
1. Manually call API with invalid vehicle ID
2. Observe error handling

**Expected Results**:
- Error is caught and logged to console
- Application doesn't crash
- User-friendly error message is displayed (if applicable)
- User can retry with valid vehicle

**Pass/Fail Criteria**:
- Pass: Error is handled gracefully
- Fail: Application crashes or shows unclear errors

---


```markdown
**Test Execution Date**: [Date]
**Tester**: [Name]
**Build Version**: [Version/Commit Hash]
**Environment**: [Browser, OS]

**Test Results Summary**:
- Total Test Cases: XX
- Passed: XX
- Failed: XX
- Blocked: XX
- Not Executed: XX

**Pass Rate**: XX%

**Critical Issues**: [List any P1 bugs]

**Notes**: [Any additional observations]
```

---

**Document Version**: 1.0
**Last Updated**: December 2, 2024
**Created By**: NYC Bus Trip Viewer QA Team