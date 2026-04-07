import ee
import os
import json

def _initialize(credentials=None, project=None):
    ee.Initialize(credentials, project=project)

def init_gee():
    service_account = os.getenv("GEE_SERVICE_ACCOUNT")
    key_path = os.getenv("GEE_SERVICE_ACCOUNT_KEY_PATH")
    key_data = os.getenv("GEE_SERVICE_ACCOUNT_KEY")
    project = os.getenv("GEE_PROJECT")

    print(f"SA: {service_account}")
    print(f"PROJECT: {project}")
    print(f"KEY_DATA set: {bool(key_data)}")
    print(f"KEY_PATH: {key_path}")

    if service_account and key_path:
        _initialize(
            ee.ServiceAccountCredentials(service_account, key_file=key_path),
            project=project
        )
        return

    if service_account and key_data:
        _initialize(
            ee.ServiceAccountCredentials(service_account, key_data=key_data),
            project=project
        )
        return

    _initialize(project=project)