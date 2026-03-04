# UGDA Electron API Response Documentation

## Table of Contents

1. [Mission Management APIs](#1-mission-management-apis)
2. [Entity Management APIs](#2-entity-management-apis)
3. [Emitter Management APIs](#3-emitter-management-apis)
4. [Mode Management APIs](#4-mode-management-apis)
5. [Jamming Records API](#5-jamming-records-api)
6. [Emitters-Modes Tree API](#6-emitters-modes-tree-api-for-sidebar)
7. [Modes Tree API](#7-modes-tree-api-for-sidebar)

---

## 1. Mission Management APIs

### 1.1 Get All Missions

**Endpoint:** `GET /api/missions`

**Response Schema:**

```json
{
  "missions": [
    {
      "missionName": "string",
      "type": "Collective | Individual",
      "modifiedDate": "string (DD/MMM/YYYY HH:mm)",
      "modifiedBy": "string",
      "status": "Draft | Binary",
      "description": "string"
    }
  ]
}
```

**Example Response:**

```json
{
  "missions": [
    {
      "missionName": "Mission_30256",
      "type": "Collective",
      "modifiedDate": "12/Jul/2025 12:00",
      "modifiedBy": "Anaya Pandey",
      "status": "Draft",
      "description": "Curabitur lobortis id lorem id bibendum. Ut id zxc dcd..."
    }
  ]
}
```

---

## 2. Entity Management APIs

### 2.1 Get All Entities

**Endpoint:** `GET /api/entities`

**Response Schema:**

```json
{
  "entities": [
    {
      "entity": "string",
      "entityId": "string",
      "manufacturer": "string",
      "category": "Surveillance | Specific | General",
      "class": "string",
      "endurance": "number (minutes)",
      "registered": "string (DD/MMM/YYYY HH:mm)",
      "status": "Active | Under Maintenance"
    }
  ]
}
```

**Example Response:**

```json
{
  "entities": [
    {
      "entity": "Entity_001",
      "entityId": "ENT_001",
      "manufacturer": "Lockheed Martin",
      "category": "Surveillance",
      "class": "UAV",
      "endurance": 120,
      "registered": "15/Jan/2025 09:30",
      "status": "Active"
    },
    {
      "entity": "Entity_002",
      "entityId": "ENT_002",
      "manufacturer": "Boeing",
      "category": "Specific",
      "class": "Fighter",
      "endurance": 90,
      "registered": "20/Jan/2025 14:15",
      "status": "Under Maintenance"
    }
  ]
}
```

---

## 3. Emitter Management APIs

### 3.1 Get All Emitters

**Endpoint:** `GET /api/emitters`

**Response Schema:**

```json
{
  "emitters": [
    {
      "emitterName": "string",
      "createdBy": "string",
      "createdDate": "string (DD/MMM/YYYY HH:mm)",
      "modifiedBy": "string",
      "modifiedDate": "string (DD/MMM/YYYY HH:mm)",
      "description": "string"
    }
  ]
}
```

**Example Response:**

```json
{
  "emitters": [
    {
      "emitterName": "Emitter_1001",
      "createdBy": "John Smith",
      "createdDate": "10/Jan/2025 08:00",
      "modifiedBy": "Jane Doe",
      "modifiedDate": "12/Jan/2025 16:30",
      "description": "Primary radar emitter for surveillance operations"
    },
    {
      "emitterName": "Emitter_1002",
      "createdBy": "Mike Johnson",
      "createdDate": "15/Jan/2025 10:15",
      "modifiedBy": "Mike Johnson",
      "modifiedDate": "15/Jan/2025 10:15",
      "description": "Secondary tracking radar system"
    }
  ]
}
```

### 3.2 Get Emitter Details

**Endpoint:** `GET /api/emitters/{emitterId}`

**Response Schema:**

```json
{
  "id": "string",
  "name": "string",
  "code": {
    "symbol" : "string",
    "fgColor": "string",
    "bgColor" : "string"
  }
  "description": "string",
  "lastEdited": "string (DD MMM'YY HH:mm)",
  "details": {
    "type": "Naval | Air | Ground",
    "numberOfModes": "number",
    "latitude": "string",
    "longitude": "string",
    "altitude": "string"
  },
  "attachedModes": [
    {
      "id": "string",
      "name": "string",
      "code": {
        "symbol" : "string",
        "fgColor": "string",
        "bgColor" : "string"
      }
      "modeName": "string",
      "modeSubnode": "string",
      "platformType": "Air Platform | Sea Platform | Ground Platform",
      "threat": "Hostile | Friendly | Neutral",
      "freqType": "string",
      "priType": "string",
      "staggerLevel": "number",
      "pwType": "string",
      "scanType": "string",
      "minScanSector": "string | number",
      "maxScanSector": "string | number",
      "jammingData": {
        "frequency": [
          {
            "min": "number",
            "max": "number",
            "deviation": "number"
          }
        ],
        "pri": [
          {
            "min": "number",
            "max": "number",
            "deviation": "number",
            "staggerLevel": "number"
          }
        ],
        "pulseWidth": [
          {
            "min": "number",
            "max": "number",
            "deviation": "number"
          }
        ]
      }
    }
  ]
}
```

## 4. Mode Management APIs

### 4.1 Get All Modes

**Endpoint:** `GET /api/modes`  
**Description:** Retrieves all available modes with their metadata.

**Response Schema:**

```json
{
  "modes": [
    {
      "mode": "string",
      "createdBy": "string",
      "createdDate": "string (DD/MMM/YYYY HH:mm)",
      "modifiedBy": "string",
      "modifiedDate": "string (DD/MMM/YYYY HH:mm)",
      "description": "string"
    }
  ]
}
```

### 4.2 Get Mode Details

**Endpoint:** `GET /api/modes/{modeId}`  
**Description:** Retrieves detailed configuration for a specific mode including EW parameters and scan specifications.

**Response Schema:**

```json
{
  "id": "string",
  "code": {
    "symbol" : "string",
    "fgColor": "string",
    "bgColor" : "string"
  },
  "lastEdited": "string (DD MMM'YY HH:mm)",
  "description": "string",
  "details": {
    "type": "Search | Track | Other",
    "subModeType": "string",
    "platformType": "Sea Platform | Air Platform | Ground Platform",
    "threatType": "Friendly | Hostile | Neutral",
    "freqType": "string",
    "priType": "string",
    "staggerLevel": "number",
    "pwType": "string",
    "dispRangeEst": "string",
    "lethalRange": "number"
  },
  "ewParameters": {
    "frequency": [
      {
        "min": "number",
        "max": "number",
        "deviation": "number"
      }
    ],
    "pri": [
      {
        "min": "number",
        "max": "number",
        "deviation": "number",
        "staggerLevel": "number"
      }
    ],
    "pulseWidth": [
      {
        "min": "number",
        "max": "number",
        "deviation": "number"
      }
    ]
  },
  "scanType": {
    "scanType": "string",
    "minScanSector": "number",
    "maxScanSector": "number",
    "minScanRate": "number",
    "maxScanRate": "number",
    "sideLobeLevel": "number",
    "sideLobeStd": "number",
    "minTot": "number",
    "maxTot": "number",
    "minBeamWidth": "number",
    "maxBeamWidth": "number"
  }
}
```

**Example Response:**

```json
{
  "id": "Mode_001",
  "code": {
    "symbol" : "MY01",
    "fgColor": "#CC299A",
    "bgColor" : "#F7B500"
  }
  }
  "lastEdited": "15 Jan'25 16:45",
  "description": "Primary search mode for surveillance operations",
  "details": {
    "type": "Search",
    "subModeType": "Long Range",
    "platformType": "Air Platform",
    "threatType": "Hostile",
    "freqType": "X-Band",
    "priType": "Staggered",
    "staggerLevel": 3,
    "pwType": "Variable",
    "dispRangeEst": "150 km",
    "lethalRange": 120
  },
  "ewParameters": {
    "frequency": [
      {
        "min": 8500,
        "max": 10500,
        "deviation": 50
      }
    ],
    "pri": [
      {
        "min": 1000,
        "max": 1500,
        "deviation": 25,
        "staggerLevel": 3
      }
    ],
    "pulseWidth": [
      {
        "min": 2.5,
        "max": 4.0,
        "deviation": 0.1
      }
    ]
  },
  "scanType": {
    "scanType": "Circular",
    "minScanSector": 0,
    "maxScanSector": 360,
    "minScanRate": 6,
    "maxScanRate": 12,
    "sideLobeLevel": -20,
    "sideLobeStd": 2,
    "minTot": 0.1,
    "maxTot": 0.3,
    "minBeamWidth": 2.5,
    "maxBeamWidth": 3.5
  }
}
```

---

## 5. Jamming Records API

### 5.1 Get Jamming Records

**Endpoint:** `GET /api/{emitterId}/{modeId}/jamming`

**Response Schema:**

```json
{
  "lastGenerated": "string (DD MMM'YY HH:mm)",
  "techniques": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "sequences": [
    {
      "id": "string",
      "segments": [
        {
          "id": "string",
          "techniqueId": "string",
          "cycleType": "Tech Cycle | Absolute Time",
          "probability": "number (percentage)",
          "cycleCount": "number",
          "chart": {
            "x": ["number"],
            "y": ["number"]
          }
        }
      ]
    }
  ]
}
```

**Example Response:**

```json
{
  "lastGenerated": "15 Jan'25 14:30",
  "techniques": [
    {
      "id": "tech_001",
      "name": "Noise Jamming"
    },
    {
      "id": "tech_002",
      "name": "Deception Jamming"
    }
  ],
  "sequences": [
    {
      "id": "seq_001",
      "segments": [
        {
          "id": "seg_001",
          "techniqueId": "tech_001",
          "cycleType": "Tech Cycle",
          "probability": 75.5,
          "cycleCount": 10,
          "chart": {
            "x": [0, 1, 2, 3, 4, 5],
            "y": [0, 10, 20, 15, 25, 30]
          }
        },
        {
          "id": "seg_002",
          "techniqueId": "tech_002",
          "cycleType": "Absolute Time",
          "probability": 24.5,
          "cycleCount": 5,
          "chart": {
            "x": [0, 2, 4, 6, 8],
            "y": [0, 5, 15, 10, 20]
          }
        }
      ]
    }
  ]
}
```

---

## 6. Emitters-Modes Tree API (For sidebar)

### 6.1 Get Emitters-Modes Tree

**Endpoint:** `GET /api/emitters-modes-tree`  
**Description:** Retrieves the complete hierarchical tree structure of emitters and their associated modes.

**Response Schema:**

```json
{
  "emitters": [
    {
      "id": "string",
      "name": "string",
      "children": [
        {
          "id": "string",
          "name": "string",
          "children": [
            {
              "id": "string",
              "name": "string"
            }
          ]
        }
      ]
    }
  ]
}
```

**Example Response:**

```json
{
  "emitters": [
    {
      "id": "Emitter_1001",
      "name": "Emitter_1001",
      "children": [
        {
          "id": "Emitter_1001-Mode_1",
          "name": "Mode_1",
          "children": [
            {
              "id": "Emitter_1001-Mode_1-Jamming",
              "name": "Jamming"
            }
          ]
        },
        {
          "id": "Emitter_1001-Mode_2",
          "name": "Mode_2",
          "children": [
            {
              "id": "Emitter_1001-Mode_2-Jamming",
              "name": "Jamming"
            }
          ]
        }
      ]
    },
    {
      "id": "Emitter_1002",
      "name": "Emitter_1002",
      "children": [
        {
          "id": "Emitter_1002-Mode_1",
          "name": "Mode_1",
          "children": [
            {
              "id": "Emitter_1002-Mode_1-Jamming",
              "name": "Jamming"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 7. Modes Tree API (For sidebar)

### 7.1 Get Modes Tree

**Endpoint:** `GET /api/modes-tree`  
**Description:** Retrieves the hierarchical tree structure of modes and their associated jamming configurations.

**Response Schema:**

```json
{
  "modes": [
    {
      "id": "string",
      "name": "string",
      "children": [
        {
          "id": "string",
          "name": "string"
        }
      ]
    }
  ]
}
```

**Example Response:**

```json
{
  "modes": [
    {
      "id": "Emitter_1001-Mode_1",
      "name": "Mode_1",
      "children": [
        {
          "id": "Emitter_1001-Mode_1-Jamming",
          "name": "Jamming"
        }
      ]
    },
    {
      "id": "Emitter_1001-Mode_2",
      "name": "Mode_2",
      "children": [
        {
          "id": "Emitter_1001-Mode_2-Jamming",
          "name": "Jamming"
        }
      ]
    },
    {
      "id": "Emitter_1002-Mode_1",
      "name": "Mode_1",
      "children": [
        {
          "id": "Emitter_1002-Mode_1-Jamming",
          "name": "Jamming"
        }
      ]
    }
  ]
}
```
