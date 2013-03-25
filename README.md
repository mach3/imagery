# Imagery

画像やボタン用のユーティリティライブラリ。

## 特徴

- クラシック環境の為の透過PNG処理
- スワップボタン
- ブレンドボタン
- トグルボタン実装の為のユーティリティ

## 使い方

```html
<img src="image.png" id="my-image" />
```


```javascript
$("#my-image").imagery("alpha");
```

$.fn.imagery() にメソッド名（ここでは"alpha"）を渡して処理を行います。

メソッドに引数を渡す場合は第二引数以降にて。

```javascript
$("#my-image").imagery("swapImage", "image-hover.png");
```

メソッドはカンマ区切りで列挙でき、順次処理されます。

```javascript
$("#my-image").imagery("alpha, swapButton");
```

img要素だけでなく、background-imageに画像を設定したブロック要素でも使用できます。

## メソッド

### alpha(opacity)

AlphaImageLoaderでクラシックIE環境の為の透過PNG処理を行う。

- opacity : Integer


### swapImage(src)

画像ソースを差し替える

- src : String


### swapButton(option)

マウスオーバーで画像を切り替えるボタンを設定する

- option : Object
	* preloadHover
	* preloadActive

### blendButton(option)

マウスオーバーで画像がブレンドするボタンを設定する

- option : Object
	* preloadHover
	* preloadActive
	* enterEasing
	* enterDuration
	* leaveEasing
	* leaveDuration

### activate()

要素をアクティブ化する。アクティブ化された要素はアクティブ時の画像に差し替えられ、`swapButton`と`blendButton`のホバー効果は無効化される。  
トグルボタン実装での使用を想定。


### deactivate()

要素をでアクティブ化する。`activate()`の逆。


## コンフィグ

次項のオプションを初期設定から変更する場合は $.imageryConfig() を使用します。

```javascript
$.imageryConfig({
	blankGif : "./assets/img/blank.gif",
	preloadActive : false
});
```

一部のメソッドは、オプションを引数に渡す事で処理時のみオーバーライドする事ができます。
但し、オーバーライド出来るのは一部のオプションのみです。（前項参照）

```javascript
$("#my-image").imagery("swapButton", {
	preloadActive : false
});
```

## オプション

### パス/ファイル名

- blankGif : String ("./blank.gif") - 透過Gifファイルへのパス
- hoverSuffix : String ("-hover") - マウスオーバー時のファイルの接尾辞
- activeSuffix : String ("-active") - アクティブ時のファイルの接尾辞

### アニメーション（blendButton）

- enterEasing : String ("swing") - マウスオーバー時のイージング関数名
- enterDuration : Integer (100) - マウスオーバー時のアニメーション時間
- leaveEasing : String ("swing") - マウスアウト時のイージング関数名
- leaveDuration : Integer (500) - マウスアウト時のアニメーション時間

### プリロード

- preloadHover : Boolean (true) - マウスオーバー画像のプリロードをする/しない
- preloadActive : Boolean (true) - アクティブ画像のプリロードをする/しない


## インスタンスの参照

Imageryのインスタンスは `$.imagery` として参照できます。下記はプリロード機能を単体で使用する例。

```
$.imagery.preload(["foo.png", "bar.png", "baz.png"], function(){
	console.log("Images are loaded.");
});
```


## 作者

mach3

- [Website](http://www.mach3.jp)
- [Blog](http://blog.mach3.jp)
- [Twitter](http://twitter.com/mach3ss)
