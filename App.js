// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, BackHandler, ScrollView, RefreshControl, Text, View, TouchableOpacity } from 'react-native';
import * as React from 'react';
import {useState} from 'react';
import { WebView } from 'react-native-webview';
import * as Device from 'expo-device';
import { StatusBar } from 'expo-status-bar';

const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];
function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
function close() {
  Alert.alert("Panda를 종료하시겠습니까?", "확인을 누르면 종료합니다.", [
    {
      text: "취소",
      onPress: () => { },
      style: "cancel",
    },
    {
      text: "확인",
      onPress: () => {
        BackHandler.exitApp();
        return true;
      }
    },
  ]);
}
export default function App() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
  const [statusBarTransition, setStatusBarTransition] = useState(
    TRANSITIONS[0],
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    webview.current.reload();
    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  let state = {
    url: "",
    canGoBack: false
  };
  let webview = React.createRef();
  const handleBackButton = () => {
    if (state.canGoBack) {
      if (state.url === 'http://panda1562.iptime.org:8000/pages/loginPage' || state.url === 'http://panda1562.iptime.org:8000/loginHome') {
        if (Device.brand !== 'Apple') {
          close();
        }
      } else {
        webview.current.goBack();
      }
    } else {
      if (Device.brand !== 'Apple') {
        close();
      }
    }
    return true;
  }
  
  BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  console.log(Device.modelName);
  if (Device.brand === 'Apple') {
    if (Device.modelName.includes("16") || Device.modelName.includes("15,1")) {
      return (
        <View style={div_styles.root}>
          <ScrollView
            style={styles_apple_d.ScrollStyle}
            contentContainerStyle={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh} // exl in function : this.yourWebview.reload();
              />
            }>
            <WebView
              style={styles_apple_d.container}
              source={{ uri: 'http://panda1562.iptime.org:8000/pages/loginPage' }}
              ref={webview}
              onNavigationStateChange={(navState) => {
                //console.log(navState)
                state.url = navState.url;
                state.canGoBack = navState.canGoBack;
              }}
              originWhitelist={['*']}
              sharedCookiesEnabled={true}
              thirdPartyCookiesEnabled={true}
              cacheEnabled={false}
              cacheRnabled={false}
              incognito={false}
            />
          </ScrollView>
          <View style={styles_apple_d.back}>
            <TouchableOpacity onPress={handleBackButton} activeOpacity={0.8} style={styles_apple_d.button}>
              <Text style={styles_apple_d.text}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={div_styles.root}>
          <ScrollView
            style={styles_apple.ScrollStyle}
            contentContainerStyle={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh} // exl in function : this.yourWebview.reload();
              />
            }>
            <WebView
              style={styles_apple.container}
              source={{ uri: 'http://panda1562.iptime.org:8000/pages/loginPage' }}
              ref={webview}
              onNavigationStateChange={(navState) => {
                state.url = navState.url;
                state.canGoBack = navState.canGoBack;
              }}
              // onShouldStartLoadWithRequest={request=>{
              //   if(request.url.includes('https') || request.url.includes('http')){
              //     state.url = navState.url;
              //     state.canGoBack = navState.canGoBack;
              //     return false;
              //   }else return true;
              // }}
              setSupportMultipleWindows={false}
              sharedCookiesEnabled={true}
              thirdPartyCookiesEnabled={true}
              cacheEnabled={false}
              cacheRnabled={false}
              incognito={false}
            />
          </ScrollView>
          <View style={styles_apple_d.back}>
            <TouchableOpacity onPress={handleBackButton} activeOpacity={0.8} style={styles_apple_d.button}>
              <Text style={styles_apple_d.text}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  } else {
    return (
      <View style={div_styles.root}>
        <StatusBar
          hidden={true}
          animated={true}
          backgroundColor={'transparent'}
          translucent
          barStyle={statusBarStyle}
          showHideTransition={statusBarTransition}
        />
        <WebView
          nestedScrollEnabled={true}
          pullToRefreshEnabled={true}
          allowFileAccess={true}
          style={styles_android.container}
          source={{ uri: 'http://panda1562.iptime.org:8000/pages/loginPage' }}
          ref={webview}
          // sharedCookiesEnabled={true}
          // thirdPartyCookiesEnabled={true}
          // cacheEnabled={false}
          // cacheRnabled={false}
          // incognito={false}
          onNavigationStateChange={(navState) => {
            state.url = navState.url;
            state.canGoBack = navState.canGoBack;
          }}
          // onShouldStartLoadWithRequest={request=>{
          //   if(request.url.includes('https') || request.url.includes('http')){
          //     state.url = navState.url;
          //     state.canGoBack = navState.canGoBack;
          //     return false;
          //   }else return true;
          // }}
          setSupportMultipleWindows={false}
          onScroll={syntheticEvent => {
            const { contentOffset } = syntheticEvent.nativeEvent
            console.table(contentOffset)
          }}
        />
        <View style={styles_android.back}>
          <TouchableOpacity onPress={onRefresh} activeOpacity={0.8} style={styles_android.button}>
            <Text style={styles_android.text}>refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}
const div_styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#333',
  }
})
const styles_apple = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ScrollStyle: {
    marginTop: 30,
    backgroundColor: 'white',
    position: 'relative',
  }
});
const styles_apple_d = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    backgroundColor: '#aaa',
    opacity : 0.5,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  button: {
    width: 100,
    height: 50,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    backgroundColor: '#000',
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: '#fff'
  },
  ScrollStyle: {
    marginTop: 48,
    backgroundColor: 'white',
    position: 'relative',
  }
});
const styles_android = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    backgroundColor: '#aaa',
    opacity : 0.5,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  button: {
    width: 80,
    height: 50,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    backgroundColor: '#000',
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: '#fff'
  },
});
