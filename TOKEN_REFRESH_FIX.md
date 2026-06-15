# Token Refresh Error Fix

## Problem
You were experiencing the error:
```
Your access token could not be refreshed because your refresh token was already used. 
Please log out and sign in again.
```

This occurs when multiple API requests attempt to refresh an expired token simultaneously, causing the same refresh token to be used twice, which the backend rejects as a security measure.

## Solution Implemented

### 1. **New Auth Service** (`services/authService.ts`)
- Implements a **queue system** to prevent concurrent refresh attempts
- Only one token refresh happens at a time; other requests wait in a queue
- Automatic token expiration detection (5-minute buffer)
- Secure token storage using AsyncStorage
- Automatic logout on invalid/expired refresh tokens

### 2. **Updated AppContext** 
- Initializes auth service on app startup
- Recovers authentication session from stored tokens
- Proper error handling with `authError` state
- Real login/signup/logout methods (no longer mocked)

### 3. **API Client**
- Automatic token refresh before expired requests
- Retry logic for failed requests
- One-time refresh attempt on 401 responses
- Force logout if refresh fails

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure API Base URL
Create a `.env` file in your project root:
```env
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

Or copy from the example:
```bash
cp .env.example .env
```

### Step 3: Update Your API Endpoints
Make sure your backend endpoints match:
- `POST /auth/login` - Returns `{ accessToken, refreshToken, expiresAt }`
- `POST /auth/signup` - Returns `{ accessToken, refreshToken, expiresAt }`
- `POST /auth/refresh` - Takes `{ refreshToken }`, returns `{ accessToken, refreshToken, expiresAt }`

## Usage in Components

### Login Example
```tsx
import { useApp } from '@/context/AppContext';

export function LoginScreen() {
  const { login, authError, clearAuthError } = useApp();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // Navigate to home
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View>
      {authError && <Text>{authError}</Text>}
      {/* Login form */}
    </View>
  );
}
```

### Using API Client
```tsx
import { apiClient } from '@/services/authService';

export async function fetchUserData() {
  try {
    const data = await apiClient.request('/user/profile');
    return data;
  } catch (error) {
    if (error.message.includes('Session expired')) {
      // Handle forced logout
    }
  }
}
```

## How It Works

1. **First Request**: Checks if access token is expired
   - If not expired, uses current token
   - If expired, calls `refreshAccessToken()` which acquires a lock

2. **Token Refresh**: 
   - Sets `isRefreshing = true`
   - Makes `/auth/refresh` API call with refresh token
   - All other requests queue up while this happens

3. **Subsequent Requests During Refresh**:
   - Instead of making their own refresh calls, they wait in a queue
   - When refresh completes, all queued requests resolve with new token

4. **Refresh Failure**:
   - Clears all tokens
   - Rejects queued requests
   - Component catches error and forces logout

## Key Features

✅ **Prevents "token already used" errors** - Queue system ensures only one refresh at a time
✅ **Persistent Sessions** - Tokens stored in AsyncStorage survive app restarts
✅ **Automatic Token Refresh** - Handles expiration transparently
✅ **Secure** - Implements 5-minute buffer to prevent edge-case expirations
✅ **Error Recovery** - Forces logout on unrecoverable auth errors
✅ **Race Condition Protection** - Queue prevents concurrent refresh attempts

## Testing the Fix

1. Set a short token expiration time (e.g., 1 minute) for testing
2. Make multiple requests simultaneously
3. Verify they don't all try to refresh the token at once
4. Confirm token refresh happens cleanly once
