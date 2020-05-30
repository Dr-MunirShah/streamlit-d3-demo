import React, {useEffect, useRef} from "react"
import {ComponentProps, Streamlit, withStreamlitConnection,} from "./streamlit"
import * as d3 from "d3";

const D3Component = (props: ComponentProps) => {

    const ref = useRef(null)

    const svgWidth = props.args.width
    const svgHeight = props.args.height
    const margin = {top: 20, right: 20, bottom: 20, left: 20}
    const data: Array<Array<[number, number]>> = props.args.data

    useEffect(() => {
        const svgElement = d3.select(ref.current)

        // study for typîng max https://stackoverflow.com/questions/53480421/d3-max-in-typescript-returns-a-string
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d: any) => d[0])])
            .range([margin.left, svgWidth - margin.right])
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d: any) => d[1])])
            .range([svgHeight - margin.bottom, margin.top])

        svgElement.selectAll("circle")
            .data(data, (d: any) => d)
            .join(
                enter => (
                    enter.append("circle")
                        .attr("cx", (d: any) => xScale(d[0]))
                        .attr("cy", (d: any) => yScale(d[1]))
                        .attr("r", 0)
                        .attr("fill", "lightgrey")
                        .call(enter => (
                            enter.transition().duration(1200)
                                .attr("r", 15)
                                .attr("fill", "cornflowerblue")
                                .style("opacity", 1)
                        ))
                ),
                update => (
                    update.attr("fill", "cornflowerblue")
                ),
                exit => (
                    exit.attr("fill", "tomato")
                        .call(exit => (
                            exit.transition().duration(1200)
                                .attr("r", 0)
                                .attr("fill", "lightgrey")
                                .style("opacity", 0)
                                .remove()
                        ))
                ),
            )
    })

    useEffect(() => {
        Streamlit.setFrameHeight()
    })

    return (
        <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            ref={ref}
        />
    )
}

export default withStreamlitConnection(D3Component)
