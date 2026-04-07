# HuggingFace Spaces Deployment

## 1. Add Secrets
Go to **Settings → Variables and Secrets** and add:

| Secret Name | Value |
|---|---|
| `GEE_SERVICE_ACCOUNT` | `crophealth@your-project.iam.gserviceaccount.com` |
| `GEE_SERVICE_ACCOUNT_KEY` | Contents of JSON key (single line) |
| `GEE_PROJECT` | `your-gcp-project-id` |

## 2. Push to Deploy
```bash
git add .
git commit -m "your message"
git push huggingface main
```

Space rebuilds automatically on every push.