#!/usr/bin/env python3
"""
Test script for the Software Cost Estimation API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_prediction():
    """Test prediction endpoint with sample data"""
    print("Testing prediction endpoint...")

    # Sample project features (minimal example)
    sample_data = {
        "equivphyskloc": 100.0,
        "year": 2024,
        "mode_embedded": False,
        "rely_n": True,
        "data_n": True,
        "cplx_n": True,
        "time_h": False,
        "stor_h": False,
        "virt_h": False,
        "turn_h": False,
        "acap_h": False,
        "acap_vh": False,
        "aexp_h": False,
        "aexp_vh": False,
        "pcap_h": False,
        "pcap_vh": False,
        "vexp_n": True,
        "lexp_n": True,
        "modp_h": False,
        "modp_vh": False,
        "tool_h": False,
        "sced_h": False,
        "forg_d": False,
        "center_2": False,
        "center_3": False,
        "projectname_erb": False,
        "projectname_gal": False,
        "projectname_hst": False,
        "projectname_slp": False,
        "projectname_spl": False,
        "cat2_business": False,
        "cat2_development": False,
        "cat2_enhancement": False,
        "cat2_flight": False,
        "cat2_ground": False,
        "cat2_mission": False,
        "cat2_navigation": False,
        "cat2_simulation": False,
        "cat2_system": False
    }

    response = requests.post(f"{BASE_URL}/predict", json=sample_data)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        result = response.json()
        print(f"Predicted effort: {result['predicted_effort_months']:.2f} person-months")
        print(f"Top 5 important features:")
        if result.get('feature_importance'):
            sorted_features = sorted(result['feature_importance'].items(),
                                   key=lambda x: abs(x[1]), reverse=True)
            for feature, importance in sorted_features[:5]:
                print(".4f")
    else:
        print(f"Error: {response.text}")
    print()

def test_explanation():
    """Test explanation endpoint"""
    print("Testing explanation endpoint...")

    # Same sample data
    sample_data = {
        "equivphyskloc": 100.0,
        "year": 2024,
        "mode_embedded": False,
        "rely_n": True,
        "data_n": True,
        "cplx_n": True,
        "time_h": False,
        "stor_h": False,
        "virt_h": False,
        "turn_h": False,
        "acap_h": False,
        "acap_vh": False,
        "aexp_h": False,
        "aexp_vh": False,
        "pcap_h": False,
        "pcap_vh": False,
        "vexp_n": True,
        "lexp_n": True,
        "modp_h": False,
        "modp_vh": False,
        "tool_h": False,
        "sced_h": False,
        "forg_d": False,
        "center_2": False,
        "center_3": False,
        "projectname_erb": False,
        "projectname_gal": False,
        "projectname_hst": False,
        "projectname_slp": False,
        "projectname_spl": False,
        "cat2_business": False,
        "cat2_development": False,
        "cat2_enhancement": False,
        "cat2_flight": False,
        "cat2_ground": False,
        "cat2_mission": False,
        "cat2_navigation": False,
        "cat2_simulation": False,
        "cat2_system": False
    }

    response = requests.post(f"{BASE_URL}/explain", json=sample_data)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        result = response.json()
        print(f"Predicted effort: {result['prediction']:.2f} person-months")
        print(f"SHAP values available: {len(result.get('shap_values', {}))} features")
    else:
        print(f"Error: {response.text}")
    print()

if __name__ == "__main__":
    print("Software Cost Estimation API Test")
    print("=" * 40)

    try:
        test_health()
        test_prediction()
        test_explanation()

        print("API tests completed successfully!")
        print(f"API Documentation: http://localhost:8000/docs")

    except Exception as e:
        print(f"Test failed: {e}")