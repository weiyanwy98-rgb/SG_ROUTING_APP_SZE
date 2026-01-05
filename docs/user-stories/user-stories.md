## SG Routing App – User Stories

## Overview

This document contains user stories for the SG Routing application.  
User stories are written from the perspective of end users and describe the features, interactions, and error handling they expect when using the system.

---

## User Stories Table

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| **US-001** | As a user, I want to view the status of the server so that I know whether the application is ready to use. | • Server status is displayed prominently on the UI<br>• Status updates automatically at regular intervals<br>• Clear visual indication (green = ready, red = unavailable)<br>• Error message is shown if status cannot be retrieved |
| **US-002** | As a user, I want to view routes of specific road types so that I can understand the road network in Singapore. | • User can select one or more road types via checkboxes<br>• Selected road types are rendered on the map<br>• Each road type has a unique color<br>• Toggling a checkbox immediately updates the map |
| **US-003** | As a user, I want to search for the fastest route using different mode of transport so that I can plan my trip efficiently. | • User selects origin and destination by clicking on the map<br>• User can select a transport mode (Default, Car, Cycle, Walk)<br>• Fastest route is calculated and displayed on the map<br>• Previous route is cleared when a new route is generated |
| **US-004** | As a user, I want to click on map markers or routes to see detailed information so that I can learn more about specific locations or road segments. | • Markers and routes are clickable<br>• Popup appears on click<br>• Popup displays all relevant properties<br>• Popup content is readable and well formatted |
| **US-005** | As a user, I want to view route details so that I can understand the roads used in my journey. | • Information includes road name, road type, and distance<br> • Route details are displayed in a dedicated panel <br>• Route segments are shown in sequential order <br>
| **US-006** | As a user, I want to view all latest blockages on the map so that I can avoid restricted areas when planning routes. |• Blockages updates automatically at regular interval<br> • Blockages are displayed using a distinct icon<br>• A circular radius indicates the blockage impact area<br> • Blockages update automatically when data changes |
| **US-007** | As a user, I want to add a new blockage on the map so that routes can adapt to real-world changes. | • User selects blockage coordinates by clicking the map<br>• User enters blockage details (name, radius, description)<br>• Blockage is saved successfully to the server<br>• Blockage appears on the map immediately |
| **US-008** | As a user, I want to select an existing blockage so that I can choose which blockage to delete. | • User can click a blockage icon on the map or dropdown selector<br>• Selected blockage's radius is visually highlighted
| **US-009** | As a user, I want to delete a selected blockage so that it no longer affects route calculation. | • Delete action is clearly visible (button)<br>• Delete request is sent to the server with the correct blockage identifier<br>• Blockage is removed from the map after successful deletion |
| **US-010** | As a user, I want to view selected blockage information so I have a better understanding of the restricted area. | • User select the blockage on the map or dropdown selector<br> • Blockage information is displayed in a pop up • Information is formatted for easier understanding
| **US-011** | As a user, I want the system to automatically generate a new route after a blockage is added or deleted so that I always see the most accurate route. | • Route is recalculated automatically after blockage creation<br>• Updated route avoids the blockage area<br>• New route replaces the old route on the map |
| **US-012** | As a user, I want to interact with the map by clicking to select locations so that I can easily define routing points. | • Clicking the map sets coordinates<br>• Selected points are visually marked<br>• User can reset or change selected points |
| **US-013** | As a user, I want the system to notify me when an error occured so that I understand what went wrong. | • Clear error message is displayed<br>• Reason for failure is explained (server busy, no valid route, duplicate blockage, etc)<br>• User can retry the operation |
| **US-014** | As a user, I want to see a loading screen so that I know my requests are being processed. | • Loading screen display when requests are being process and data are being fetched<br> • No other actions are permitted when loading screen is up.
