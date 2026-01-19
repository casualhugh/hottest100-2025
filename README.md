# Hottest 100 Drinking Game

This game uses [PocketBase](https://pocketbase.io/) as its backend. and React with vite as the front end.

---

## Setup Guide

### 1. Prepare the Server
- Start a VPS (I use aws ec2 with the minimum specs) and SSH into it.
- Make sure `git` and `unzip` are installed (example for CentOS/Amazon Linux):

```bash
sudo yum update
sudo yum install git unzip
```

### 2. Download PocketBase
- Go to [PocketBase releases](https://pocketbase.io/docs/) and copy the latest Linux binary link.
- Example:

```bash
wget https://github.com/pocketbase/pocketbase/releases/download/v0.36.1/pocketbase_0.36.1_linux_amd64.zip
unzip pocketbase_0.36.1_linux_amd64.zip
```

### 3. Clone the Service
```bash
git clone https://github.com/casualhugh/hottest100-2025 service
```

### 4. Move PocketBase to Backend
```bash
mv pocketbase*/pocketbase service/backend
cd service/backend
```

### 5. Initialize PocketBase
- Start the backend:
```bash
./pocketbase serve api.hottest100game.com
```
*(Make sure Route 53 is configured for `api.hottest100game.com`.)*

- Or create a superuser:
```bash
./pocketbase superuser create EMAIL PASSWORD
```

---

### 6. Configure Route 53
- Point `api.hottest100game.com` to the public IPv4 address of your EC2 instance.

---

### 7. Set up PocketBase as a Service
```bash
cp ~/service/backend/pocketbase.service /lib/systemd/system/pocketbase.service
systemctl enable pocketbase.service
systemctl start pocketbase
```
You may have to do a daemon reload note if your folder structure is different you make have to change the service file

---

### 8. Configure Backend via Browser
- Open: [https://www.api.hottest100game.com/_/](https://www.api.hottest100game.com/_/)
- Log in with your superuser email/password.
- Go to **Settings → Import Collections** and upload `schema/pb_schema.json`.
- Review and accept any changes.

---

### 9. Host the Frontend (via AWS Amplify)
- Follow Amplify's Git setup guide and point to the `frontend` folder of this repo.
- Use `npm run build` (or `yarn build`) for the build command.
- Example build settings:

```yaml
version: 1
appRoot: frontend
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

- Add the custom domain `https://www.hottest100game.com` to point to this