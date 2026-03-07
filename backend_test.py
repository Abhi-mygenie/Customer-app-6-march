#!/usr/bin/env python3
"""
Backend API Testing for Edit Order Feature
Tests the GET /api/air-bnb/get-order-details/{orderId} endpoint
"""

import requests
import sys
import os
from datetime import datetime

class EditOrderAPITester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            
            result = {
                'test_name': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': response.status_code,
                'success': success,
                'response_data': None,
                'error': None
            }

            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    result['response_data'] = response.json()
                    print(f"   Response keys: {list(result['response_data'].keys()) if isinstance(result['response_data'], dict) else 'Not a dict'}")
                except:
                    result['response_data'] = response.text[:200]
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    result['error'] = error_data
                    print(f"   Error: {error_data}")
                except:
                    result['error'] = response.text[:200]
                    print(f"   Error text: {response.text[:200]}")

            self.test_results.append(result)
            return success, result['response_data']

        except requests.exceptions.Timeout:
            print(f"❌ FAILED - Request timed out")
            result = {
                'test_name': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': 'TIMEOUT',
                'success': False,
                'response_data': None,
                'error': 'Request timed out'
            }
            self.test_results.append(result)
            return False, {}
        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            result = {
                'test_name': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': 'ERROR',
                'success': False,
                'response_data': None,
                'error': str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_get_order_details(self, order_id):
        """Test GET /api/air-bnb/get-order-details/{orderId} endpoint"""
        success, response = self.run_test(
            f"Get Order Details - Order #{order_id}",
            "GET",
            f"api/air-bnb/get-order-details/{order_id}",
            200
        )
        
        if success and response:
            # Validate response structure
            required_fields = ['details', 'table_id', 'restaurant']
            missing_fields = [field for field in required_fields if field not in response]
            
            if not missing_fields:
                print(f"   ✅ Response structure valid")
                
                # Check if details array has items
                details = response.get('details', [])
                if details:
                    print(f"   ✅ Found {len(details)} order items")
                    
                    # Validate first item structure
                    first_item = details[0]
                    item_fields = ['id', 'food_id', 'quantity', 'unit_price', 'food_details']
                    missing_item_fields = [field for field in item_fields if field not in first_item]
                    
                    if not missing_item_fields:
                        print(f"   ✅ Order item structure valid")
                    else:
                        print(f"   ⚠️  Missing item fields: {missing_item_fields}")
                else:
                    print(f"   ⚠️  No order details found")
            else:
                print(f"   ⚠️  Missing response fields: {missing_fields}")
        
        return success

    def test_invalid_order_id(self):
        """Test with invalid order ID"""
        success, response = self.run_test(
            "Get Order Details - Invalid Order ID",
            "GET",
            "api/air-bnb/get-order-details/999999",
            404  # Expecting 404 for invalid order
        )
        return success

    def test_api_health(self):
        """Test basic API connectivity"""
        success, response = self.run_test(
            "API Health Check",
            "GET", 
            "",  # Root endpoint
            200,
        )
        return success

def main():
    # Get backend URL from environment or use default
    backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://app-6-march.preview.emergentagent.com')
    
    print("=" * 60)
    print("🧪 EDIT ORDER FEATURE - BACKEND API TESTING")
    print("=" * 60)
    print(f"Testing against: {backend_url}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Setup
    tester = EditOrderAPITester(backend_url)
    test_order_id = "243057"  # Test order ID as specified in requirements
    
    print(f"\n📋 TEST PLAN:")
    print(f"1. Test GET /api/air-bnb/get-order-details/{test_order_id}")
    print(f"2. Test with invalid order ID")
    print(f"3. Test API connectivity")
    
    # Run tests
    print(f"\n🚀 RUNNING TESTS...")
    
    # Test 1: Valid order ID
    test1_success = tester.test_get_order_details(test_order_id)
    
    # Test 2: Invalid order ID  
    test2_success = tester.test_invalid_order_id()
    
    # Test 3: API health
    test3_success = tester.test_api_health()
    
    # Print results
    print(f"\n📊 TEST SUMMARY:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print(f"\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n💥 SOME TESTS FAILED!")
        
        # Show failed tests
        failed_tests = [test for test in tester.test_results if not test['success']]
        for test in failed_tests:
            error_msg = test['error'] or f"Status {test['actual_status']}"
            print(f"   ❌ {test['test_name']}: {error_msg}")
        
        return 1

if __name__ == "__main__":
    sys.exit(main())