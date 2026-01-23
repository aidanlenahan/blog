# Cloudflare Access Setup Guide for Applications

This guide covers how to set up Cloudflare Access with Cloudflared, create applications, and secure them with Google and GitHub login.

---

## 1. Setting up Cloudflared

1. **Install Cloudflared** on your server:

```bash
# Download and install the package
curl -LO https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

2. **Authenticate the tunnel**:

```bash
cloudflared tunnel login
```

This will open a browser to authorize your account.

3. **Create a tunnel**:

```bash
cloudflared tunnel create <tunnel-name>
```

4. **Create the Cloudflared configuration file**:

```yaml
# /root/.cloudflared/config.yml
tunnel: <tunnel-uuid>
credentials-file: /root/.cloudflared/<tunnel-uuid>.json

ingress:
  - hostname: <subdomain>.<domain>
    service: https://<internal-server-ip>:<port>
  - service: http_status:404
```

5. **Install the tunnel as a systemd service**:

```bash
cloudflared service install
systemctl enable cloudflared
systemctl start cloudflared
systemctl status cloudflared
```

6. **Route your DNS to the tunnel**:

```bash
cloudflared tunnel route dns <tunnel-name> <subdomain.domain>
```

---

## 2. Creating an Application in Cloudflare Access

1. Go to **Access → Applications → Create Application**.
2. **Fill in the application details**:

* **Application Name:** Any descriptive name
* **Application URL:** `https://<subdomain>.<domain>`
* **Session Duration:** As needed (e.g., same as application timeout)

3. **Optional Settings**:

* **Use default domain** or a **custom domain**
* **Browser rendering** if needed
* **WARP authentication** if you want device-level authentication

---

## 3. Securing the Application with Cloudflare Access

Cloudflare Access uses **policies** to control who can reach your application.

### Recommended approach for multiple login methods:

Since a single policy cannot require multiple login methods simultaneously, we use **multiple policies**, one per login method.

---

### Example Policy Setup

#### **Policy 1: Google Login**

* **Name:** `google-login`
* **Action:** Allow
* **Include (OR):** Emails → `aidanlenahan@gmail.com`, `aml.lenahan@gmail.com`, `d9hhhh@gmail.com`
* **Require (AND):** Login Method → Google

#### **Policy 2: GitHub Login**

* **Name:** `github-login`
* **Action:** Allow
* **Include (OR):** Emails → `aidanlenahan@gmail.com`, `aml.lenahan@gmail.com`, `d9hhhh@gmail.com`
* **Require (AND):** Login Method → GitHub

**Important:**

* Policies are evaluated **top-to-bottom**. Place these policies above any default deny policy.
* This ensures only authorized emails can log in via their chosen login method.

---

### Policy Tester

Use the **Policy Tester** in Cloudflare Access to confirm:

* Only your specified emails are allowed
* Login is limited to the selected login methods (Google or GitHub)
* Any unauthorized email is blocked

---

## 4. Adding Identity Providers

### GitHub

1. Log in to GitHub → **Settings → Developer Settings → OAuth Apps → New OAuth App**
2. Fill in:

   * **Application Name:** Any descriptive name
   * **Homepage URL:** `https://<your-team>.cloudflareaccess.com`
   * **Authorization callback URL:** `https://<your-team>.cloudflareaccess.com/cdn-cgi/access/callback`
3. Register the application and copy:

   * **Client ID**
   * **Client Secret**
4. In Cloudflare One → **Integrations → Identity Providers → Add → GitHub**:

   * Paste **Client ID** and **Client Secret**
   * Save and **Test** the connection

**Reference API Configuration:**

```json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "type": "github",
  "name": "GitHub SSO"
}
```

---

### Google

1. Log in to **Google Cloud Platform** → Create a new project
2. Go to **APIs & Services → Credentials → Configure Consent Screen**:

   * App Name
   * User Support Email
   * Audience: External
   * Contact info
   * Agree to Google’s policy
3. Create OAuth Client → **Web Application**

   * **Authorized JavaScript origins:** `https://<your-team>.cloudflareaccess.com`
   * **Authorized redirect URIs:** `https://<your-team>.cloudflareaccess.com/cdn-cgi/access/callback`
4. Copy **OAuth Client ID** and **Client Secret**
5. In Cloudflare One → **Integrations → Identity Providers → Add → Google**:

   * Paste **Client ID** and **Client Secret**
   * Optional: Enable PKCE
   * Save and **Test** the connection

**Reference API Configuration:**

```json
{
  "config": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "type": "google",
  "name": "Google SSO"
}
```

---

## 5. Notes on Security and Access Policies

* Never put multiple login methods in a **single Require** — use **one policy per login method**
* Never put multiple emails in a **single Require** expecting OR behavior — use the Include rule for OR logic
* Include rules define **who may attempt login**
* Require rules define **what conditions must be satisfied for access**
* Test policies thoroughly using the **Policy Tester**
* All new applications can reuse these policies by selecting them in the **Access Policies** tab
