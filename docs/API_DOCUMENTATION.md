# 📡 API Documentation - FuelSmart CR

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)",
  "email": "string (optional)",
  "fullName": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### Login
Authenticate and create a session.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string"
  }
}
```

**Note:** Sets session cookie automatically

---

### Logout
End current session.

**Endpoint:** `POST /auth/logout`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

### Get Current User
Get authenticated user information.

**Endpoint:** `GET /auth/me`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string"
  }
}
```

---

## 🚗 Vehicles

### Get All Vehicles
Get all vehicles for the authenticated user.

**Endpoint:** `GET /vehicles`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "vehicles": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "string",
      "plate": "string",
      "type": "gasoline|diesel|electric|hybrid|plugin_hybrid",
      "brand": "string",
      "model": "string",
      "year": number,
      "tankCapacity": "decimal",
      "averageEfficiency": "decimal",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### Get Single Vehicle
Get a specific vehicle by ID.

**Endpoint:** `GET /vehicles/:id`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "vehicle": {
    "id": "uuid",
    "userId": "uuid",
    "name": "string",
    "plate": "string",
    "type": "string",
    "brand": "string",
    "model": "string",
    "year": number,
    "tankCapacity": "decimal",
    "averageEfficiency": "decimal"
  }
}
```

---

### Create Vehicle
Add a new vehicle.

**Endpoint:** `POST /vehicles`

**Auth:** Required

**Body:**
```json
{
  "name": "string (required)",
  "plate": "string (required)",
  "type": "gasoline|diesel|electric|hybrid|plugin_hybrid (required)",
  "brand": "string (optional)",
  "model": "string (optional)",
  "year": number (optional),
  "tankCapacity": "decimal (optional)",
  "averageEfficiency": "decimal (optional)"
}
```

**Response:** `201 Created`

---

### Update Vehicle
Update vehicle information.

**Endpoint:** `PUT /vehicles/:id`

**Auth:** Required

**Body:** Partial vehicle object

**Response:** `200 OK`

---

### Delete Vehicle
Remove a vehicle.

**Endpoint:** `DELETE /vehicles/:id`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "message": "Vehículo eliminado exitosamente"
}
```

---

## ⛽ Fuel Records

### Get All Fuel Records
Get all fuel records for the authenticated user.

