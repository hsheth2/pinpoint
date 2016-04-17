// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'hsheth.pinpoint',
  name: 'pinpoint',
  description: '',
  author: 'author',
  email: 'contact@example.com',
  website: 'http://example.com'
});

// Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'icons/Icon.png',
  'iphone_2x': 'icons/Icon-60@2x.png',
  // ... more screen sizes and platforms ...
  'android_xhdpi': 'icons/xhdpi.png'
});

App.launchScreens({
    'iphone6': 'splash/splash_ios.png',
  // ... more screen sizes and platforms ...
    'android_hdpi_portrait': 'splash/splash_android.png',
});

/*// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');

// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '1234567890',
  API_KEY: 'supersecretapikey'
});*/

App.accessRule("*");