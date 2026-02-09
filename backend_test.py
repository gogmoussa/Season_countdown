import requests
import json
import sys
from datetime import datetime

class SeasonTrackerAPITester:
    def __init__(self, base_url="https://05de4df1-35d6-4d26-8ddd-2a815a12c6b8.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    self.results.append({
                        "test": name,
                        "status": "PASSED",
                        "response": response_data
                    })
                    return True, response_data
                except:
                    print(f"   Response (text): {response.text}")
                    self.results.append({
                        "test": name,
                        "status": "PASSED",
                        "response": response.text
                    })
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                self.results.append({
                    "test": name,
                    "status": "FAILED",
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                "test": name,
                "status": "ERROR",
                "error": str(e)
            })
            return False, {}

    def test_health(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_season_north(self):
        """Test season endpoint for northern hemisphere"""
        return self.run_test("Season North", "GET", "api/season", 200, params={"hemisphere": "north"})

    def test_season_south(self):
        """Test season endpoint for southern hemisphere"""
        return self.run_test("Season South", "GET", "api/season", 200, params={"hemisphere": "south"})

    def test_all_seasons_north(self):
        """Test all seasons endpoint for northern hemisphere"""
        return self.run_test("All Seasons North", "GET", "api/seasons/all", 200, params={"hemisphere": "north"})

    def test_all_seasons_south(self):
        """Test all seasons endpoint for southern hemisphere"""
        return self.run_test("All Seasons South", "GET", "api/seasons/all", 200, params={"hemisphere": "south"})

    def test_affirmation(self):
        """Test affirmation endpoint"""
        return self.run_test("Winter Affirmation", "GET", "api/affirmation", 200, params={"season": "winter"})

    def test_save_notification_pref(self):
        """Test saving notification preferences"""
        test_device_id = f"test_device_{datetime.now().strftime('%H%M%S')}"
        data = {
            "device_id": test_device_id,
            "enabled": True,
            "frequency": "daily"
        }
        return self.run_test("Save Notification Preferences", "POST", "api/notifications/preferences", 200, data=data)

    def test_get_notification_pref(self):
        """Test getting notification preferences"""
        test_device_id = f"test_device_{datetime.now().strftime('%H%M%S')}"
        # First save a preference
        save_data = {
            "device_id": test_device_id,
            "enabled": True,
            "frequency": "daily"
        }
        save_success, _ = self.run_test("Save Pref for Get Test", "POST", "api/notifications/preferences", 200, data=save_data)
        
        if save_success:
            return self.run_test("Get Notification Preferences", "GET", f"api/notifications/preferences/{test_device_id}", 200)
        return False, {}

def main():
    print("🚀 Starting Season Tracker API Tests")
    print("=" * 50)
    
    tester = SeasonTrackerAPITester()
    
    # Run all tests
    tester.test_health()
    tester.test_season_north() 
    tester.test_season_south()
    tester.test_all_seasons()
    tester.test_affirmation()
    tester.test_save_notification_pref()
    tester.test_get_notification_pref()

    # Print results summary
    print(f"\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    print(f"🎯 Success Rate: {round((tester.tests_passed / tester.tests_run) * 100, 1)}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())