**Endpoint:** `GET /fuel-records`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "records": [
    {
      "id": "uuid",
      "userId": "uuid",
      "vehicleId": "uuid",
      "date": "timestamp",
      "liters": "decimal",
      "pricePerLiter": "decimal",
      "totalCost": "decimal",
      "odometer": number,
      "stationName": "string",
      "stationLocation": "string",
      "notes": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### Get Fuel Records by Vehicle
Get all fuel records for a specific vehicle.

**Endpoint:** `GET /fuel-records/vehicle/:vehicleId`

**Auth:** Required

**Response:** `200 OK`

---

### Get Single Fuel Record
Get a specific fuel record.

**Endpoint:** `GET /fuel-records/:id`

**Auth:** Required

**Response:** `200 OK`

---

### Create Fuel Record
Add a new fuel record.

**Endpoint:** `POST /fuel-records`

**Auth:** Required

**Body:**
```json
{
  "vehicleId": "uuid (required)",
  "date": "ISO 8601 timestamp (optional, defaults to now)",
  "liters": "decimal (required)",
  "pricePerLiter": "decimal (required)",
  "totalCost": "decimal (required)",
  "odometer": number (optional),
  "stationName": "string (optional)",
  "stationLocation": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:** `201 Created`

**Note:** Awards 10 points to user's gamification

---

### Update Fuel Record
Update a fuel record.

**Endpoint:** `PUT /fuel-records/:id`

**Auth:** Required

**Body:** Partial fuel record object

**Response:** `200 OK`

---

### Delete Fuel Record
Remove a fuel record.

**Endpoint:** `DELETE /fuel-records/:id`

**Auth:** Required

**Response:** `200 OK`

---

## 🎮 Gamification

### Get Gamification Data
Get gamification stats for the authenticated user.

**Endpoint:** `GET /gamification`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "gamification": {
    "id": "uuid",
    "userId": "uuid",
    "totalPoints": number,
    "level": number,
    "currentStreak": number,
    "longestStreak": number,
    "lastActivityDate": "timestamp",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### Update Points
Add or subtract points from user's total.

**Endpoint:** `PUT /gamification/points`

**Auth:** Required

**Body:**
```json
{
  "points": number (can be positive or negative)
}
```

**Response:** `200 OK`

**Note:** Automatically calculates new level (level = floor(totalPoints / 200) + 1)

---

## 🔔 Alerts

### Get All Alerts
Get all alerts for the authenticated user.

**Endpoint:** `GET /alerts`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "alerts": [
    {
      "id": "uuid",
      "userId": "uuid",
      "vehicleId": "uuid",
      "type": "anomaly|maintenance|price|tip|prediction",
      "priority": "low|medium|high|critical",
      "title": "string",
      "message": "string",
      "isRead": boolean,
      "createdAt": "timestamp"
    }
  ]
}
```

---

### Get Unread Alerts
Get only unread alerts.

**Endpoint:** `GET /alerts/unread`

**Auth:** Required

**Response:** `200 OK`

---

### Create Alert
Create a new alert.

**Endpoint:** `POST /alerts`

**Auth:** Required

**Body:**
```json
{
  "vehicleId": "uuid (optional)",
  "type": "anomaly|maintenance|price|tip|prediction (required)",
  "priority": "low|medium|high|critical (optional, defaults to medium)",
  "title": "string (required)",
  "message": "string (required)"
}
```

**Response:** `201 Created`

---

### Mark Alert as Read
Mark an alert as read.

**Endpoint:** `PUT /alerts/:id/read`

**Auth:** Required

**Response:** `200 OK`

---

### Delete Alert
Remove an alert.

**Endpoint:** `DELETE /alerts/:id`

**Auth:** Required

**Response:** `200 OK`

---

## ⛽ Gas Stations

### Get All Gas Stations
Get all gas stations (public endpoint).

**Endpoint:** `GET /gas-stations`

**Auth:** Not required

**Response:** `200 OK`
```json
{
  "stations": [
    {
      "id": "uuid",
      "name": "string",
      "address": "string",
      "latitude": "decimal",
      "longitude": "decimal",
      "currentPrice": "decimal",
      "rating": "decimal",
      "amenities": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### Get Single Gas Station
Get a specific gas station.

**Endpoint:** `GET /gas-stations/:id`

**Auth:** Not required

**Response:** `200 OK`

---

## 🔧 Maintenance

### Get Maintenance Records by Vehicle
Get all maintenance records for a vehicle.

**Endpoint:** `GET /maintenance/vehicle/:vehicleId`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "records": [
    {
      "id": "uuid",
      "userId": "uuid",
      "vehicleId": "uuid",
      "type": "oil_change|tire_rotation|brake_service|battery|general_inspection|other",
      "description": "string",
      "cost": "decimal",
      "odometer": number,
      "serviceDate": "timestamp",
      "nextServiceOdometer": number,
      "nextServiceDate": "timestamp",
      "servicedBy": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### Get Single Maintenance Record
Get a specific maintenance record.

**Endpoint:** `GET /maintenance/:id`

**Auth:** Required

**Response:** `200 OK`

---

### Create Maintenance Record
Add a new maintenance record.

**Endpoint:** `POST /maintenance`

**Auth:** Required

**Body:**
```json
{
  "vehicleId": "uuid (required)",
  "type": "oil_change|tire_rotation|brake_service|battery|general_inspection|other (required)",
  "description": "string (optional)",
  "cost": "decimal (optional)",
  "odometer": number (optional)",
  "serviceDate": "ISO 8601 timestamp (optional, defaults to now)",
  "nextServiceOdometer": number (optional)",
  "nextServiceDate": "ISO 8601 timestamp (optional)",
  "servicedBy": "string (optional)"
}
```

**Response:** `201 Created`

---

### Update Maintenance Record
Update a maintenance record.

**Endpoint:** `PUT /maintenance/:id`

**Auth:** Required

**Body:** Partial maintenance record object

**Response:** `200 OK`

---

### Delete Maintenance Record
Remove a maintenance record.

**Endpoint:** `DELETE /maintenance/:id`

**Auth:** Required

**Response:** `200 OK`

---

## 🎁 Rewards

### Get All Active Rewards
Get all available rewards (public endpoint).

**Endpoint:** `GET /rewards`

**Auth:** Not required

**Response:** `200 OK`
```json
{
  "rewards": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "pointsCost": number,
      "category": "string",
      "imageUrl": "string",
      "isActive": boolean,
      "createdAt": "timestamp"
    }
  ]
}
```

---

### Get User's Redeemed Rewards
Get all rewards redeemed by the authenticated user.

**Endpoint:** `GET /user-rewards`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "rewards": [
    {
      "id": "uuid",
      "userId": "uuid",
      "rewardId": "uuid",
      "redeemedAt": "timestamp",
      "usedAt": "timestamp",
      "isUsed": boolean
    }
  ]
}
```

