import previewComponent from './preview.vue'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

let $preview
var vuePhotoPreview = {
	install(Vue, opts) {
		const Preview = Vue.extend(previewComponent)
		var opts = opts || {}
		if (!$preview) {
			$preview = new Preview({
				el: document.createElement('div')
			})
			document.body.appendChild($preview.$el)
		}

		Vue.directive('preview', {
			bind: function(el, binding, vnode) {
				initPhotoSwipeFromDOM(el,{},binding.value)
			}
		})

	}
}
/* eslint-disable */
function initPhotoSwipeFromDOM(galleryElement, opts = {}, group) {

	var parseThumbnailElements = function(thumbElements) {
		var items = [],
			el,
			load = 0,
			item;
		item = {}
		for (var i = 0; i < thumbElements.length; i++) {
			el = thumbElements[i];

			// include only element nodes 
			if (el.nodeType !== 1) {
				continue;
			}


			if (typeof el.naturalWidth == "undefined") {　　 // IE 6/7/8
				　　
				var i = new Image();　　
				i.src = el.src;　　
				var rw = i.width;　　
				var rh = i.height;
			} else {　　 // HTML5 browsers
				　　
				var rw = el.naturalWidth;　　
				var rh = el.naturalHeight;
			}

			item = {
				title: el.getAttribute('preview-text'),
				el: el,
				src: el.getAttribute('src'),
				w: rw,
				h: rh,
				author: el.getAttribute('data-author'),
				o: {
					src: el.getAttribute('src'),
					w: rw,
					h: rh,
				},
				m: {
					src: el.getAttribute('src'),
					w: rw,
					h: rh,
				}
			};
			items.push(item);
		}
		return items
	}


	var onThumbnailsClick = function(e) {
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;

		var eTarget = e.target || e.srcElement;


		var thumbElements;
		var group = eTarget.getAttribute('preview')
		if (group) {
			thumbElements = document.querySelectorAll('img[preview="' + group + '"]')
		} else {
			thumbElements = document.querySelectorAll('img.preview')
		}

		var index;

		for (var i = 0; i < thumbElements.length; i++) {
			if (thumbElements[i] === eTarget) {
				index = i;
				break;
			}
		}
		if (index >= 0) {
			openPhotoSwipe(index, thumbElements);
		}
		return false;
	};

	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
			params = {};

		if (hash.length < 5) { // pid=1
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}

		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = document.querySelectorAll('.pswp')[0],
			gallery,
			options,
			items;
		if (!pswpElement) {
			pswpElement = document.createElement('div')
			pswpElement.className = 'pswp'
			document.body.appendChild(pswpElement)
		}
		var items = parseThumbnailElements(galleryElement);
		options = {

			//galleryUID: galleryElement.getAttribute('data-pswp-uid'),

			getThumbBoundsFn: function() {
				var thumbnail = items[index].el,
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					rect = thumbnail.getBoundingClientRect();

				return {
					x: rect.left,
					y: rect.top + pageYScroll,
					w: rect.width
				};
			},

			addCaptionHTMLFn: function(item, captionEl, isFake) {
				if (!item.title) {
					captionEl.children[0].innerText = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title;
				return true;
			},
			showHideOpacity: true,
			history: false,
			shareEl: false,


		};

		if (fromURL) {
			if (options.galleryPIDs) {
				// parse real index when custom PIDs are used 
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for (var j = 0; j < items.length; j++) {
					if (items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		// exit if index not found
		if (isNaN(options.index)) {
			return;
		}
		options = extend(options, opts)


		if (disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

		// see: http://photoswipe.com/documentation/responsive-images.html
		var realViewportWidth,
			useLargeImages = false,
			firstResize = true,
			imageSrcWillChange;

		gallery.listen('beforeResize', function() {

			var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
			dpiRatio = Math.min(dpiRatio, 2.5);
			realViewportWidth = gallery.viewportSize.x * dpiRatio;

			if (realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
				if (!useLargeImages) {
					useLargeImages = true;
					imageSrcWillChange = true;
				}

			} else {
				if (useLargeImages) {
					useLargeImages = false;
					imageSrcWillChange = true;
				}
			}

			if (imageSrcWillChange && !firstResize) {
				gallery.invalidateCurrItems();
			}

			if (firstResize) {
				firstResize = false;
			}

			imageSrcWillChange = false;

		});

		gallery.listen('gettingData', function(index, item) {
			if (useLargeImages) {
				item.src = item.o.src;
				item.w = item.o.w;
				item.h = item.o.h;
			} else {
				item.src = item.m.src;
				item.w = item.m.w;
				item.h = item.m.h;
			}
		});

		gallery.init();
	};

	var extend = function(o1, o2) {
		for (var prop in o2) {
			o1[prop] = o2[prop];
		}
		return o1
	};

	// select all gallery elements
	// var galleryElements = document.querySelectorAll(gallerySelector);
	// for (var i = 0, l = galleryElements.length; i < l; i++) {
	// 	galleryElements[i].setAttribute('data-pswp-uid', i + 1);
	// 	galleryElements[i].onclick = onThumbnailsClick;
	// }
	//galleryElement.setAttribute('data-pswp-uid', i + 1);
	galleryElement.onclick = onThumbnailsClick;

	galleryElement.classList.add('preview')

	if(group){
		galleryElement.setAttribute('preview',group)	
	}
	

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();

};


export default vuePhotoPreview

if (typeof window !== 'undefined' && !window.vuePhotoPreview) {
	window.vuePhotoPreview = vuePhotoPreview;
}
/* eslint-disable */