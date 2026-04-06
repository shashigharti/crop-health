# test_gee.py
import ee
import json
import os
from dotenv import load_dotenv

load_dotenv()


def test_gee():
    try:
        key_path = os.getenv("GEE_SERVICE_ACCOUNT_KEY_PATH")
        service_account = os.getenv("GEE_SERVICE_ACCOUNT")

        print(f"Service Account: {service_account}")

        with open(key_path) as f:
            key = json.load(f)

        credentials = ee.ServiceAccountCredentials(
            service_account,
            key_file=key_path,  # ← use key_file instead of key_data
        )
        ee.Initialize(credentials)

        print("✅ GEE connected:", ee.String("Hello!").getInfo())
        print(
            "✅ EMIT bands:", len(ee.Image("NASA/EMIT/L2A/RFL").bandNames().getInfo())
        )

    except ee.EEException as e:
        print(f"❌ GEE error: {e}")
    except Exception as e:
        print(f"❌ General error: {e}")


test_gee()
