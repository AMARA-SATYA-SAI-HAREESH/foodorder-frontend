import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// Handle notifications when app is in foreground
messaging().onMessage(async remoteMessage => {
  console.log('📱 FCM Message:', remoteMessage);
  
  if (remoteMessage.data?.type === 'DELIVERY_OTP') {
    // Show OTP to user
    Alert.alert(
      '🚚 Delivery OTP',
      `Your OTP is: ${remoteMessage.data.otp}\nGive this to delivery driver`,
      [
        {
          text: 'Copy OTP',
          onPress: () => {
            Clipboard.setString(remoteMessage.data.otp);
            Alert.alert('OTP Copied!', 'Paste to driver');
          }
        },
        { text: 'OK', style: 'default' }
      ]
    );
  }
});

// Handle notification tap when app is in background/quit
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📱 Background Message:', remoteMessage);
  return Promise.resolve();
});

// Request permission
export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('✅ Notification permission granted');
    return true;
  }
  return false;
};