---

### Redeem Reward
Redeem a reward with points.

**Endpoint:** `POST /rewards/redeem`

**Auth:** Required

**Body:**
```json
{
  "rewardId": "uuid"
}
```

**Response:** `201 Created`

**Note:** Automatically deducts points from user's gamification

---

### Mark Reward as Used
Mark a redeemed reward as used.

**Endpoint:** `PUT /user-rewards/:id/use`

**Auth:** Required

**Response:** `200 OK`

---

## 🚛 Fleets

### Get All Fleets
Get all fleets owned by the authenticated user.

**Endpoint:** `GET /fleets`

**Auth:** Required

**Response:** `200 OK`
```json
{
  "fleets": [
    {
      "id": "uuid",
      "ownerId": "uuid",
      "name": "string",
      "description": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### Get Single Fleet
Get a specific fleet.

**Endpoint:** `GET /fleets/:id`

**Auth:** Required

**Response:** `200 OK`

---

### Create Fleet
Create a new fleet.

**Endpoint:** `POST /fleets`

**Auth:** Required

**Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Response:** `201 Created`

---

### Update Fleet
Update fleet information.

**Endpoint:** `PUT /fleets/:id`

**Auth:** Required

**Body:** Partial fleet object

**Response:** `200 OK`

---

### Delete Fleet
Remove a fleet.

**Endpoint:** `DELETE /fleets/:id`

**Auth:** Required

**Response:** `200 OK`

---

## 🔒 Authorization

All endpoints marked with **Auth: Required** need a valid session cookie. 

The session is created automatically when logging in and is valid for 24 hours.

### Error Responses

**401 Unauthorized**
```json
{
  "message": "No autenticado"
}
```

**403 Forbidden**
```json
{
  "message": "No autorizado"
}
```

**404 Not Found**
```json
{
  "message": "Recurso no encontrado"
}
```

**400 Bad Request**
```json
{
  "message": "Datos inválidos",
  "errors": [...]
}
```

**500 Internal Server Error**
```json
{
  "message": "Error del servidor"
}
```

---

## 📊 Testing

Run the API test suite:

```bash
npm run api:test
```

This will test all endpoints and verify:
- User registration and authentication
- CRUD operations for all resources
- Authorization checks
- Data validation

---

## 🔧 Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`

---

**Version:** 2.0
**Last Updated:** December 4, 2025
**Status:** ✅ All endpoints implemented and tested
