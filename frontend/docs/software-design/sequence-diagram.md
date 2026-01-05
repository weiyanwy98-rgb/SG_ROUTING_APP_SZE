``` mermaid
sequenceDiagram
    autonumber

    participant User as End User
    participant FE as Frontend (React App)
    participant Server as Routing Web Server

    %% --- 1. FRONTEND PERIODIC SERVER STATUS CHECK ---
    loop Every 10s
    Note over FE: FETCH SERVER STATUS
        FE->>Server: GET /ready (Server returns READY or WAIT)
        alt Server says READY
            Server-->>FE: { "Ready" }
        else Server says WAIT
            Server-->>FE: { "Wait" }
        end
    end

    %% --- 2. USER FETCH ALL Blockage ---
    
    Loop Every 30s, each try 1000ms Max 10 tries
    Note over FE: FETCH BLOCKAGE
        FE->>Server: GET /blockage

        alt Server Ready
            Server-->>FE: 200 OK + DATA
            FE->>FE: Display latest blockage data on FE

        else Server Wait or Error
            Server-->>FE: { "Wait" } or 500 timeout/error
            end
    end

    %% --- 3. User Add/Delete Blockage---
    loop Every 1000ms Max 10 tries
    %%--- Add Blockage ---
        Note over User,FE: ADD BLOCKAGE
        User->>FE: Select Coordinate and fill up details
        FE->>Server: POST /blockage
      %%  --- Delete Blockage---
        Note over User,FE: Delete BLOCKAGE
        User->>FE : Select Blockage
        FE->>Server: DEL /blockage/:BlockageName

        alt Server Ready
            Server-->>Server: Update + GET /blockage
            Server-->>FE: 200 OK + Data
            FE-->>FE: Display latest Blockages

        else Server Wait or Error
            Server-->>FE: { "Wait" } or 500 timeout/error
            end
    end

%%--- 4. USER FETCH ROAD TYPES ---

loop Every 1000ms Max 10 tries
    Note over FE,Server: Fetch Road Types
    FE->>Server: GET /allAxisTypes
    
    alt Server Ready
        Server-->>FE: 200 OK + Road Types List
        FE-->>Server: POST /:RoadType
        Server-->>FE: 200 OK + Each Road Types GEOJSON
    else Server Wait or Error
        Server-->>FE: {"Wait"} or 500 timeout/error
        end
    end

%%--- 5. USER VIEW ROAD TYPE ---

Note over User, FE: View Road Type
    User->>FE: SELECT ROAD TYPE
    FE->>FE: RENDER ROAD TYPE GEOJSON ON MAP

%%--- 6. USER SEARCH ROUTE ---

Note over User, FE: Search Route
User->>FE: Select Coordinates and Transport Type
loop every 1000ms
    FE->>Server: POST /changeValidRoadTypes + selected transport type data
    
    alt Server Ready
        FE->>Server: POST /route + selected coordinates data
        Server-->>FE: 200 OK + DATA
        FE-->>FE: Render data on map
    else Server Wait or Error
        Server-->>FE: {"Wait"} or 500 timeout/error
        end
    end
