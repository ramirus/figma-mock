import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState } from 'react'
import './ui.css'

function UI() {
	const [isLoading, setIsLoading] = useState(true)
	const [selectedTitle, setSelectedTitle] = useState(undefined)
	const [selectedColor, setSelectedColor] = useState(undefined)
	const [selectedModific, setSelectedModific] = useState(undefined)
	const [mockupData, setMockupData] = useState(new Map())

	const onCreate = () => {
		console.log('create')
		// todo block sending undefined data, mb disable button
		const data: DEFAULT_PARAMS = {
			title: selectedTitle,
			color: selectedColor,
			modific: selectedModific,
		}
		parent.postMessage({ pluginMessage: { type: 'CREATE', data } }, '*')
	}
	const onCancel = () => {
    console.log('cancel')
		parent.postMessage({ pluginMessage: { type: 'CANCEL' } }, '*')
	}

	const setMockups = (data: {mockups: Map<string, MOCKUP_MAP_ITEM>, defaultParams: DEFAULT_PARAMS}) => {
		console.log('setMockups', data)
		setMockupData(new Map(data.mockups))
		const { title, modific, color } = data.defaultParams
		setSelectedTitle(title)
		setSelectedColor(color)
		setSelectedModific(modific)
		setIsLoading(false)
	}

	onmessage = event => {
		// idk how to put this in react and im too lazy to find out
		// LMAO i cant believe this works this is some 300 iq going on rn
    const msg = event.data.pluginMessage
		switch (msg.type) {
			case 'INIT_PARAMS':
				console.log(msg)
				setMockups(msg.initParams)
				break
		}
	}

	
	const handleSelectTitle = (e) => {
		console.log('handleSelectTitle', e)
		const newTitle = e.currentTarget.value
		const currentMock = mockupData.get(newTitle)
		setSelectedTitle(newTitle)
		// set default first values
		setSelectedColor(currentMock.color[0])
		setSelectedModific(currentMock.modific[0])
	}
	
	const handleChangeColor = (e) => {
		console.log('handleChangeColor', e)
		setSelectedColor(e.currentTarget.value)
	}
	
	const handleChangeModific = (e) => {
		console.log('handleChangeModific', e)
		setSelectedModific(e.currentTarget.value)
	}
	
	const renderTitles = () => {
		console.log(mockupData)
		const result = [
			<option key="default" value="default" disabled>Select device</option>
		]
		mockupData.forEach((value: MOCKUP_MAP_ITEM, key: string) => {
			result.push(
				<option key={key} value={key}>{key}</option>
			)
		})
		return result
	}

	const renderColor = () => {
		const result = []
		if (!selectedTitle) return result
		const currentMock = mockupData.get(selectedTitle)
		currentMock.color.forEach(item => {
			result.push(
				<div className="radio-item" key={item}>
					<input
						type="radio"
						name="color"
						value={item}
						id={item}
						checked={item == selectedColor}
						onChange={handleChangeColor}
					/>
					<label htmlFor={item}>{item}</label>
				</div>
			)
		})
		return result
	}

	const renderModific = () => {
		const result = []
		if (!selectedTitle) return result
		const currentMock = mockupData.get(selectedTitle)
		currentMock.modific.forEach(item => {
			result.push(
				<div className="radio-item" key={item}>
					<input
						type="radio"
						name="modific"
						value={item}
						id={item}
						checked={item == selectedModific}
						onChange={handleChangeModific}
					/>
					<label htmlFor={item}>{item}</label>
				</div>
			)
		})
		return result
	}

	if (isLoading) return (
		<div>Loading...</div>
	)

	if (mockupData.size === 0) return (
		<div>Data is empty...</div>
	)

	return (
		<div>
      <select value={selectedTitle} onChange={handleSelectTitle} defaultValue="default">
				{renderTitles()}
			</select>
			<div className="radio-group">
				{renderColor()}
			</div>
			<div className="radio-group">
				{renderModific()}
			</div>
      <div className="footer">
        <button className="btn add" onClick={onCreate}>Add</button>
        <button className="btn cancel" onClick={onCancel}>Cancel</button>
      </div>
		</div>
	)
}

ReactDOM.render(<UI />, document.getElementById('react-page'))
