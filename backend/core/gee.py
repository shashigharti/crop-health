import ee
import os


def _initialize(credentials: ee.ServiceAccountCredentials = None) -> None:
    ee.Initialize(credentials)


def init_gee():
    service_account = os.getenv("GEE_SERVICE_ACCOUNT")
    key_path = os.getenv("GEE_SERVICE_ACCOUNT_KEY_PATH")
    key_data = os.getenv("GEE_SERVICE_ACCOUNT_KEY")

    if service_account and key_path:
        _initialize(ee.ServiceAccountCredentials(service_account, key_file=key_path))
        return

    if service_account and key_data:
        _initialize(ee.ServiceAccountCredentials(service_account, key_data=key_data))
        return

    _initialize()
