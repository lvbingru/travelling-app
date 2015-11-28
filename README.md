# travelling-app

## 环境搭建

根据 [React Native Getting Started 文档](https://facebook.github.io/react-native/docs/getting-started.html) 安装 Node.js, Homebrew, watchman 等开发工具。

另外，安装 [cocoapods](https://cocoapods.org/)。安装 cocoapods 之前要更换 gem 源，改成 [淘宝的源](https://ruby.taobao.org/):

```sh
$ gem sources --add https://ruby.taobao.org/ --remove https://rubygems.org/
$ gem sources -l
*** CURRENT SOURCES ***

https://ruby.taobao.org

$ sudo gem install cocoapods
```


安装 npm 依赖：

```sh
$ npm install
```

安装 Pods（iOS 原生组件依赖）：

```sh
$ cd ios && pods install --verbose
```

使用 xcode 打开 `ios/AwesomeProject.xcworkspace`，编译运行。

## 打包开发版本 App

修改 `AppDelegate.m` 当中的 `jsCodeLocation`，切换成使用打包好的 js 代码的加载方式。

```js
// jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios"];

jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
```

接下来就是普通的打包流程了。参考官方文档 [Exporting Your App for Testing](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/TestingYouriOSApp/TestingYouriOSApp.html)