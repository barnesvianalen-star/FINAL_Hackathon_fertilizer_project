# ECO Tracker - AI-Powered Food Waste to Fertilizer Platform

## 🌱 Project Overview

ECO Tracker is a comprehensive web-based platform that transforms food waste into valuable fertilizer using AI-powered analysis. The platform features user authentication, subscription management, food waste scanning, nutrient analysis, and administrative tools.

## 🚀 Features

### Core Platform Features
- **AI-Powered Food Scanning**: Computer vision for food waste identification
- **Nutrient Analysis**: Detailed NPK and micronutrient breakdown
- **Fertilizer Calculator**: Precise fertilizer formulation recommendations
- **Usage Analytics**: Track waste reduction and fertilizer production
- **Progressive Web App**: Offline functionality and mobile optimization

### Business Features
- **User Authentication**: Email, phone, and Google OAuth login
- **Landing Page CTAs**: Prominent Sign Up and Login buttons
- **Google OAuth Integration**: Professional OAuth 2.0 flow with demo mode
- **Subscription Tiers**: Basic (₹799), Pro (₹1,599), Premium (₹3,200) with 7-day free trial
- **Dashboard**: Comprehensive user account management
- **Admin Panel**: Complete platform oversight and management
- **Usage Tracking**: Monitor limits and feature access per plan

## 📁 Project Structure

```
complete-website/
├── index.html              # Redirects to landing page
├── landing.html             # Professional marketing landing page
├── auth.html               # Authentication (login/signup)
├── dashboard.html          # User dashboard and account management
├── app.html                # Main PWA application
├── admin.html              # Admin panel for platform management
├── admin-login.html        # Secure admin authentication page
├── database.js             # Mock database system (localStorage-based)
├── google-oauth.js         # Google OAuth integration
├── GOOGLE_OAUTH_SETUP.md   # Google OAuth API setup guide
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for offline functionality
├── start-server.ps1        # Local development server script
├── deploy-hackathon.ps1    # Deployment script
├── README.md               # This documentation
└── WEBSITE_SUMMARY.md      # Legacy summary file
```

## 🎯 User Journey

### 1. Landing Page (`landing.html`)
- Professional marketing page with pricing
- Feature showcases and testimonials
- Call-to-action for free trial signup
- Mobile-responsive design

### 2. Authentication (`auth.html`)
- Login/signup forms with validation
- Google OAuth integration (demo)
- Phone authentication option (demo)
- 7-day free trial activation

### 3. User Dashboard (`dashboard.html`)
- Account overview and statistics
- Subscription management
- Usage analytics and reports
- Profile settings and preferences
- Direct app launcher

### 4. Main Application (`app.html`)
- Food waste scanning interface
- Manual entry forms
- Nutrient analysis dashboard
- Fertilizer calculator
- History and tracking
- AI chatbot assistants

### 5. Admin Panel (`admin.html`)
- User management system
- Subscription oversight
- Platform analytics
- Database management tools
- System settings

## 🔧 Technical Implementation

### Frontend
- **Framework**: Vanilla HTML, CSS, JavaScript
- **Styling**: Custom CSS with gradient backgrounds and glass morphism
- **Icons**: Font Awesome 6.0
- **Responsive**: Mobile-first design approach
- **PWA**: Service worker and manifest for app-like experience

### Data Management
- **Storage**: localStorage-based mock database (`database.js`)
- **User Data**: Accounts, profiles, preferences
- **Subscriptions**: Plans, billing, limits, features
- **Usage Stats**: Scans, analyses, reports tracking
- **App Data**: Food scans, analyses, historical data

### Authentication System
- **Methods**: Email/password, Google OAuth (demo), Phone (demo)
- **Security**: Client-side validation and session management
- **Sessions**: localStorage-based user sessions

### Subscription System
- **Plans**: 
  - Trial: 10 scans/month, basic features, 7-day limit
  - Basic: 50 scans/month, email support, ₹799/year
  - Pro: 200 scans/month, advanced analytics, priority support, ₹1,599/year
  - Premium: Unlimited scans, AI insights, API access, white-label, ₹3,200/year
- **Features**: Dynamic feature gating based on plan
- **Billing**: Mock payment system (ready for real integration)

## 🛠️ Setup and Development

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- PowerShell (for Windows scripts) or equivalent terminal

### Local Development
1. Clone or download the project files
2. Navigate to the `complete-website` directory
3. Run the development server:
   ```powershell
   .\start-server.ps1
   ```
4. Open browser to `http://localhost:8000`

### File Structure Setup
Ensure all files are in the same directory:
- All HTML files should be in the root directory
- `database.js` must be accessible by all pages
- `manifest.json` and `sw.js` for PWA functionality

### Admin Access
To access the admin panel:
1. Navigate to `/admin-login.html` or click "Admin Panel" in the dashboard
2. Use the following credentials:
   - **Username**: `admin`
   - **Password**: `EcoTracker@2024`
   - **Security Code**: `123456`
3. Quick access: Press `Ctrl+Shift+A` on the login page to auto-fill credentials (development mode)

