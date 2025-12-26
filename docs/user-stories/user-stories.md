## SG Routing APP - User Stories

## Overview

This document contains user stories for the SG Routing application. User stories are written from the perspective of end users and describe the features and functionality they need.

---

## User Stories Table

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| **US-001** | As a user, I want to view the routes of a specific vehicle number so that I can track that particular bus's trip. | • User can search for a vehicle by ID<br>• User can select a vehicle from the list<br>• Vehicle route is displayed on the map<br>• Vehicle trip information is shown |
| **US-002** | As a user, I want to view the routes of a specific bus line so that I can see all buses operating on that line. | • User can search for a bus line by name<br>• User can select a line from the list<br>• All buses on that line are displayed on the map<br>• Line trip information is shown |
| **US-003** | As a user, I want to search for vehicles using a search box so that I can quickly find a specific vehicle among thousands of options. | • Search box allows text input<br>• Results filter as user types<br>• Search is case-insensitive<br>• Clear indication when no results found |
| **US-004** | As a user, I want to search for bus lines using a search box so that I can quickly find a specific line. | • Search box allows text input<br>• Results filter as user types<br>• Search is case-insensitive<br>• Clear indication when no results found |
| **US-005** | As a user, I want to see the server status so that I know if the live bus data is available. | • Server status is displayed prominently<br>• Status updates automatically<br>• Clear visual indication (green = ready, red = unavailable)<br>• User is informed during cold start |
| **US-006** | As a user, I want to know whether the map is showing live or cached data, and I can still view routes even when the nyc server is down. | • Stored data is loaded when the nyc server is down.
| **US-007** | As a user, I want to see bus route geometry on an interactive map so that I can visualize the bus trip path. | • Routes are displayed as lines on the map<br>• Routes are clearly visible with distinct color<br>• Multiple routes can be displayed for bus lines |
| **US-008** | As a user, I want to click on map markers to see detailed information so that I can learn more about specific points. | • Markers/routes are clickable<br>• Popup shows relevant information<br>• Information includes all available properties<br>• Popup is easy to read and formatted |
| **US-009** | As a user, I want to see route markers as distinct points so that I can identify specific locations. | • Points displayed as popup markers<br>• Markers are clearly visible<br>• Markers have consistent styling<br>• Markers distinguish from lines |
| **US-010** | As a user, I want the server cold start to be handled gracefully so that I'm not confused when the server is initializing. | • Cold start status displayed clearly<br>• User informed about wait time<br>• Automatic retry until server ready<br>
| **US-011** | As a user, I want clear visual feedback when data is loading so that I know the application is working. | • Loading text is shown during data fetch
| **US-012** | As a user, I want to see error messages when something goes wrong so that I know what happened and what to do. | • Clear error messages displayed<br>• Errors don't crash the application<br>• User can retry after errors |