import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';

const Ads = () => {
  useEffect(() => {
    const setupAd = async () => {
      await setTestDeviceIDAsync('EMULATOR'); // Chỉ sử dụng khi test
      AdMobInterstitial.setAdUnitID('ca-app-pub-4777214646009874/2684457409'); // Mã đơn vị quảng cáo
    };

    setupAd();
  }, []);

  const showInterstitialAd = async () => {
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Hiển thị quảng cáo trung gian" onPress={showInterstitialAd} />
    </View>
  );
};

export default Ads;
