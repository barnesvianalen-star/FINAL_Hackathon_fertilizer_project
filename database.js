// ECO Tracker - Mock Database and Backend System
// This file provides a simple local storage-based database system for development/demo purposes
// In production, this would be replaced with a real database (PostgreSQL, MongoDB, etc.)

class ECOTrackerDB {
    constructor() {
        this.prefix = 'ecoTracker_';
        this.init();
    }

    init() {
        // Initialize default data if not exists
        if (!this.getUsers()) {
            this.setItem('users', {});
        }
        if (!this.getSubscriptions()) {
            this.setItem('subscriptions', {});
        }
        if (!this.getUsageStats()) {
            this.setItem('usageStats', {});
        }
        if (!this.getAppData()) {
            this.setItem('appData', {});
        }
    }

    // Storage helper methods
    setItem(key, value) {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }

    getItem(key) {
        const item = localStorage.getItem(this.prefix + key);
        return item ? JSON.parse(item) : null;
    }

    removeItem(key) {
        localStorage.removeItem(this.prefix + key);
    }

    // User Management
    getUsers() {
        return this.getItem('users') || {};
    }

    getUser(userId) {
        const users = this.getUsers();
        return users[userId] || null;
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return Object.values(users).find(user => user.email === email) || null;
    }

    createUser(userData) {
        const users = this.getUsers();
        const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const user = {
            id: userId,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || null,
            authMethod: userData.authMethod || 'email',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            profile: {
                location: userData.location || null,
                avatar: userData.avatar || null,
                preferences: {
                    notifications: true,
                    emailUpdates: true,
                    theme: 'light'
                }
            }
        };

        users[userId] = user;
        this.setItem('users', users);

        // Create default subscription (trial)
        this.createSubscription(userId, 'trial');

        // Initialize usage stats
        this.initializeUsageStats(userId);

        return user;
    }

