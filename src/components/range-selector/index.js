// @flow
import * as React from "react"
import * as immutable from "immutable"
import { Col } from "glamorous"
import { width } from "window-size"
import Grid from "react-css-grid"

type State = "initial" | "started" | "finished"

type RangeSelectorStateType = {
	start: number,
	end: number,
	state: State,
	range: [number, number]
}

type RangeSelectorDispatchType = {
	selectBox: number => void,
	Reset: () => void
}

type RangeSelectorPropType = {
	boxSize: number,
	numElements: number,
	chunkSize: number,
	unselectedColor: string,
	selectedColor: string
}
function splitIntoChunks(list, chunkSize = 1) {
	return immutable.Range(0, list.count(), chunkSize).map(chunkStart => list.slice(chunkStart, chunkStart + chunkSize))
}

class RangeSelector extends React.Component<props, state> {
	state = {
		start: null,
		end: null,
		state: "initial",
		range: [null, null],
		hoverRange: [null, null]
	}
	setHoverIndex = index => {
		const { state, start } = this.state
		if (state === "started") {
			this.setState({
				hoverRange: [start, index]
			})
			console.log("hoverRange:", [start, index])
		}
	}

	unsetHoverIndex = () => {
		this.setState({
			hoverRange: [null, null]
		})
	}

	selectBox = index => {
		const { state, start, end } = this.state
		let newState = "none"
		let newRange = [null, null]
		switch (state) {
			case "initial":
				newState = "started"
				newRange = [index, null]
				this.setState({
					range: newRange,
					start: index,
					end: null,
					state: newState
				})
				console.log("NewState:", newState)
				break
			case "started":
				newState = "finished"
				newRange = [start, index]
				this.setState({
					range: newRange,
					end: index,
					state: newState
				})
				console.log("NewState:", newState)
				break
			case "finished":
				newState = "started"
				newRange = [index, null]
				this.setState({
					range: newRange,
					start: index,
					end: null,
					state: newState
				})
				console.log("NewState:", newState)
				break
			default:
				console.log("unknown state")
				break
		}
	}
	render() {
		const { boxSize, numElements, unselectedColor, chunkSize, selectedColor } = this.props
		const { hoverRange, state, start, end } = this.state
		let boxes = []
		for (let i = 0; i < numElements; i++) {
			boxes.push(
				<Box
					key={i}
					boxSize={boxSize}
					setHoverIndex={this.setHoverIndex}
					unsetHoverIndex={this.unsetHoverIndex}
					selectedColor={selectedColor}
					unselectedColor={unselectedColor}
					selectBox={this.selectBox}
					hoverRange={hoverRange}
					index={i}
					start={start}
					state={state}
					end={end}
				/>
			)
		}

		boxes = immutable.List(boxes)
		boxes = splitIntoChunks(boxes, chunkSize).toList()

		const style = {
			// width: "500px",
			height: "100px",
			overflow: "hidden"
		}

		const rowTitleStyle = {
			lineHeight: `${boxSize}px`,
			height: `${boxSize}px`
		}
		const rowTitles = [
			<div style={rowTitleStyle}>00</div>,
			<div style={rowTitleStyle}>15</div>,
			<div style={rowTitleStyle}>30</div>,
			<div style={rowTitleStyle}>45</div>
		]
		return (
			<div style={style}>
				<Column title={""} height={boxSize * chunkSize} width={boxSize} boxes={rowTitles} />
				{boxes.entrySeq().map(el => {
					return <Column title={el[0]} height={boxSize * chunkSize} width={boxSize} key={el[0]} boxes={el[1]} />
				})}
			</div>
		)
	}
}

type ColumnPropType = {
	title: string,
	rows: number,
	colIndex: number,
	boxes: Array<React.Component<any>>,
	selectStart: number => void,
	selectEnd: number => void
}

const Column = (props: any) => {
	const { title, height, boxes, width } = props
	const style = {
		width: width,
		height: height,
		float: "left"
	}
	return (
		<div style={style}>
			<div style={{ textAlign: "center", height: "20px", writingMode: "vertical-rl" }}>{title}</div>
			{boxes}
		</div>
	)
}

type BoxPropType = {
	boxSize: number,
	unselectedColor: string,
	selectedColor: string,
	index: number,
	start: number,
	end: number,
	state: State,
	selectBox: number => void,
	hoverRange: [number, number]
}

class Box extends React.Component<props, state> {
	state = {
		hover: false
	}
	handleHover() {
		const { setHoverIndex, index } = this.props
		setHoverIndex(index)
		this.setState({ hover: true })
	}
	handleUnhover() {
		const { unsetHoverIndex, index } = this.props
		unsetHoverIndex(index)
		this.setState({ hover: false })
	}
	handleClick() {
		const { selectBox, index } = this.props
		selectBox(index)
	}
	render() {
		const { boxSize, selectedColor, unselectedColor, index, hoverRange, start, end, state } = this.props
		const { hover } = this.state

		const selected = isSelected(index, start, end, state)
		const hoverSelected = isInHoverRange(index, hoverRange[0], hoverRange[1])
		const shouldColour = hover || selected || hoverSelected

		const style = {
			backgroundColor: shouldColour ? selectedColor : unselectedColor,
			boxSizing: "border-box",
			border: "1px solid #555555",
			width: boxSize,
			height: boxSize,
			margin: "0px"
		}
		return (
			<div
				onClick={() => {
					this.handleClick()
				}}
				onMouseEnter={() => {
					this.handleHover()
				}}
				onMouseLeave={() => {
					this.handleUnhover()
				}}
				style={style}
			/>
		)
	}
}

type TitlePropType = {
	start: string,
	end: string
}
const Title = (props: TitlePropType) => {
	return <div />
}

const isInHoverRange = (boxIndex, start, end) => {
	if (start === null) return false
	if (end === null) return false
	if (boxIndex >= start && boxIndex <= end) return true
	return false
}

const isSelected = (boxIndex, start, end, state) => {
	switch (state) {
		case "initial":
			return false
		case "started":
			if (boxIndex >= start && boxIndex <= end) return true
		case "finished":
			if (boxIndex >= start && boxIndex <= end) return true
		default:
			return false
	}
}
export { RangeSelector }
