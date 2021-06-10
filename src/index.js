/*
 * LightningChartJS example that showcases creation of a custom cursor in ChartXY.
 *
 * This variant uses LCJS UI components to display the cursor components. The cursor logic is also implemented using LCJS events and methods.
 */

// Import LightningChartJS
const lcjs = require("@arction/lcjs");

// Import data-generators from 'xydata'-library.
const { createProgressiveTraceGenerator } = require("@arction/xydata");

// Extract required parts from LightningChartJS.
const {
  lightningChart,
  AutoCursorModes,
  UIElementBuilders,
  UILayoutBuilders,
  UIBackgrounds,
  ColorHEX,
  ColorCSS,
  SolidFill,
  SolidLine,
  UIOrigins,
  translatePoint,
  Themes,
} = lcjs;

// colors of the series
const colors = ["#fc03f0", "#1cb843", "#595cff", "#0955ff", "#500c3f"];

// Create a XY Chart.
const chart = lightningChart()
  .ChartXY({
    // theme: Themes.dark
  })
  // Disable native AutoCursor to create custom
  .setAutoCursorMode(AutoCursorModes.disabled)
  .setTitle("Custom Cursor using LCJS UI");

// set title for Y axis
chart.getDefaultAxisY().setTitle("Y-axis");

// generate data and creating the series
const series = new Array(3).fill(0).map((_, iSeries) => {
  const nSeries = chart.addLineSeries().setStrokeStyle(
    new SolidLine({
      fillStyle: new SolidFill({ color: ColorHEX(colors[iSeries]) }),
      thickness: 2,
    })
  );

  createProgressiveTraceGenerator()
    .setNumberOfPoints(200)
    .generate()
    .toPromise()
    .then((data) => {
      return nSeries.add(data);
    });
  return nSeries;
});

// Create UI elements for custom cursor.
const resultTable = chart
  .addUIElement(
    UILayoutBuilders.Column.setBackground(UIBackgrounds.Rectangle),
    {
      x: chart.getDefaultAxisX(),
      y: chart.getDefaultAxisY(),
    }
  )
  .setMouseInteractions(false)
  .setOrigin(UIOrigins.LeftBottom)
  .setMargin(5)
  .setBackground((background) =>
    background.setStrokeStyle(
      new SolidLine({
        thickness: 1,
        fillStyle: new SolidFill({ color: ColorCSS("gray") }),
      })
    )
  );

const rowX = resultTable
  .addElement(UILayoutBuilders.Row)
  .addElement(UIElementBuilders.TextBox)
  .setTextFont((font) => font.setSize(14))
  .setTextFillStyle(new SolidFill({ color: ColorCSS("gray") }));

const rowsY = series.map((el, i) => {
  return resultTable
    .addElement(UILayoutBuilders.Row)
    .addElement(UIElementBuilders.TextBox)
    .setTextFont((font) => font.setSize(14))
    .setTextFillStyle(new SolidFill({ color: ColorHEX(colors[i]) }));
});

const tickX = chart
  .getDefaultAxisX()
  .addCustomTick()
  .setGridStrokeStyle(
    new SolidLine({
      thickness: 1,
      fillStyle: new SolidFill({ color: ColorCSS("gray") }),
    })
  );

const ticksY = series.map((el) => {
  return chart
    .getDefaultAxisY()
    .addCustomTick()
    .setGridStrokeStyle(
      new SolidLine({
        thickness: 1,
        fillStyle: new SolidFill({ color: ColorCSS("gray") }),
      })
    );
});

// Hide custom cursor components initially.
resultTable.dispose();
tickX.dispose();
ticksY.forEach((tick) => tick.dispose());

// Implement custom cursor logic with events.
chart.onSeriesBackgroundMouseMove((_, event) => {
  const mouseLocationClient = { x: event.clientX, y: event.clientY };
  // Translate mouse location to LCJS coordinate system for solving data points from series, and translating to Axes.
  const mouseLocationEngine = chart.engine.clientLocation2Engine(
    mouseLocationClient.x,
    mouseLocationClient.y
  );

  // Translate mouse location to Axis.
  const mouseLocationAxis = translatePoint(
    mouseLocationEngine,
    chart.engine.scale,
    series[0].scale
  );

  // Solve nearest data point to the mouse on each series.
  const nearestDataPoints = series.map((el) =>
    el.solveNearestFromScreen(mouseLocationEngine)
  );

  // Find the nearest solved data point to the mouse.
  const nearestPoint = nearestDataPoints.reduce((prev, curr, i) => {
    if (!prev) return curr;
    if (!curr) return prev;
    return Math.abs(mouseLocationAxis.y - curr.location.y) <
      Math.abs(mouseLocationAxis.y - prev.location.y)
      ? curr
      : prev;
  });

  if (nearestPoint) {
    // Set custom cursor location.
    resultTable.setPosition({
      x: nearestPoint.location.x,
      y: nearestPoint.location.y,
    });

    // Change origin of result table based on cursor location.
    if (
      nearestPoint.location.x >
      chart.getDefaultAxisX().getInterval().end / 1.5
    ) {
      if (
        nearestPoint.location.y >
        chart.getDefaultAxisY().getInterval().end / 1.5
      ) {
        resultTable.setOrigin(UIOrigins.RightTop);
      } else {
        resultTable.setOrigin(UIOrigins.RightBottom);
      }
    } else if (
      nearestPoint.location.y >
      chart.getDefaultAxisY().getInterval().end / 1.5
    ) {
      resultTable.setOrigin(UIOrigins.LeftTop);
    } else {
      resultTable.setOrigin(UIOrigins.LeftBottom);
    }

    // Format result table text.
    rowX.setText(`X: ${nearestPoint.location.x.toFixed(1)}`);
    rowsY.map((rowY, i) => {
      rowY.setText(`Y${i}: ${nearestDataPoints[i].location.y.toFixed(2)}`);
    });

    // Position custom ticks.
    tickX.setValue(nearestPoint.location.x);
    ticksY.forEach((tick, i) => {
      tick.setValue(nearestDataPoints[i].location.y || 0);
    });

    // Display cursor.
    resultTable.restore();
    tickX.restore();
    ticksY.map((el) => el.restore());
  } else {
    // Hide cursor.
    resultTable.dispose();
    tickX.dispose();
    ticksY.map((el) => el.dispose());
  }
});

chart.onSeriesBackgroundMouseLeave((_, e) => {
  resultTable.dispose();
  tickX.dispose();
  ticksY.map((el) => el.dispose());
});

chart.onSeriesBackgroundMouseDragStart((_, e) => {
  resultTable.dispose();
  tickX.dispose();
  ticksY.map((el) => el.dispose());
});
