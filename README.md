# vue-photoswiper
Vue directive for [PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe).Javascript image gallery for mobile and desktop.

## Installation
```js
 npm install vue-photoswiper -S
```
Or
```
	yarm add vue-photoswiper -S
```


#Usage
Register
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