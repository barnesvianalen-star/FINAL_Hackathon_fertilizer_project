# Google OAuth Integration Setup Guide

This guide will help you set up Google OAuth authentication for ECO Tracker.

## 🚀 Quick Setup (Current Demo Mode)

The platform is currently running in **demo mode** with simulated Google OAuth. You can test it immediately:

1. **Test Google Login**: Click "Continue with Google" on the auth page
2. **Demo User**: Automatically logs in as "John Doe" with `john.doe@gmail.com`
3. **Full Features**: Access to dashboard, subscription management, and admin panel

## 🔑 Production Setup - Google OAuth API Key

To enable real Google OAuth authentication, follow these steps:

### Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create New Project**:
   - Click "Select a project" → "New Project"
   - Project name: `ECO Tracker Authentication`
   - Click "Create"

### Step 2: Enable Google Identity Services API

1. **Navigate to APIs & Services** → **Library**
2. **Search for**: "Google Identity Services API"
3. **Click** the API and click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. **Go to**: APIs & Services → OAuth consent screen
2. **User Type**: External (for public app)
3. **Fill Required Fields**:
   ```
   App name: ECO Tracker
   User support email: your-email@domain.com
   Developer contact information: your-email@domain.com
   ```
4. **Scopes**: Add these scopes:
   - `openid`
   - `email`
   - `profile`
5. **Test users** (optional): Add test email addresses

### Step 4: Create OAuth 2.0 Credentials

1. **Go to**: APIs & Services → Credentials
2. **Click**: "Create Credentials" → "OAuth 2.0 Client IDs"
3. **Application type**: Web application
4. **Name**: ECO Tracker Web Client
5. **Authorized JavaScript origins**:
   ```
   http://localhost:8000
   https://yourdomain.com
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:8000/auth.html
   https://yourdomain.com/auth.html
   ```
7. **Click**: "Create"
8. **Copy** the Client ID (it looks like: `123456789-abc123.apps.googleusercontent.com`)

### Step 5: Configure ECO Tracker

1. **Open**: `google-oauth.js`
2. **Replace**: `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID
3. **Set**: `this.isDemoMode = false;` (line 13)
4. **Save** the file

```javascript
// In google-oauth.js
class GoogleOAuthManager {
    constructor() {
        // Replace with your actual Google OAuth Client ID
        this.clientId = '123456789-abc123.apps.googleusercontent.com';
        this.redirectUri = window.location.origin + '/auth.html';
        this.scope = 'openid email profile';
        this.responseType = 'code';
        
        // Set to false for production
        this.isDemoMode = false;
        
        this.init();
    }
    // ... rest of the code
}
```

## 🧪 Testing OAuth Integration

### Local Testing
1. **Start Server**: `./start-server.ps1`
2. **Navigate**: http://localhost:8000
3. **Click**: "Sign Up Free" → "Continue with Google"
4. **Verify**: Google OAuth popup appears
5. **Login**: Use your Google account
6. **Check**: Redirects to dashboard with user data

### Production Testing
1. **Deploy**: Upload all files to your web server
2. **Update**: Authorized origins in Google Cloud Console
3. **Test**: Same flow as local testing
4. **Verify**: SSL certificate is properly configured

## 🔐 Security Configuration

### Required Security Measures

1. **HTTPS Only**: Google OAuth requires HTTPS in production
2. **Domain Verification**: Verify your domain in Google Search Console
3. **Client Secret**: Keep client secret secure (server-side only)
4. **State Parameter**: Always validate state parameter (already implemented)
5. **Token Validation**: Verify JWT tokens server-side (not client-side)

### Environment Variables (Recommended)

Create a `.env` file for sensitive data:
```env
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_here
```

## 📋 Features Included

### Current Implementation
- ✅ **Google OAuth 2.0 Flow**
- ✅ **JWT Token Parsing**
- ✅ **User Profile Extraction**
- ✅ **Session Management**
- ✅ **Error Handling**
- ✅ **Loading States**
- ✅ **Demo Mode for Testing**

### OAuth Features
- **One Tap Sign In**: Quick authentication for returning users
- **Account Selection**: Users can choose from multiple Google accounts
- **Profile Picture**: Retrieves and displays user's Google profile picture
- **Email Verification**: Email is automatically verified by Google
- **Secure Token Exchange**: Follows OAuth 2.0 best practices

## 🛠️ Advanced Configuration

### Custom Branding
```javascript
// Customize Google Sign-In button appearance
googleOAuth.renderSignInButton('google-signin-button', {
    type: 'standard',        // 'icon' or 'standard'
    shape: 'rectangular',    // 'pill' or 'rectangular'
    theme: 'outline',        // 'filled_blue' or 'outline'
    text: 'signin_with',     // 'signin_with', 'signup_with', 'continue_with', 'signin'
    size: 'large',           // 'large', 'medium', 'small'
    width: '100%'
});
```

### One Tap Configuration
```javascript
// Enable Google One Tap for faster login
googleOAuth.renderOneTap('one-tap-container');
```

## 📱 Mobile App Integration

For future mobile app development:

1. **Android**: Configure OAuth for Android app in Google Cloud Console
2. **iOS**: Add iOS OAuth configuration
3. **Deep Links**: Set up custom URL schemes for mobile redirects

## 🚨 Troubleshooting

### Common Issues

1. **"Error 400: redirect_uri_mismatch"**
   - **Solution**: Add exact redirect URI to Google Cloud Console
   - **Check**: http vs https, trailing slashes

2. **"Error 403: access_denied"**
   - **Solution**: User cancelled authentication
   - **Check**: OAuth consent screen configuration

3. **"popup_closed_by_user"**
   - **Solution**: User closed popup before authentication
   - **Handle**: Show retry message

4. **CORS Errors**
   - **Solution**: Ensure proper domain configuration
   - **Check**: JavaScript origins in Google Cloud Console

### Debug Mode
Enable debug logging:
```javascript
// Add to google-oauth.js constructor
this.debug = true;
```

## 🔄 Migration from Demo to Production

1. **Update Client ID**: Replace placeholder with real client ID
2. **Disable Demo Mode**: Set `isDemoMode = false`
3. **Test Thoroughly**: Verify all OAuth flows work
4. **Monitor**: Check console for any authentication errors
5. **Update Documentation**: Document your specific setup

## 📊 Analytics Integration

Track OAuth usage:
```javascript
// Add to successful authentication handler
gtag('event', 'login', {
    method: 'Google'
});

// Track OAuth errors
gtag('event', 'login_error', {
    method: 'Google',
    error_type: 'oauth_failed'
});
```

## 🎯 Next Steps

1. **Get Client ID**: Follow Step 4 above
2. **Test Integration**: Use demo mode first
3. **Configure Production**: Update Client ID and disable demo mode
4. **Deploy**: Upload to production server with HTTPS
5. **Monitor**: Check authentication success rates

## 💡 Pro Tips

- **Cache Tokens**: Implement token refresh for better UX
- **Graceful Fallback**: Always provide email/password option
- **User Consent**: Clear privacy policy for OAuth data usage
- **Testing**: Test with multiple Google accounts
- **Performance**: Lazy load Google OAuth SDK for faster page loads

---

## 🔗 Useful Links

- **Google Identity Services Documentation**: https://developers.google.com/identity/gsi/web
- **OAuth 2.0 Best Practices**: https://tools.ietf.org/html/draft-ietf-oauth-security-topics
- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth Playground**: https://developers.google.com/oauthplayground/

Your ECO Tracker platform now has professional-grade Google OAuth integration! 🚀