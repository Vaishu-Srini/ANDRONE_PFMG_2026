{
  "missionId": 0,
  "missionName": "Mission1",
  "missionDate": "2025-10-13T10:33:51.700Z",
  "missionType": "SINGLE",
  "description": "string",
  "userId": 1,
  "status": "DRAFT"
}



{
  "emitterId": 0,
  "emitterName": "AlphaEmitter",
  "description": "Ground-based radar emitter for testing.",
  "emitterType": "GROUND",
  "symbol": "NEW",
  "foregroundColor": "#FF5733",
  "backgroundColor": "#C0C0C0",
  "isUnknown": false,
  "isGroundOnly": true,
  "dateCreated": "2025-10-13T10:31:36.583Z",
  "lastModified": "2025-10-13T10:31:36.583Z",
  "latitude": "13.0827",
  "longitude": "80.2707",
  "platformId": 1
}



{
  "platformId": 0,
  "platformName": "Test Platform Alpha",
  "threatType": "S",
  "priority": 5,
  "displayStatus": true,
  "symbolCodeType": "NEW",
  "alternateSymbol": "ALT-001",
  "foreGroundColor": "#FF0000",
  "backGroundColor": "#000000",
  "description": "This is a sample platform created for testing purposes.",
  "thumbnailImage": "U29tZUF1ZGlvRGF0YQ==",
  "previewSymbol": "U29tZUF1ZGlvRGF0YQ==",
  "createdAt": "2025-09-11T05:05:38.520Z",
  "userId": 101,
  "missionId": 1
}



{
    "modeId": 0,
    "modeName": "Track_Modqwdasdasdsw",
    "description": "Mode used for high priority tracking",
    "audioId": "U29tZUF1ZGlvRGF0YQ==",
    "modeType": "TRACK",
    "platformType": "UNKNOWN",
    "subMode": "STT",
    "threatType": "MOST_DANGEROUS",
    "testType": "POWER_VARAIATION",
    "priManualFlag": true,
    "priSwitchEpgFlag": false,
    "PriStaggerLevel": "1:2",
    "freqIsSwitch": true,
    "freqCount": 5,
    "priCount": 3,
    "pwCount": 2,
    "symbolCodeType": 1,
    "alternateSymbol": "ALT123",
    "bgColor": "#000000",
    "fgColor": "#FFFFFF",
    "eirpValue": 50,
    "lethalRange": 120,
    "groundOnly": false,
    "displayPriority": true,
    "isAntennaScan": true,
    "angleSwitch": 30,
    "createdBy": "pavan",
    "dateCreated": "2025-09-04T06:14:29.153Z",
    "lastModified": "2025-09-04T06:14:29.153Z",
    "powerLevelDb": -20,
    "pvTimeBaseMsec": 100,
    "pvOfMinSample": 10,
    "pvMeasurementTime": 200,
    "mlPercentage": 85,
    "mlTimeBase": 50,
    "mlMinSamples": 5,
    "mlMeasurementTime": 300,
    "frequencyAttribute": "WIDE_BAND",
    "priAttribute": "HIGH_JITTER",
    "maxPowerThreshouldDb": -10,
    "lssName": "LSS_Test",
    "comment": "Used in simulation testing",
    "emitterId": 16,
    "rangeEstimation": "string",
    "modeDfs": [
        {
            "id": 0,
            "minTestRange": 100,
            "maxTestRange": 200
        }
    ],
    "modeFrequencyDetails": [
        {
            "id": 0,
            "frequencyType": "HOPBTP1",
            "frequencyClass": "RANGE",
            "minFrequency": 2.4,
            "maxFrequency": 2.5,
            "deviation": 1
        }
    ],
    "modeFrequencyRanges": [
        {
            "id": 0,
            "minTestRange1": 2200,
            "maxTestRange1": 2500
        }
    ],
    "modeLssDetails": [
        {
            "id": 0,
            "distanceKm": 15,
            "minPowerDbm": -95,
            "maxPowerDbm": -35
        }
    ],
    "modePriDetails": [
        {
            "id": 0,
            "priType": "STABLE",
            "priClass": "RANGE",
            "minPri": 1000,
            "maxPri": 50000,
            "deviation": 50,
            "jitterMean": 20,
            "jitterPercentage": 5
        }
    ],
    "modePriPwRanges": [
        {
            "id": 0,
            "minTestRange1": 10,
            "maxTestRange1": 20,
            "minTestRange2": 30,
            "maxTestRange2": 40
        }
    ],
    "modePriRanges": [
        {
            "id": 0,
            "minTestRange": 200,
            "maxTestRange": 800
        }
    ],
    "modePriStaggerLevels": [
        {
            "id": 0,
            "minTestRange": 5,
            "maxTestRange": 15
        }
    ],
    "modePwDetails": [
        {
            "id": 0,
            "pwType": "FIXED",
            "pwClass": "RANGE",
            "minPw": 50,
            "maxPw": 200,
            "deviation": 5
        }
    ],
    "modeScanDetails": [
        {
            "id": 0,
            "scanType": "CIRCULAR",
            "minScanSector": 10,
            "maxScanSector": 180,
            "minScanRate": 5,
            "maxScanRate": 20,
            "nominalScanRate": 12,
            "sideLobeLevel": -25,
            "sideLobeStd": 2,
            "minBeamWidth": 3,
            "maxBeamWidth": 10,
            "calculatedTot": 120,
            "minTot": 80,
            "maxTot": 150
        }
    ]
}


{
  "jammingId": 0,
  "techniqueName": "Range Gate Pull-Off",
  "techniqueType": "RGPO_I",
  "pullInOut": true,
  "minRange": 500,
  "maxRange": 1500,
  "rateOfChangeOfRange": 50,
  "minVelocity": 200,
  "maxVelocity": 600,
  "rateOfChangeOfVelocity": 25,
  "walkTime": "00:00:05",
  "holdTime": "00:00:10",
  "stopTime": "00:00:15",
  "modeId": 1
}






## Features
- CRUD operations for Platform, Emitter, Mode, and Jamming
- Entity Framework Core for database interaction
- Authentication & Authorization using JWT
- Logging with Serilog
- RESTful APIs with ASP.NET Core Web API



## Folder Structure
ANADRONE/
├── Controllers/       # API Controllers
├── Models/            # Entity models
├── DTOs/              # Data Transfer Objects
├── Services/          # Business logic
├── Repositories/      # Data access
├── Utilities/         # Helper classes (e.g., JwtService, Logger, ApiResponse)
├── Properties/
├── Program.cs
├── appsettings.json
└── README.md

dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

dotnet add package IdentityModel
dotnet add package Microsoft.IdentityModel.Tokens
dotnet add package System.IdentityModel.Tokens.Jwt

dotnet ef migrations add InitialCreate