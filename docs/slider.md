---
layout: widget
---

# slide 

## Example
### Please imulate touch events

<link rel="stylesheet" href="{{site.baseurl}}nova/slide/slide.css?t={{site.time | date: "%H%M%S"}}" />
<div>
<style type="text/css">
    .nova-slide {
        height: 276px;
    }
</style>
</div>

<div class="nova-slide" >
    <div class="slide-cont">
        <div class="cont-item">
            <img src="{{site.baseurl}}images/1.jpg" alt="" />
        </div>
        <div class="cont-item">
            <img src="{{site.baseurl}}images/2.jpg" alt="" />
        </div>
        <div class="cont-item">
            <img src="{{site.baseurl}}images/3.jpg" alt="" />
        </div>
    </div>
    <div class="slide-control">
        <a href="#" class="control-item"></a> 
        <a href="#" class="control-item"></a> 
        <a href="#" class="control-item"></a> 
    </div>
</div>
<script type="text/javascript" src="{{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript" src="{{site.baseurl}}nova/slide/carousel.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript">
    var slide = new Slide('.nova-slide', {autoplay: true});
    
    // Adjust height when window is resized
    var ratio = 0.66;   // height / width
    var novaSlide = $('.nova-slide');
    $(window).on('resize DOMContentLoaded', function() {
        var width = novaSlide.width();
        novaSlide.height(width * ratio); 
    })
</script>
<br />

## Resources

### CSS

    <link rel="stylesheet" href="link[slide.css]({{site.baseurl}}nova/slide/slide.css?t={{site.time | date: "%H%M%S"}})">

Include nova.slide.css or copy the required styles from it.

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="link[widget.js]({{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}})"></script>
    <script src="link[carousel.js]({{site.baseurl}}nova/slide/carousel.js?t={{site.time | date: "%H%M%S"}})"></script>

## Usage

    <!-- the viewport -->
    <div class="nova-slide" >
        <!-- the slider -->
        <div class="slide-cont">
            <!-- the slider item-->
            <div class="cont-item">
                <img src="1.jpg" alt="" />
            </div>
            <div class="cont-item">
                <img src="2.jpg" alt="" />
            </div>
            <div class="cont-item">
                <img src="3.jpg" alt="" />
            </div>
        </div>
        <!-- the control -->
        <div class="slide-control">
            <a href="#" class="control-item"></a> 
            <a href="#" class="control-item"></a> 
            <a href="#" class="control-item"></a> 
        </div>
    </div>

    <!-- construct the slider -->
    <script type="text/javascript">
        var slide = new Slide('.nova-slide', {autoplay: true});
    </script>

## Configuration

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
    var slide = new Slide('.my-slider', config);

## Methods

    slide.next();               // Slide to the next item
    slide.prev();               // Slide to the previous item
    slide.go(1);                // Slide to the item with index
    slide.startAutoplay();      // Start auto slide
    slide.stopAutoplay();       // Stop auto slide