### Google OAuth Setup
The platform includes Google OAuth integration:
1. **Demo Mode** (Current): Simulates Google login with test user
2. **Production Setup**: Follow the guide in `GOOGLE_OAUTH_SETUP.md`
3. **Test Google Login**: Click "Continue with Google" on auth page
4. **API Key Required**: For production, get Client ID from Google Cloud Console

## 🎨 Design System

### Color Palette
- **Primary Green**: `#16a34a` - Main brand color
- **Secondary Green**: `#22c55e` - Accents and highlights
- **Background**: Gradient from `#e8f5e8` to `#ecfdf5`
- **Glass Effect**: `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(20px)`

### Typography
- **Font Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Headings**: Weight 600-700, various sizes
- **Body**: Line height 1.6, color `#333`

### Components
- **Cards**: Rounded corners (16px), subtle shadows, glass morphism
- **Buttons**: Gradient backgrounds, hover effects, transform animations
- **Forms**: Clean inputs with focus states and validation
- **Tables**: Responsive with hover effects and status badges

## 🔒 Security Considerations

### Current Implementation (Development Mode)
- Client-side authentication (localStorage)
- No real password hashing
- Mock OAuth implementations
- Local data storage only

### Production Recommendations
- Server-side authentication with JWT tokens
- Password hashing (bcrypt)
- Real OAuth providers (Google, Facebook, etc.)
- Database encryption
- HTTPS enforcement
- Rate limiting and CORS policies
- Input sanitization and validation

## 📊 Database Schema

### Users Table
```json
{
  "id": "user_[timestamp]_[random]",
  "name": "string",
  "email": "string",
  "phone": "string|null",
  "authMethod": "email|google|phone",
  "createdAt": "ISO_timestamp",
  "updatedAt": "ISO_timestamp",
  "isActive": "boolean",
  "profile": {
    "location": "string|null",
    "avatar": "string|null",
    "preferences": {
      "notifications": "boolean",
      "emailUpdates": "boolean",
      "theme": "string"
    }
  }
}
```

### Subscriptions Table
```json
{
  "userId": "string",
  "plan": "trial|basic|pro|premium",
  "status": "active|expired|cancelled",
  "startDate": "ISO_timestamp",
  "endDate": "ISO_timestamp",
  "autoRenew": "boolean",
  "billingInfo": {
    "lastPayment": "ISO_timestamp|null",
    "nextPayment": "ISO_timestamp|null",
    "paymentMethod": "string|null"
  },
  "limits": {
    "scansPerMonth": "number",
    "analysesPerMonth": "number",
    "reportsPerMonth": "number"
  },
  "features": {
    "basicAnalysis": "boolean",
    "advanced_analytics": "boolean",
    "api_access": "boolean",
    // ... other features
  }
}
```

## 🚀 Deployment

### Static Hosting (Recommended)
1. Upload all files to your web server
2. Ensure `index.html` is set as the default page
3. Configure HTTPS for PWA functionality
4. Test all pages and functionality

### Cloud Deployment
The project is ready for deployment on:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git integration and automatic deployments
- **GitHub Pages**: Static site hosting
- **AWS S3**: Static website hosting

### Custom Domain Setup
1. Point your domain to the hosting service
2. Update `canonical` URLs in HTML files
3. Update PWA manifest with correct domain
4. Test all functionality after DNS propagation

## 🧪 Testing

### Manual Testing Checklist
- [ ] Landing page loads and displays correctly
- [ ] Authentication flow works (signup/login)
- [ ] Dashboard displays user data accurately
- [ ] Main app functionality is responsive
- [ ] Admin panel is accessible and functional
- [ ] PWA installs correctly on mobile devices
- [ ] Offline functionality works as expected

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📈 Future Enhancements

### Technical Improvements
- Real backend API integration
- Database migration (PostgreSQL/MongoDB)
- Real-time notifications
- Advanced analytics with charts
- Mobile native app versions
- API for third-party integrations

### Business Features
- Payment gateway integration (Stripe/PayPal)
- Email marketing automation
- Customer support chat
- Multi-language support
- Bulk import/export functionality
- Team collaboration features

### AI/ML Enhancements
- Actual computer vision food recognition
- Machine learning nutrient prediction
- Personalized recommendations
- Predictive analytics
- Integration with IoT devices

## 📞 Support and Contact

For development questions or deployment assistance:
- Review this documentation thoroughly
- Check browser console for any errors
- Ensure all files are in the correct directory structure
- Verify localStorage is enabled in the browser

## 📄 License

This project is created for demonstration and educational purposes. For production use, ensure proper licensing for any third-party libraries and services used.

---

## 🎉 Quick Start

1. **Download** all project files to a folder
2. **Run** `start-server.ps1` or serve files via HTTP
3. **Open** browser to `http://localhost:8000`
4. **Click** "Start Free Trial" to create an account
5. **Explore** the dashboard and main application
6. **Test** admin access with `admin@ecotracker.com`

The platform is now ready for use and further customization!