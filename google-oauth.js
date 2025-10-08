// ECO Tracker - Google OAuth Integration
// This file handles Google OAuth authentication for the platform

class GoogleOAuthManager {
    constructor() {
        // Google OAuth Configuration
        this.clientId = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Replace with actual client ID
        this.redirectUri = window.location.origin + '/auth.html';
        this.scope = 'openid email profile';
        this.responseType = 'code';
        
        // For development/demo purposes, we'll simulate OAuth
        this.isDemoMode = true;
        
        this.init();
    }

    init() {
        // Load Google OAuth SDK if not in demo mode
        if (!this.isDemoMode) {
            this.loadGoogleSDK();
        }
        
        // Check for OAuth callback parameters
        this.handleOAuthCallback();
    }

    loadGoogleSDK() {
        // Load Google Identity Services SDK
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
            this.initializeGoogleAuth();
        };
        document.head.appendChild(script);
    }

    initializeGoogleAuth() {
        // Initialize Google Identity Services
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: this.clientId,
                callback: this.handleCredentialResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: false
            });
        }
    }

    // Handle OAuth callback from Google
    handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
            console.error('OAuth Error:', error);
            this.showError('Authentication failed. Please try again.');
            return;
        }

        if (code && state) {
            // Exchange code for tokens (in production, this would be done server-side)
            this.exchangeCodeForTokens(code, state);
        }
    }

    // Exchange authorization code for access tokens (server-side in production)
    async exchangeCodeForTokens(code, state) {
        try {
            // In production, this would be a secure server-side endpoint
            const response = await fetch('/api/auth/google/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, state })
            });

            const data = await response.json();
            
            if (data.success) {
                this.handleSuccessfulAuth(data.user);
            } else {
                this.showError('Authentication failed. Please try again.');
            }
        } catch (error) {
            console.error('Token exchange error:', error);
            this.showError('Authentication failed. Please try again.');
        }
    }

    // Handle credential response from Google One Tap
    handleCredentialResponse(response) {
        try {
            // Decode JWT token (in production, verify on server-side)
            const userInfo = this.parseJWT(response.credential);
            this.handleSuccessfulAuth({
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                authMethod: 'google'
            });
        } catch (error) {
            console.error('Credential response error:', error);
            this.showError('Authentication failed. Please try again.');
        }
    }

    // Parse JWT token (client-side for demo only - verify server-side in production)
    parseJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Initiate Google OAuth login
    initiateGoogleLogin() {
        if (this.isDemoMode) {
            // Demo mode - simulate Google login
            this.simulateGoogleLogin();
            return;
        }

        // Production mode - redirect to Google OAuth
        const authUrl = this.buildAuthUrl();
        window.location.href = authUrl;
    }

    // Build Google OAuth authorization URL
    buildAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            response_type: this.responseType,
            state: this.generateState(),
            prompt: 'select_account',
            access_type: 'offline'
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    // Generate random state parameter for security
    generateState() {
        const state = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('oauth_state', state);
        return state;
    }

    // Simulate Google login for demo purposes
    simulateGoogleLogin() {
        // Show loading state
        this.showLoadingState('Connecting to Google...');

        setTimeout(() => {
            // Simulate successful Google authentication
            const mockGoogleUser = {
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
                authMethod: 'google',
                googleId: 'google_' + Date.now()
            };

            this.handleSuccessfulAuth(mockGoogleUser);
        }, 2000);
    }

    // Handle successful authentication
    handleSuccessfulAuth(userInfo) {
        try {
            // Create user session
            const userData = {
                id: userInfo.googleId || 'google_' + Date.now(),
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                authMethod: 'google',
                loginTime: new Date().toISOString(),
                subscription: 'trial',
                trialStartDate: new Date().toISOString(),
                trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };

            // Store user data
            localStorage.setItem('ecoTracker_user', JSON.stringify(userData));

            // Create database entry if using the mock database
            if (typeof ecoTrackerDB !== 'undefined') {
                ecoTrackerDB.createUser(userData);
            }

            // Show success message
            this.showSuccessMessage('Welcome! Redirecting to your dashboard...');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            console.error('Auth success handler error:', error);
            this.showError('Authentication completed but failed to create session. Please try again.');
        }
    }

    // Show loading state
    showLoadingState(message) {
        const button = document.querySelector('.google-btn');
        if (button) {
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="loading-spinner" style="width: 16px; height: 16px; border: 2px solid rgba(234, 67, 53, 0.3); border-radius: 50%; border-top-color: #ea4335; animation: spin 1s linear infinite; display: inline-block;"></div>
                    <span>${message}</span>
                </div>
            `;
            button.disabled = true;

            // Store original content for restoration
            button.dataset.originalContent = originalContent;
        }
    }

    // Show success message
    showSuccessMessage(message) {
        const button = document.querySelector('.google-btn');
        if (button) {
            button.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check-circle" style="color: #22c55e;"></i>
                    <span>${message}</span>
                </div>
            `;
            button.style.background = 'rgba(34, 197, 94, 0.1)';
            button.style.color = '#15803d';
            button.style.borderColor = '#22c55e';
        }
    }

    // Show error message
    showError(message) {
        const button = document.querySelector('.google-btn');
        if (button) {
            // Restore original content
            if (button.dataset.originalContent) {
                button.innerHTML = button.dataset.originalContent;
                button.disabled = false;
            }

            // Show error temporarily
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>
                    <span>${message}</span>
                </div>
            `;
            button.style.background = 'rgba(239, 68, 68, 0.1)';
            button.style.color = '#dc2626';
            button.style.borderColor = '#ef4444';

            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.background = '';
                button.style.color = '';
                button.style.borderColor = '';
                button.disabled = false;
            }, 3000);
        }

        // Also show alert for visibility
        alert(message);
    }

    // Render Google One Tap prompt
    renderOneTap(parentId) {
        if (this.isDemoMode) return;

        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log('One Tap not displayed or skipped');
                }
            });
        }
    }

    // Render Google Sign-In button
    renderSignInButton(parentId, options = {}) {
        if (this.isDemoMode) return;

        const defaultOptions = {
            type: 'standard',
            shape: 'rectangular',
            theme: 'outline',
            text: 'signin_with',
            size: 'large',
            width: '100%'
        };

        const config = { ...defaultOptions, ...options };

        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.renderButton(
                document.getElementById(parentId),
                config
            );
        }
    }

    // Logout from Google
    logout() {
        // Clear local session
        localStorage.removeItem('ecoTracker_user');
        sessionStorage.clear();

        // Sign out from Google if not in demo mode
        if (!this.isDemoMode && typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.disableAutoSelect();
        }

        // Redirect to home page
        window.location.href = 'landing.html';
    }
}

// Initialize Google OAuth Manager
const googleOAuth = new GoogleOAuthManager();

// Export for global use
if (typeof window !== 'undefined') {
    window.googleOAuth = googleOAuth;
}

// Utility functions for backward compatibility
function loginWithGoogle() {
    googleOAuth.initiateGoogleLogin();
}

function signupWithGoogle() {
    googleOAuth.initiateGoogleLogin();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleOAuthManager;
}