import React, {useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useFocusEffect} from '@react-navigation/native';
import Svg, {Path, Circle, Rect} from 'react-native-svg';

const BASE_URL = 'https://ddinggok.com';

type TabKey = 'community' | 'create' | 'library' | 'settings';

interface TabConfig {
  key: TabKey;
  label: string;
  view: string;
}

const TABS: TabConfig[] = [
  {key: 'community', label: '커뮤니티', view: 'community-view'},
  {key: 'create', label: '음악 만들기', view: 'create-view'},
  {key: 'library', label: '라이브러리', view: 'history-view'},
  {key: 'settings', label: '설정', view: 'settings-view'},
];

const TabIcon: React.FC<{tab: TabKey; active: boolean}> = ({tab, active}) => {
  const color = active ? '#10b981' : '#4A4560';
  const sw = 1.8;
  const props = {
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  switch (tab) {
    case 'community':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" {...props} />
          <Circle cx={9} cy={7} r={4} {...props} />
          <Path d="M22 21v-2a4 4 0 00-3-3.87" {...props} />
          <Path d="M16 3.13a4 4 0 010 7.75" {...props} />
        </Svg>
      );
    case 'create':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path d="M9 18V5l12-2v13" {...props} />
          <Circle cx={6} cy={18} r={3} {...props} />
          <Circle cx={18} cy={16} r={3} {...props} />
        </Svg>
      );
    case 'library':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Rect x={3} y={3} width={7} height={7} rx={1} {...props} />
          <Rect x={14} y={3} width={7} height={7} rx={1} {...props} />
          <Rect x={3} y={14} width={7} height={7} rx={1} {...props} />
          <Rect x={14} y={14} width={7} height={7} rx={1} {...props} />
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={3} {...props} />
          <Path
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
            {...props}
          />
        </Svg>
      );
  }
};

// JS to inject into WebView to switch tabs without page reload
const getSwitchTabJS = (view: string) => `
  (function() {
    if (typeof switchTab === 'function') {
      switchTab('${view}');
    }
  })();
  true;
`;

// JS to hide the web app's own bottom nav since we have our own
const HIDE_BNAV_JS = `
  (function() {
    var style = document.createElement('style');
    style.textContent = [
      '#bottom-nav { display: none !important; height: 0 !important; overflow: hidden !important; }',
      ':root { --bnav-h: 0px !important; }',
      '.main-wrap { padding-bottom: 0 !important; }',
      'body { padding-bottom: 0 !important; }',
      '.view { padding-bottom: 0 !important; }',
      '#mini-player { bottom: 0 !important; }',
      '#login-sheet-panel { bottom: 0 !important; transition: transform .35s cubic-bezier(.4,0,.2,1) !important; }',
    ].join(' ');
    document.head.appendChild(style);

    // Hide bnav element directly
    var bnav = document.getElementById('bottom-nav');
    if (bnav) bnav.style.display = 'none';

    // Patch openLoginSheet to position above mini-player when active
    var _origOpen = window.openLoginSheet;
    window.openLoginSheet = function() {
      if (_origOpen) _origOpen.apply(this, arguments);
      var panel = document.getElementById('login-sheet-panel');
      var mp = document.getElementById('mini-player');
      if (panel) {
        var mpVisible = mp && mp.classList.contains('on') && !mp.classList.contains('mp-hide');
        var bottomOffset = mpVisible ? mp.offsetHeight : 0;
        panel.style.bottom = bottomOffset + 'px';
      }
    };

    // Enable Kakao login button by injecting after Google button
    function enableKakaoLogin() {
      var panel = document.getElementById('login-sheet-panel');
      if (!panel) return;
      // Check if kakao button already exists
      if (panel.querySelector('[data-kakao-btn]')) return;
      // Find Google login button
      var googleBtn = panel.querySelector('button[onclick*="google"]');
      if (googleBtn) {
        var kakaoBtn = document.createElement('button');
        kakaoBtn.setAttribute('data-kakao-btn', 'true');
        kakaoBtn.onclick = function() { socialLogin('kakao'); };
        kakaoBtn.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;background:#FEE500;border:none;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;color:#3C1E1E;width:100%;transition:all .15s;';
        kakaoBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E" style="flex-shrink:0;"><path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.71 1.52 5.09 3.84 6.57L4.5 21l4.1-2.73A11.3 11.3 0 0 0 12 18.6c5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/></svg><span>카카오로 계속하기</span>';
        googleBtn.parentNode.insertBefore(kakaoBtn, googleBtn.nextSibling);
      }
    }
    enableKakaoLogin();

    // Observe DOM for late-rendered bottom nav + kakao button
    var observer = new MutationObserver(function() {
      var el = document.getElementById('bottom-nav');
      if (el) el.style.display = 'none';
      enableKakaoLogin();
    });
    observer.observe(document.body, {childList: true, subtree: true});
  })();
  true;
`;

export const BottomTabNavigator: React.FC = () => {
  const webViewRef = useRef<WebView>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('create');
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabPress = (tab: TabConfig) => {
    setActiveTab(tab.key);
    webViewRef.current?.injectJavaScript(getSwitchTabJS(tab.view));
  };

  // Handle Android back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [canGoBack]),
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* WebView */}
      <View style={styles.webviewContainer}>
        {isLoading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#7C3AED" />
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{uri: BASE_URL}}
          style={styles.webview}

          injectedJavaScriptBeforeContentLoaded={`
            (function() {
              // Force dark mode
              localStorage.setItem('kms_theme', 'dark');
              // Mark as native app
              window.__isKMSApp = true;
              // Hide bottom nav CSS
              var style = document.createElement('style');
              style.textContent = '#bottom-nav{display:none!important;height:0!important}:root{--bnav-h:0px!important}.main-wrap{padding-bottom:0!important}body{padding-bottom:0!important}#mini-player{bottom:0!important}#login-sheet-panel{bottom:0!important}';
              (document.head || document.documentElement).appendChild(style);
            })();
            true;
          `}
          injectedJavaScript={HIDE_BNAV_JS}
          onLoadEnd={() => {
            setIsLoading(false);
            // Re-apply hide + force dark mode
            webViewRef.current?.injectJavaScript(HIDE_BNAV_JS);
            webViewRef.current?.injectJavaScript(`
              (function() {
                localStorage.setItem('kms_theme', 'dark');
                document.body.removeAttribute('data-theme');
                window.__isKMSApp = true;
              })();
              true;
            `);
            // Switch to default tab
            webViewRef.current?.injectJavaScript(
              getSwitchTabJS('create-view'),
            );
          }}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          mixedContentMode="compatibility"
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
          userAgent="Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 KMSApp/1.0"
          forceDarkOn={false}
        />
      </View>

      {/* Bottom Tab Bar - matching web app design */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}>
              <TabIcon tab={tab.key} active={isActive} />
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
    zIndex: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 10, 15, 0.97)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 12,
    paddingTop: 9,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A4560',
  },
  tabLabelActive: {
    color: '#10b981',
  },
});
