/*
 * LightningChartJS example that showcases creation of a custom cursor in ChartXY.
 *
 * This variant uses LCJS UI components to display the cursor components. The cursor logic is also implemented using LCJS events and methods.
 */

// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, UIElementBuilders, AxisTickStrategies, UIOrigins, emptyLine, AxisScrollStrategies, emptyFill } = lcjs

const lc = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
const chart = lc
    .ChartXY({
        legend: { visible: false },
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Custom cursor chart')

const timeAxis = chart
    .getDefaultAxisX()
    .setTickStrategy(AxisTickStrategies.Time)
    .setScrollStrategy(AxisScrollStrategies.scrolling)
    .setDefaultInterval((state) => ({
        end: state.dataMax ?? 0,
        start: (state.dataMax ?? 0) - 10_000,
        stopAxisAfter: false,
    }))

chart.getDefaultAxisY().dispose()
const channels = new Array(3).fill(0).map((_, i) => {
    const yAxis = chart
        .addAxisY({ iStack: -i })
        .setTickStrategy(AxisTickStrategies.Empty)
        .setTitle(`Channel ${i + 1}`)
        .setTitleRotation(0)
        .setStrokeStyle(emptyLine)
        .setScrollMargins(false)
    yAxis.setMargins(2, 2)
    const series = chart.addLineSeries({ yAxis }).setMaxSampleCount(50_000)
    return { yAxis, series }
})

setInterval(() => {
    channels.forEach((ch) => ch.series.appendSample({ x: performance.now(), y: Math.random() }))
}, 1000 / 60)

// ::: Custom cursor with values displayed in top-left corner of each channel :::
const cursorValueDisplays = channels.map((ch) =>
    chart
        .addUIElement(UIElementBuilders.CheckBox, { x: timeAxis, y: ch.yAxis })
        .setVisible(false)
        .setMargin(0)
        .setOn(true)
        .setPointerEvents(false),
)
const cursorTimeTick = timeAxis.addCustomTick(UIElementBuilders.PointableTextBox).setVisible(false)
chart.setCustomCursor((event) => {
    const { hits } = event
    if (!hits) {
        cursorValueDisplays.forEach((ui) => ui.setVisible(false))
        cursorTimeTick.setVisible(false)
        return
    }
    hits.forEach((hit) => {
        const iCh = channels.findIndex((item) => item.series === hit.series)
        const ui = cursorValueDisplays[iCh]
        ui.setVisible(true)
            .setText(`${hit.series.getName()} ${hit.axisY.formatValue(hit.y)}`)
            .setPosition({ x: timeAxis.getInterval().start, y: hit.axisY.getInterval().end })
            .setOrigin(UIOrigins.LeftTop)
    })
    cursorTimeTick.setVisible(true).setValue(hits[0].x)
})
