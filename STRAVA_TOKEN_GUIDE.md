# 🔑 How to Get a New Strava Refresh Token

## Problem
Your current refresh token only has **read** permissions, but we need it to access your activity data.

---

## Solution: Generate a New Token with Correct Scopes

### Step 1: Register Your Application (if not done)

1. Go to: **https://www.strava.com/settings/api**
2. If you don't have an app, click **"Create an App"**
3. Fill in:
   - **Application Name**: `joaofaquino.run` (or any name)
   - **Category**: Choose appropriate category
   - **Club**: Leave blank (unless you have one)
   - **Website**: `http://localhost` or `https://joaofaquino.run`
   - **Authorization Callback Domain**: `localhost`
4. Click **"Create"**
5. Note down:
   - **Client ID** (e.g., 184688)
   - **Client Secret** (keep this secret!)

---

### Step 2: Get Authorization Code with Correct Scopes

**Open this URL in your browser** (replace `YOUR_CLIENT_ID` with your actual Client ID):

```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=read,activity:read_all
```

**Example with your Client ID (184688):**
```
https://www.strava.com/oauth/authorize?client_id=184688&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=read,activity:read_all
```

**Important Scopes:**
- `read` - Basic read access
- `activity:read_all` - Read all activity data (including private activities)

**Optional Additional Scopes:**
- `activity:write` - If you want to create/update activities (not needed for your use case)
- `profile:read_all` - Read all profile data

---

### Step 3: Authorize and Get Code

1. Click **"Authorize"** on the Strava page
2. You'll be redirected to something like:
   ```
   http://localhost/?state=&code=XXXXXXXXXXXXXXXXXXXXX&scope=read,activity:read_all
   ```
3. **Copy the `code` parameter** from the URL
   - Example: `1234567890abcdef1234567890abcdef12345678`

---

### Step 4: Exchange Code for Refresh Token

Run this command in PowerShell (replace the values):

```powershell
$ClientId = "184688"  # Your Client ID
$ClientSecret = "YOUR_CLIENT_SECRET"  # Your Client Secret
$AuthCode = "YOUR_AUTH_CODE"  # The code from Step 3

$body = @{
    client_id = $ClientId
    client_secret = $ClientSecret
    code = $AuthCode
    grant_type = "authorization_code"
}

$response = Invoke-RestMethod -Uri "https://www.strava.com/oauth/token" -Method Post -Body $body
$response | ConvertTo-Json
```

**OR use curl (if you have it):**

```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=184688 \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=YOUR_AUTH_CODE \
  -d grant_type=authorization_code
```

---

### Step 5: Save the Response

You'll get a JSON response like:

```json
{
  "token_type": "Bearer",
  "expires_at": 1700000000,
  "expires_in": 21600,
  "refresh_token": "YOUR_NEW_REFRESH_TOKEN_HERE",
  "access_token": "YOUR_ACCESS_TOKEN_HERE",
  "athlete": {
    "id": 12345678,
    "username": "joaofaquino",
    ...
  }
}
```

**Copy the `refresh_token`** value!

---

### Step 6: Update Your .env.local

```env
STRAVA_CLIENT_ID=184688
STRAVA_CLIENT_SECRET=your_client_secret_from_step1
STRAVA_REFRESH_TOKEN=your_new_refresh_token_from_step5
STRAVA_REDIRECT_URI=http://localhost
```

---

### Step 7: Test It

```bash
cd scripts
python fetch_strava_data.py
```

If successful, you'll see:
```
🔄 Atualizando dados do Strava...
✅ Dados salvos em public/data/strava_summary.json
🏁 Atualização concluída com sucesso.
```

---

## 🆘 Troubleshooting

### Error: "Bad Request"
→ Check that your Client ID and Client Secret are correct

### Error: "Invalid authorization code"
→ The code expires quickly! Generate a new one (repeat Step 2-3)

### Error: "Invalid scope"
→ Make sure you included `scope=read,activity:read_all` in the authorization URL

### Still getting read-only errors?
→ Revoke access at https://www.strava.com/settings/apps and start over

---

## 📝 Quick Reference

**Authorization URL Pattern:**
```
https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=SCOPES
```

**Available Scopes:**
- `read` - Read public data
- `read_all` - Read all data (including private)
- `profile:read_all` - Read all profile data
- `profile:write` - Update profile
- `activity:read` - Read public activities
- `activity:read_all` - Read all activities ✅ **(Use this!)**
- `activity:write` - Create/update activities

**Recommended for your project:**
```
scope=read,activity:read_all
```

---

## 🔐 Security Notes

1. **Never commit** `.env.local` to git (it's already in `.gitignore`)
2. **Keep your Client Secret private** - don't share it
3. **Refresh tokens don't expire** - store them securely
4. **Revoke access** at https://www.strava.com/settings/apps if needed

---

## 🚀 After Getting New Token

1. Update `.env.local` with new refresh token
2. Run `python scripts/fetch_strava_data.py`
3. Check `public/data/strava_summary.json` was created
4. Test the website: `npm run dev` → visit http://localhost:3000/progresso
5. Update GitHub Secrets for automation (if using Actions)

---

Need help? Check:
- Strava API Docs: https://developers.strava.com/docs/getting-started/
- Your API dashboard: https://www.strava.com/settings/api

---

> **Pro Tip**: Save your refresh token somewhere safe (password manager) in case you need it again!
