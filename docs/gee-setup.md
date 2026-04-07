# Google Earth Engine Setup

## 1. Create Service Account
Go to [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts)
and create a service account.

## 2. Grant IAM Roles
Go to [IAM Admin](https://console.cloud.google.com/iam-admin/iam) and grant:
- `Service Usage Consumer`
- `Earth Engine Resource Admin`

## 3. Download JSON Key
- Go to service account → Keys tab
- Add Key → Create New Key → JSON
- Save to `credentials/` folder

## 4. Register with Earth Engine
Go to [code.earthengine.google.com](https://code.earthengine.google.com)
and register your Cloud project.

## 5. Generate Single-line JSON for HF Secrets
```bash
cat credentials/your-key.json | python3 -m json.tool --compact
```