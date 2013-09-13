# slide

To use slide you must do the following

1. Include zepto.js, nova.ui.js, nova.slide.js in your html file

2. Include nova.slide.css or copy the required styles in nova.slide.css into your css file

3. Create a div with the content inside you want to page between. You must set the height and width of this div, alone with position: relative

``` html
<div class="my_slider">
    <div class="slide-cont">
        <div class="cont-item">page1</div>
        <div class="cont-item">page2</div>
    </div>
</div>
```

4. If you want the dots to show up for paging, create the div with class "slide-control"

``` html
<div class="my_slider">
    <div class="slide-cont">
        <div class="cont-item">page1</div>
        <div class="cont-item">page2</div>
    </div>
    <div class="slide-control">
        <a class="control-item"></a>
        <a class="control-item"></a>
    </div>
</div>
```

5. Call the javascript function to create the slider

``` js
var slide = new Slide('.my_slider');
```

There are additional configuration options that are passed in as an object parameter

``` js
var config = {
    index: 0, 				// first selected item index
    count: 6, 				// item count
    recursive: true, 		// whether the sliding is recursive
    autoplay: true, 		// whether to autoplay
    interval_ms: 10000, 	// autoplay interval
    duration_ms: 200, 		// time cost by one slide

    contentsSelector: '.slide-cont .cont-item', 		
    controlsSelector: '.slide-control .control-item', 
    activeClassName: 'active'
}; 	
var slide = new Slide('.my_slider', config);
```
There are two functions for switching on/off autoplay
``` js
slide.startAutoplay();
slide.stopAutoplay();
```
