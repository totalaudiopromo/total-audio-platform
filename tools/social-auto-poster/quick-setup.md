# Quick Manual Setup (Mobile Friendly)

Copy this template and fill in your credentials:

```json
{
  "linkedin": {
    "enabled": false,
    "clientId": "YOUR_LINKEDIN_CLIENT_ID",
    "clientSecret": "YOUR_LINKEDIN_CLIENT_SECRET",
    "accessToken": "YOUR_ACCESS_TOKEN",
    "personUrn": "urn:li:person:YOUR_ID"
  },
  "bluesky": {
    "enabled": true,
    "handle": "yourhandle.bsky.social",
    "appPassword": "your-app-password-here",
    "did": ""
  },
  "threads": {
    "enabled": false,
    "accessToken": "YOUR_THREADS_TOKEN",
    "userId": "YOUR_USER_ID",
    "username": "yourusername"
  }
}
```

Save as: `social-config.json`

## Easiest Start: Bluesky Only

Since you're on mobile, start with just Bluesky (easiest):

1. Open Bluesky app
2. Settings > Privacy and Security > App Passwords
3. Create App Password
4. Copy it

Then tell me:
- Your Bluesky handle (e.g., chris.bsky.social)
- Your app password

I'll create the config file for you!

## LinkedIn (Desktop Required)

LinkedIn needs OAuth which is easier on desktop. Skip for now.

## Threads (Complex)

Threads needs Facebook Developer setup. Skip for now.
