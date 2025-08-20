# JavaScript Custom Cursor Chart

![JavaScript Custom Cursor Chart](CustomCursor-darkGold.png)

This demo application belongs to the set of examples for LightningChart JS, data visualization library for JavaScript.

LightningChart JS is entirely GPU accelerated and performance optimized charting library for presenting massive amounts of data. It offers an easy way of creating sophisticated and interactive charts and adding them to your website or web application.

The demo can be used as an example or a seed project. Local execution requires the following steps:

-   Make sure that relevant version of [Node.js](https://nodejs.org/en/download/) is installed
-   Open the project folder in a terminal:

          npm install              # fetches dependencies
          npm start                # builds an application and starts the development server

-   The application is available at _http://localhost:8080_ in your browser, webpack-dev-server provides hot reload functionality.


## Description

This example serves as an example for creating a custom cursor for XY charts.

Custom cursors can be required for different purposes - like major structural changes or very application specific styling requirements.

If lesser changes to default cursors are required then please see read about different methods of configuring cursor behavior - Features > Cursor section in Developer documentation is a good reference.

All charts expose a simple method: `setCustomCursor` which can be conveniently used to firstly disable the built-in cursor and secondly trigger an automatic callback whenever the cursor should be displayed or hidden, with all information about the pointed data prepared beforehand.

Thanks to this, regardless how you want to display your custom cursor, it is extremely easy to plug it to LCJS.

```ts
ChartXY.setCustomCursor((chart, hit, hits) => {
    // hit : { x, y, series, axisX, axisY, ... }
    // hits contain information of all cursor hits in case of multi series cursors
})
```

In this example, the cursor is displayed using UI textboxes and a custom tick on the time axis.

More custom cursor examples can be found by looking for "cursor" tag in the _Interactive Examples_ gallery - for example, using HTML & CSS for an animated result table or connecting to an UI framework.


## API Links

* [Lightning Chart top reference]
* [UI element builders]
* [UI layout builders]
* [UI backgrounds]
* [UI position origin]
* [Color factory hexadecimal]
* [Color factory css]
* [Solid fill style]
* [Solid line style]
* [Chart XY]
* [Axis XY]
* [Custom tick]


## Support

If you notice an error in the example code, please open an issue on [GitHub][0] repository of the entire example.

Official [API documentation][1] can be found on [LightningChart][2] website.

If the docs and other materials do not solve your problem as well as implementation help is needed, ask on [StackOverflow][3] (tagged lightningchart).

If you think you found a bug in the LightningChart JavaScript library, please contact sales@lightningchart.com.

Direct developer email support can be purchased through a [Support Plan][4] or by contacting sales@lightningchart.com.

[0]: https://github.com/Arction/
[1]: https://lightningchart.com/lightningchart-js-api-documentation/
[2]: https://lightningchart.com
[3]: https://stackoverflow.com/questions/tagged/lightningchart
[4]: https://lightningchart.com/support-services/

© LightningChart Ltd 2009-2025. All rights reserved.


[Lightning Chart top reference]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/interfaces/LightningChart.html
[UI element builders]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/variables/UIElementBuilders.html
[UI layout builders]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/variables/UILayoutBuilders.html
[UI backgrounds]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/variables/UIBackgrounds.html
[UI position origin]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/variables/UIOrigins.html
[Color factory hexadecimal]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/functions/ColorHEX.html
[Color factory css]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/functions/ColorCSS.html
[Solid fill style]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/classes/SolidFill.html
[Solid line style]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/classes/SolidLine.html
[Chart XY]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/classes/ChartXY.html
[Axis XY]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/classes/Axis.html
[Custom tick]: https://lightningchart.com/js-charts/api-documentation/v8.0.1/classes/CustomTick.html

