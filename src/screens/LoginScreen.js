import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

const registerFCMToken = async (userId, token) => {
  try {
    await fetch('http://YOUR_BACKEND_URL/api/users/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: userId,
        fcmToken: await messaging().getToken()
      })
    });
    console.log('✅ FCM token registered');
  } catch (error) {
    console.error('❌ FCM registration failed:', error);
  }
};

// Call this after user logs in
registerFCMToken(userId, userToken);