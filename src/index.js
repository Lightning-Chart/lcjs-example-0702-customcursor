/*
 * LightningChartJS example that showcases creation of a custom cursor in ChartXY.
 *
 * This variant uses LCJS UI components to display the cursor components. The cursor logic is also implemented using LCJS events and methods.
 */

// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Import data-generators from 'xydata'-library.
const { createProgressiveTraceGenerator } = require('@arction/xydata')

// Extract required parts from LightningChartJS.
const { lightningChart, AutoCursorModes, UIElementBuilders, UILayoutBuilders, UIOrigins, Themes } = lcjs

// Create a XY Chart.
const chart = lightningChart()
    .ChartXY({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    })
    // Disable native AutoCursor to create custom
    .setAutoCursorMode(AutoCursorModes.disabled)
    .setTitle('Custom Cursor using LCJS UI')

// set title for Y axis
chart.getDefaultAxisY().setTitle('Y-axis')

// generate data and creating the series
const series = new Array(3).fill(0).map((_, iSeries) => {
    const nSeries = chart.addLineSeries({
        dataPattern: {
            // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
            pattern: 'ProgressiveX',
        },
    })

    return nSeries
})

Promise.all(
    series.map((nSeries) =>
        createProgressiveTraceGenerator()
            .setNumberOfPoints(200)
            .generate()
            .toPromise()
            .then((data) => {
                nSeries.add(data)
            }),
    ),
).then(() => {
    chart.forEachAxis((axis) => axis.fit(false))
    requestAnimationFrame(() => {
        // Show custom cursor at start automatically.
        showCursorAt({ clientX: window.innerWidth * 0.4, clientY: window.innerHeight / 2 })
    })
})

// Add Legend.
const legend = chart.addLegendBox().add(chart)

// Create UI elements for custom cursor.
const resultTable = chart
    .addUIElement(UILayoutBuilders.Column, {
        x: chart.getDefaultAxisX(),
        y: chart.getDefaultAxisY(),
    })
    .setMouseInteractions(false)
    .setOrigin(UIOrigins.LeftBottom)
    .setMargin(5)
    .setBackground((background) =>
        background
            // Style same as Theme result table.
            .setFillStyle(chart.getTheme().cursorResultTableFillStyle)
            .setStrokeStyle(chart.getTheme().cursorResultTableStrokeStyle),
    )

const rowX = resultTable.addElement(UILayoutBuilders.Row).addElement(UIElementBuilders.TextBox)

const rowsY = series.map((el, i) => {
    return resultTable
        .addElement(UILayoutBuilders.Row)
        .addElement(UIElementBuilders.TextBox)
        .setTextFillStyle(series[i].getStrokeStyle().getFillStyle())
})

const tickX = chart.getDefaultAxisX().addCustomTick(UIElementBuilders.PointableTextBox).setAllocatesAxisSpace(false)

const ticksY = series.map((el, i) => {
    return chart
        .getDefaultAxisY()
        .addCustomTick(UIElementBuilders.PointableTextBox)
        .setAllocatesAxisSpace(false)
        .setMarker((marker) => marker.setTextFillStyle(series[i].getStrokeStyle().getFillStyle()))
})

// Hide custom cursor components initially.
resultTable.setVisible(false)
tickX.setVisible(false)
ticksY.forEach((tick) => tick.setVisible(false))

const showCursorAt = (clientCoordinate) => {
    // Translate mouse location to Axis.
    const mouseLocationAxis = chart.translateCoordinate(clientCoordinate, chart.coordsAxis)

    // Solve nearest data point to the mouse on each series.
    const nearestDataPoints = series.map((el) => el.solveNearestFromScreen(clientCoordinate))

    // Find the nearest solved data point to the mouse.
    const nearestPoint = nearestDataPoints.reduce((prev, curr, i) => {
        if (!prev) return curr
        if (!curr) return prev
        return Math.abs(mouseLocationAxis.y - curr.location.y) < Math.abs(mouseLocationAxis.y - prev.location.y) ? curr : prev
    })

    if (nearestPoint) {
        // Set custom cursor location.
        resultTable.setPosition({
            x: nearestPoint.location.x,
            y: nearestPoint.location.y,
        })

        // Change origin of result table based on cursor location.
        if (nearestPoint.location.x > chart.getDefaultAxisX().getInterval().end / 1.5) {
            if (nearestPoint.location.y > chart.getDefaultAxisY().getInterval().end / 1.5) {
                resultTable.setOrigin(UIOrigins.RightTop)
            } else {
                resultTable.setOrigin(UIOrigins.RightBottom)
            }
        } else if (nearestPoint.location.y > chart.getDefaultAxisY().getInterval().end / 1.5) {
            resultTable.setOrigin(UIOrigins.LeftTop)
        } else {
            resultTable.setOrigin(UIOrigins.LeftBottom)
        }

        // Format result table text.
        rowX.setText(`X: ${chart.getDefaultAxisX().formatValue(nearestPoint.location.x)}`)
        rowsY.map((rowY, i) => {
            rowY.setText(`Y${i}: ${chart.getDefaultAxisY().formatValue(nearestDataPoints[i].location.y)}`)
        })

        // Position custom ticks.
        tickX.setValue(nearestPoint.location.x)
        ticksY.forEach((tick, i) => {
            tick.setValue(nearestDataPoints[i].location.y || 0)
        })

        // Display cursor.
        resultTable.setVisible(true)
        tickX.setVisible(true)
        ticksY.map((el) => el.setVisible(true))
    } else {
        // Hide cursor.
        resultTable.setVisible(false)
        tickX.setVisible(false)
        ticksY.map((el) => el.setVisible(false))
    }
}

// Implement custom cursor logic with events.
const mouseMoveEventHandler = (_, event) => {
    showCursorAt(event)
}

chart.onSeriesBackgroundMouseMove(mouseMoveEventHandler)
series.forEach((series) => {
    series.onMouseMove(mouseMoveEventHandler)
})

chart.onSeriesBackgroundMouseLeave((_, e) => {
    resultTable.setVisible(false)
    tickX.setVisible(false)
    ticksY.map((el) => el.setVisible(false))
})

chart.onSeriesBackgroundMouseDragStart((_, e) => {
    resultTable.setVisible(false)
    tickX.setVisible(false)
    ticksY.map((el) => el.setVisible(false))
})
