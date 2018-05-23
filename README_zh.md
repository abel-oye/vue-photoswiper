# vue-photoswipe
vue照片预览指令

![mobile](https://github.com/river-lee/vue-photoswiper/blob/master/screenshot/mobile.png)
![desktop](https://github.com/river-lee/vue-photoswiper/blob/master/screenshot/desktop.png)

## 安装
```js
npm install vue-photoswiper -S
```
或者
```
yarm add vue-photoswiper -S
```


## 使用

注册全局指令
```js
import Vue from 'vue'
import vuePhotoswiper from 'vuePhotoswiper'

Vue.use(vuePhotoswiper)

new Vue({
	/// some options
})

```

```html
	<img src="https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg" alt="" v-preview="1" style="width:200px">
```

图片组
```html
	<img src="https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg" alt="" v-preview="1" style="width:200px">
	<img src="https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg" alt="" v-preview="1" style="width:200px">
	<img src="https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg" alt="" v-preview="2" style="width:200px">
	<img src="https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg" alt="" v-preview="2" style="width:200px">
```