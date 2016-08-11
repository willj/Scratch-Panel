# Scratch-Panel
A canvas based scratch panel/scratch card.

Sample: http://www.madebywill.net/Scratch-Panel/sample/

## Minimal Usage

```
var sp = ScratchPanel({
  elementId: "scratch-container",     // The ID of a div or other element to create the scratch panel in
  foreground: "fg.png",               // An image for the scratchable surface
  background: "bg.png"                // An image to show behind - this is optional
});
```

## All options

### elementId (default: "scratch-panel")

The HTML element ID you want to place the scratch panel in. The panel will fill this element (both width and height should be set on it).
By default it will look for an element with id **scratch-panel** `<div id="scratch-panel"></div>`.

### threshold (default: 65)

Percentage of the surface that should be scratched to trigger the callback and clear the rest of the panel.

### callback (default: null)

A callback function that gets triggered once the threshold is reached

### readyCallback (default: null)

A callback function that gets triggered once the scratch panel has been loaded, the foreground image has been loaded and drawn, and the background image has been applied.

### foreground (default: "")

The url to an image to use as the scratch surface. 

### background (default: "")

The url to an image to show behind the scratch panel. This is applied as a CSS background to the container you specify with **elementId**.

### crossOrigin (default: "")
Allowed values: `""`, `"anonymous"`, `"use-credentials"`

If you specify an externally hosted foreground image you'll need to load this with CORS as it's drawn on an HTML Canvas element.

For more info on CORS see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image

### scratchSize (default: 40)

The diameter of the circle/brush used to scratch

### enabled (default: true)

Should the scratch panel be enabled by default?

### backgroundLoadDelay (default: 300)

The delay in milliseconds applied after loading the foreground image and before attaching the CSS background image. This is a precaution so the background isn't visible before foreground has been drawn. Because the foreground image has been downloaded before the background is added, this probably isn't required.

## Methods

### getPercentScratched()

Returns the percent of the scratch panel that has been scratched.

### clear()

Clears the foreground image (as if the whole panel had been scratched).

### setOption(key, value)

Set an option value. This will not have any (useful) effect on options used in the initialisation, such as foreground, background or elementId, but will change the value that's returned by **getOption()**

It can be used to change the following options:
- threshold
- scratchSize
- enabled

### getOption(key)

Returns an option value.


```
var sp = ScratchPanel({
  elementId: "scratch-container", 
  foreground: "fg.png",              
  background: "bg.png",
  enabled: false          // disabled by default
});

sp.setOption("enabled", true);  // enabled at a later time
var p = sp.getPercentScratched();
sp.clear();
sp.getOption("elementId");
```