    updateUser(userId, updates) {
        const users = this.getUsers();
        if (!users[userId]) return null;

        users[userId] = {
            ...users[userId],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.setItem('users', users);
        return users[userId];
    }

    deleteUser(userId) {
        const users = this.getUsers();
        if (!users[userId]) return false;

        delete users[userId];
        this.setItem('users', users);

        // Clean up related data
        this.deleteSubscription(userId);
        this.deleteUsageStats(userId);
        this.deleteAppData(userId);

        return true;
    }

    // Subscription Management
    getSubscriptions() {
        return this.getItem('subscriptions') || {};
    }

    getSubscription(userId) {
        const subscriptions = this.getSubscriptions();
        return subscriptions[userId] || null;
    }

    createSubscription(userId, plan = 'trial') {
        const subscriptions = this.getSubscriptions();
        
        const planDetails = this.getPlanDetails(plan);
        const startDate = new Date();
        const endDate = new Date();
        
        if (plan === 'trial') {
            endDate.setDate(startDate.getDate() + 7); // 7-day trial
        } else {
            endDate.setFullYear(startDate.getFullYear() + 1); // Yearly subscription
        }

        const subscription = {
            userId: userId,
            plan: plan,
            status: 'active',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            autoRenew: plan !== 'trial',
            billingInfo: {
                lastPayment: plan !== 'trial' ? startDate.toISOString() : null,
                nextPayment: plan !== 'trial' ? endDate.toISOString() : null,
                paymentMethod: null
            },
            limits: planDetails.limits,
            features: planDetails.features,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        subscriptions[userId] = subscription;
        this.setItem('subscriptions', subscriptions);
        return subscription;
    }

    updateSubscription(userId, plan) {
        const subscriptions = this.getSubscriptions();
        const currentSub = subscriptions[userId];
        
        if (!currentSub) {
            return this.createSubscription(userId, plan);
        }

        const planDetails = this.getPlanDetails(plan);
        const now = new Date();
        const endDate = new Date();
        endDate.setFullYear(now.getFullYear() + 1);

        subscriptions[userId] = {
            ...currentSub,
            plan: plan,
            status: 'active',
            endDate: endDate.toISOString(),
            autoRenew: true,
            limits: planDetails.limits,
            features: planDetails.features,
            updatedAt: now.toISOString(),
            billingInfo: {
                ...currentSub.billingInfo,
                lastPayment: now.toISOString(),
                nextPayment: endDate.toISOString()
            }
        };

        this.setItem('subscriptions', subscriptions);
        return subscriptions[userId];
    }

    deleteSubscription(userId) {
        const subscriptions = this.getSubscriptions();
        if (!subscriptions[userId]) return false;

        delete subscriptions[userId];
        this.setItem('subscriptions', subscriptions);
        return true;
    }

    getPlanDetails(plan) {
        const plans = {
            trial: {
                limits: {
                    scansPerMonth: 10,
                    analysesPerMonth: 10,
                    reportsPerMonth: 3
                },
                features: {
                    basicAnalysis: true,
                    fertilizer_calculator: true,
                    email_support: true,
                    advanced_analytics: false,
                    api_access: false,
                    custom_recipes: false,
                    priority_support: false,
                    phone_support: false,
                    white_label: false
                }
            },
            basic: {
                limits: {
                    scansPerMonth: 600,
                    analysesPerMonth: 600,
                    reportsPerMonth: 120
                },
                features: {
                    basicAnalysis: true,
                    fertilizer_calculator: true,
                    email_support: true,
                    advanced_analytics: false,
                    api_access: false,
                    custom_recipes: false,
                    priority_support: false,
                    phone_support: false,
                    white_label: false
                }
            },
            pro: {
                limits: {
                    scansPerMonth: 2400,
                    analysesPerMonth: 2400,
                    reportsPerMonth: 600
                },
                features: {
                    basicAnalysis: true,
                    fertilizer_calculator: true,
                    email_support: true,
                    advanced_analytics: true,
                    api_access: false,
                    custom_recipes: true,
                    priority_support: true,
                    phone_support: false,
                    white_label: false
                }
            },
            premium: {
                limits: {
                    scansPerMonth: -1, // unlimited
                    analysesPerMonth: -1,
                    reportsPerMonth: -1
                },
                features: {
                    basicAnalysis: true,
                    fertilizer_calculator: true,
                    email_support: true,
                    advanced_analytics: true,
                    api_access: true,
                    custom_recipes: true,
                    priority_support: true,
                    phone_support: true,
                    white_label: true
                }
            }
        };

        return plans[plan] || plans.trial;
    }

    // Usage Statistics
    getUsageStats() {
        return this.getItem('usageStats') || {};
    }

    getUserUsageStats(userId) {
        const stats = this.getUsageStats();
        return stats[userId] || null;
    }

    initializeUsageStats(userId) {
        const stats = this.getUsageStats();
        const now = new Date();
        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

        stats[userId] = {
            userId: userId,
            totalScans: 0,
            totalAnalyses: 0,
            totalReports: 0,
            totalFoodWasteTracked: 0, // in kg
            totalFertilizerProduced: 0, // in kg
            wasteReduction: 0, // percentage
            monthlyStats: {
                [currentMonth]: {
                    scans: 0,
                    analyses: 0,
                    reports: 0,
                    foodWaste: 0,
                    fertilizer: 0
                }
            },
            lastUpdated: now.toISOString(),
            createdAt: now.toISOString()
        };

        this.setItem('usageStats', stats);
        return stats[userId];
    }

    updateUsageStats(userId, updates) {
        const stats = this.getUsageStats();
        const userStats = stats[userId] || this.initializeUsageStats(userId);
        
        const now = new Date();
        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

        // Ensure monthly stats exist for current month
        if (!userStats.monthlyStats[currentMonth]) {
            userStats.monthlyStats[currentMonth] = {
                scans: 0,
                analyses: 0,
                reports: 0,
                foodWaste: 0,
                fertilizer: 0
            };
        }

        // Update totals
        Object.keys(updates).forEach(key => {
            if (userStats.hasOwnProperty('total' + key.charAt(0).toUpperCase() + key.slice(1))) {
                userStats['total' + key.charAt(0).toUpperCase() + key.slice(1)] += updates[key];
            }
        });

        // Update monthly stats
        Object.keys(updates).forEach(key => {
            if (userStats.monthlyStats[currentMonth].hasOwnProperty(key)) {
                userStats.monthlyStats[currentMonth][key] += updates[key];
            }
        });

        userStats.lastUpdated = now.toISOString();
        stats[userId] = userStats;
        this.setItem('usageStats', stats);
        
        return userStats;
    }

    deleteUsageStats(userId) {
        const stats = this.getUsageStats();
        if (!stats[userId]) return false;

        delete stats[userId];
        this.setItem('usageStats', stats);
        return true;
    }

    // App Data (scans, analyses, etc.)
    getAppData() {
        return this.getItem('appData') || {};
    }

    getUserAppData(userId) {
        const appData = this.getAppData();
        return appData[userId] || null;
    }

    initializeAppData(userId) {
        const appData = this.getAppData();
        
        appData[userId] = {
            userId: userId,
            scans: [],
            analyses: [],
            reports: [],
            settings: {
                defaultUnits: 'metric',
                autoSave: true,
                syncEnabled: true
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.setItem('appData', appData);
        return appData[userId];
    }

    addScan(userId, scanData) {
        const appData = this.getAppData();
        let userData = appData[userId] || this.initializeAppData(userId);

        const scan = {
            id: 'scan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            userId: userId,
            timestamp: new Date().toISOString(),
            foodType: scanData.foodType,
            weight: scanData.weight,
            nutrients: scanData.nutrients,
            fertilizerPotential: scanData.fertilizerPotential,
            image: scanData.image || null,
            location: scanData.location || null
        };

        userData.scans.push(scan);
        userData.updatedAt = new Date().toISOString();
        appData[userId] = userData;
        this.setItem('appData', appData);

        // Update usage stats
        this.updateUsageStats(userId, {
            scans: 1,
            foodWaste: scanData.weight || 0,
            fertilizer: scanData.fertilizerPotential || 0
        });

        return scan;
    }

    deleteAppData(userId) {
        const appData = this.getAppData();
        if (!appData[userId]) return false;

        delete appData[userId];
        this.setItem('appData', appData);
        return true;
    }

    // Admin Functions
    getAllUsers() {
        return Object.values(this.getUsers());
    }

    getAllSubscriptions() {
        return Object.values(this.getSubscriptions());
    }

    getAnalytics() {
        const users = this.getAllUsers();
        const subscriptions = this.getAllSubscriptions();
        const stats = Object.values(this.getUsageStats());

        const analytics = {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length,
            subscriptionBreakdown: {
                trial: subscriptions.filter(s => s.plan === 'trial').length,
                basic: subscriptions.filter(s => s.plan === 'basic').length,
                pro: subscriptions.filter(s => s.plan === 'pro').length,
                premium: subscriptions.filter(s => s.plan === 'premium').length
            },
            totalScans: stats.reduce((sum, s) => sum + s.totalScans, 0),
            totalFoodWaste: stats.reduce((sum, s) => sum + s.totalFoodWasteTracked, 0),
            totalFertilizer: stats.reduce((sum, s) => sum + s.totalFertilizerProduced, 0),
            averageWasteReduction: stats.length ? 
                stats.reduce((sum, s) => sum + s.wasteReduction, 0) / stats.length : 0
        };

        return analytics;
    }

    // Utility functions
    checkSubscriptionLimits(userId, action) {
        const subscription = this.getSubscription(userId);
        const usageStats = this.getUserUsageStats(userId);
        
        if (!subscription || !usageStats) return false;

        const now = new Date();
        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        const monthlyStats = usageStats.monthlyStats[currentMonth] || {};

        switch (action) {
            case 'scan':
                return subscription.limits.scansPerMonth === -1 || 
                       (monthlyStats.scans || 0) < subscription.limits.scansPerMonth;
            case 'analysis':
                return subscription.limits.analysesPerMonth === -1 || 
                       (monthlyStats.analyses || 0) < subscription.limits.analysesPerMonth;
            case 'report':
                return subscription.limits.reportsPerMonth === -1 || 
                       (monthlyStats.reports || 0) < subscription.limits.reportsPerMonth;
            default:
                return false;
        }
    }

    hasFeature(userId, feature) {
        const subscription = this.getSubscription(userId);
        return subscription && subscription.features[feature];
    }

    // Reset database (for development/testing)
    resetDatabase() {
        const keys = ['users', 'subscriptions', 'usageStats', 'appData'];
        keys.forEach(key => this.removeItem(key));
        this.init();
    }

    // Export data
    exportUserData(userId) {
        return {
            user: this.getUser(userId),
            subscription: this.getSubscription(userId),
            usageStats: this.getUserUsageStats(userId),
            appData: this.getUserAppData(userId)
        };
    }

    // Import data (for migration or backup restore)
    importUserData(userData) {
        if (userData.user) {
            const users = this.getUsers();
            users[userData.user.id] = userData.user;
            this.setItem('users', users);
        }

        if (userData.subscription) {
            const subscriptions = this.getSubscriptions();
            subscriptions[userData.subscription.userId] = userData.subscription;
            this.setItem('subscriptions', subscriptions);
        }

        if (userData.usageStats) {
            const stats = this.getUsageStats();
            stats[userData.usageStats.userId] = userData.usageStats;
            this.setItem('usageStats', stats);
        }

        if (userData.appData) {
            const appData = this.getAppData();
            appData[userData.appData.userId] = userData.appData;
            this.setItem('appData', appData);
        }
    }
}

// Initialize global database instance
const ecoTrackerDB = new ECOTrackerDB();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ECOTrackerDB;
}

// Add to global scope for browser usage
if (typeof window !== 'undefined') {
    window.ecoTrackerDB = ecoTrackerDB;
}