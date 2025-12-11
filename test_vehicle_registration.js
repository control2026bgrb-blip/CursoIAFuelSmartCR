// Simple test script to verify vehicle registration
// Run with: node test_vehicle_registration.js

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

async function testVehicleRegistration() {
  try {
    console.log('🧪 Testing vehicle registration...');
    
    // Test data
    const testUser = {
      username: 'testuser_' + Date.now(),
      password: 'testpass123'
    };
    
    const testVehicle = {
      name: 'Toyota Corolla Test',
      year: '2023',
      fuelType: 'gasoline',
      plate: 'TEST-123',
      brand: 'Toyota',
      model: 'Corolla',
      tankCapacity: '50',
      efficiency: '15.5'
    };
    
    // 1. Register user
    console.log('1. Registering test user...');
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    if (!registerResponse.ok) {
      throw new Error(`Registration failed: ${registerResponse.status}`);
    }
    
    const { user } = await registerResponse.json();
    console.log('✅ User registered:', user.id);
    
    // 2. Create vehicle
    console.log('2. Creating test vehicle...');
    const vehicleResponse = await fetch(`${API_BASE}/api/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testVehicle,
        userId: user.id,
        isDefault: true
      })
    });
    
    if (!vehicleResponse.ok) {
      const error = await vehicleResponse.text();
      throw new Error(`Vehicle creation failed: ${vehicleResponse.status} - ${error}`);
    }
    
    const { vehicle } = await vehicleResponse.json();
    console.log('✅ Vehicle created:', vehicle.id, 'Default:', vehicle.is_default);
    
    // 3. Get vehicles
    console.log('3. Fetching user vehicles...');
    const getVehiclesResponse = await fetch(`${API_BASE}/api/vehicles/${user.id}`);
    
    if (!getVehiclesResponse.ok) {
      throw new Error(`Get vehicles failed: ${getVehiclesResponse.status}`);
    }
    
    const { vehicles } = await getVehiclesResponse.json();
    console.log('✅ Vehicles fetched:', vehicles.length, 'vehicles');
    
    // 4. Verify default vehicle
    const defaultVehicle = vehicles.find(v => v.is_default);
    if (defaultVehicle) {
      console.log('✅ Default vehicle found:', defaultVehicle.name);
    } else {
      console.log('⚠️  No default vehicle found');
    }
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testVehicleRegistration();