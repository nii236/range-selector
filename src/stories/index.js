// @flow
import React from "react"

import { RangeSelector } from "../components/range-selector"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { linkTo } from "@storybook/addon-links"

import { Button, Welcome } from "@storybook/react/demo"

storiesOf("Welcome", module).add("to Storybook", () => <Welcome showApp={linkTo("Button")} />)

storiesOf("Button", module)
	.add("with text", () => <Button onClick={action("clicked")}>Hello Button</Button>)
	.add("with some emoji", () => (
		<Button onClick={action("clicked")}>
			<span role="img" aria-label="so cool">
				😀 😎 👍 💯
			</span>
		</Button>
	))

storiesOf("RangeSelector", module)
	.add("3x3", () => (
		<RangeSelector boxSize={20} chunkSize={3} numElements={9} selectedColor={"#9EEBCF"} unselectedColor={"#F4F4F4"} />
	))

	.add("4x12", () => (
		<RangeSelector boxSize={20} chunkSize={4} numElements={96} selectedColor={"#9EEBCF"} unselectedColor={"#F4F4F4"} />
	))
