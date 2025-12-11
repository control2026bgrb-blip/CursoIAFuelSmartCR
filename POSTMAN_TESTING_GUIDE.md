# Postman API Testing Guide

This guide explains how to use the Postman collections for testing the Energy Management API.

## Files Included

1. **postman_collection.json** - Main API collection with all endpoints
2. **postman_load_tests.json** - Load testing collection for performance testing
3. **postman_environment.json** - Environment variables for both collections
4. **POSTMAN_TESTING_GUIDE.md** - This guide

## Setup Instructions

### 1. Import Collections and Environment

1. Open Postman
2. Click "Import" button
3. Import all three JSON files:
   - `postman_collection.json`
   - `postman_load_tests.json`
   - `postman_environment.json`

### 2. Set Environment

1. In Postman, select "Energy Management Environment" from the environment dropdown
2. Update the `baseUrl` variable if your API is running on a different port/host
   - Default: `http://localhost:3000`
   - For production: Update to your production URL

## Main API Collection Usage

### Authentication Flow
1. **Register User** - Creates a new user account
   - Automatically stores `userId` and `username` in environment variables
2. **Login User** - Authenticates existing user
   - Uses stored `username` from registration

### Testing Workflow
Run requests in this order for a complete test:

1. **Authentication**
   - Register User
   - Login User

2. **User Management**
   - Get All Users
   - Get User Settings
   - Update User Settings

3. **Vehicle Management**
   - Create Vehicle (stores `vehicleId`)
   - Get User Vehicles
   - Update Vehicle
   - Delete Vehicle (optional)

4. **Fuel Records**
   - Create Fuel Record (stores `fuelRecordId`)
   - Get User Fuel Records
   - Update Fuel Record
   - Delete Fuel Record (optional)

5. **System Tests**
   - Health Check
   - API Test
   - Database Structure Check
   - Test Vehicle Schema
   - Migration Check

### Running All Tests
- Use Postman's "Collection Runner" to run all requests automatically
- Tests will validate responses and track performance

## Load Testing Collection Usage

### Performance Testing
The load testing collection is designed to stress test your API:

1. **Individual Load Tests**
   - Each request has performance benchmarks
   - Response time limits are set for each endpoint
   - Generates random test data

2. **Running Load Tests**
   - Use Collection Runner with high iteration counts (50-1000)
   - Set delay between requests (0-100ms)
   - Monitor response times and error rates

### Load Test Scenarios

#### Scenario 1: Basic Load Test
- Iterations: 50
- Delay: 100ms
- Tests basic functionality under moderate load

#### Scenario 2: Stress Test
- Iterations: 200
- Delay: 50ms
- Tests API limits and error handling

#### Scenario 3: Spike Test
- Iterations: 500
- Delay: 0ms
- Tests maximum throughput and concurrent handling

### Performance Benchmarks

Expected response times (under normal load):
- Health Check: < 500ms
- Authentication: < 1500ms
- CRUD Operations: < 2000ms
- Data Retrieval: < 1000ms

## Environment Variables

The environment automatically manages these variables:

### Static Variables
- `baseUrl` - API base URL
- `userId` - Current user ID
- `username` - Current username
- `vehicleId` - Current vehicle ID
- `fuelRecordId` - Current fuel record ID

### Dynamic Variables (Load Testing)
- `loadTestUsername` - Generated unique usernames
- `randomBrand`, `randomModel`, etc. - Random test data
- `totalResponseTime`, `requestCount` - Performance tracking

## Test Validation

### Automated Tests Include:
- Status code validation
- Response structure validation
- Performance benchmarks
- Data integrity checks
- Error handling validation

### Manual Validation:
- Check database for created records
- Verify data relationships
- Test edge cases with invalid data
- Monitor server logs for errors

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Ensure API server is running
   - Check `baseUrl` in environment

2. **Database Errors**
   - Verify Supabase configuration
   - Check environment variables in server

3. **Test Failures**
   - Review test scripts in each request
   - Check console output for detailed errors

4. **Performance Issues**
   - Reduce iteration count for load tests
   - Increase delay between requests
   - Monitor server resources

### Debug Tips:
- Enable Postman Console for detailed logs
- Use "Tests" tab to add custom validation
- Check "Pre-request Script" for data generation logic
- Monitor network tab for request/response details

## Advanced Usage

### Custom Test Scripts
You can modify test scripts to:
- Add custom validation logic
- Implement complex test scenarios
- Generate specific test data patterns
- Create custom performance metrics

### CI/CD Integration
Use Newman (Postman CLI) to run tests in CI/CD:

```bash
# Install Newman
npm install -g newman

# Run main collection
newman run postman_collection.json -e postman_environment.json

# Run load tests
newman run postman_load_tests.json -e postman_environment.json -n 100
```

### Monitoring and Reporting
- Use Postman monitors for continuous testing
- Export test results for analysis
- Set up alerts for performance degradation
- Generate HTML reports with Newman

## API Endpoints Covered

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### Users
- GET `/api/users`
- GET `/api/user/:userId/settings`
- PUT `/api/user/:userId/settings`

### Vehicles
- GET `/api/vehicles/:userId`
- POST `/api/vehicles`
- PUT `/api/vehicles/:id`
- DELETE `/api/vehicles/:id`

### Fuel Records
- GET `/api/fuel-records/:userId`
- POST `/api/fuel-records`
- PUT `/api/fuel-records/:id`
- DELETE `/api/fuel-records/:id`

### System
- GET `/api/health`
- GET `/api/test`
- GET `/api/db-structure`
- GET `/api/test-vehicle-schema`
- GET `/api/migrate`

## Support

For issues with the API or these collections:
1. Check server logs for errors
2. Verify database connectivity
3. Review Postman console output
4. Test individual endpoints manually
5. Check environment variable values

Happy Testing! 🚀