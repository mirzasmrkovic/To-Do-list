$(document).ready(() => {
	let itemStorage = []
	let temporaryStorage = []

	//Inputs new items into the storage..
	var onChangeFirstSetup = () => {
		if (localStorage.getItem("itemStorage") === null) {
			let firstTimeSetup = localStorage.setItem('itemStorage', JSON.stringify(itemStorage))
		}
	}
	onChangeFirstSetup()

	var onChange = () => {
		let inputStorage = localStorage.setItem('itemStorage', JSON.stringify(itemStorage))
		render()
		checkToDos()
	}
	
	//Loads storage that was previously stored by the user.
	var loadStorage = () => {
		let getItemStorage  = JSON.parse(localStorage.getItem('itemStorage'))
		itemStorage = itemStorage.concat(getItemStorage)
	}
	loadStorage()

	//Renders the elements every time there is a change with the elements.
	var render = () => {
		$('#itemContainer').empty()
		for (var i=0; i<itemStorage.length; i++) {
			//$('#itemContainer').append('<div class="items"><div class="whatToDo">' + itemStorage[i].text + '</div><div class="itemButtons"><div class="trash"><img src="icons/trash.png" class="trashNonHover"><img src="icons/trashhover.png" class="trashHover"></div><div class="' + itemStorage[i].completed + '"><img src="icons/check.png" class="checkNonHover' + ' ' + itemStorage[i].completed + 'Img' + '"></div></div></div>')
			let text = itemStorage[i].text
			let completed = itemStorage[i].completed

			let $itemContainer = document.getElementById('itemContainer')

			//Adds a div with the class of 'items' and appends it to the itemContainer
			let item = document.createElement('div')
			item.classList.add('items')
			$itemContainer.appendChild(item)

			//Adds a div with the class of 'WhatToDo' in which the value of the To-Do is passed in
			let textContainer = document.createElement('div')
			textContainer.classList.add('whatToDo')
			item.appendChild(textContainer)
			textContainer.innerText = text

			//Adds a div which holds 2 buttons: the 'trash' button and the 'checkMark' button
			let buttonContainer = document.createElement('div')
			buttonContainer.classList.add('itemButtons')
			item.appendChild(buttonContainer)

			//Creates a div with the class of 'trash' and appends it to the 'buttonContainer'
			let trash = document.createElement('div')
			trash.classList.add('trash')
			buttonContainer.appendChild(trash)

			//Creates an img with the class of 'trashNonHover' and appends it to the 'trash'
			let trashIcon = document.createElement('img')
			trashIcon.classList.add('trashNonHover')
			trashIcon.src= 'icons/trash.png'
			trash.appendChild(trashIcon)

			//Creates an img with the class of 'trashHover' and appends it to the 'trash'
			let trashIconHover = document.createElement('img')
			trashIconHover.classList.add('trashHover')
			trashIconHover.src = 'icons/trashhover.png'
			trash.appendChild(trashIconHover)

			//Creates a div with the class of itemStorage.completed
			let checkMark = document.createElement('div')
			checkMark.classList.add(completed)
			buttonContainer.appendChild(checkMark)

			//Creates an img with the class of 'check' and the class of completed + 'Img'
			let checkMarkIcon = document.createElement('img')
			checkMarkIcon.classList.add('check')
			checkMarkIcon.classList.add(completed + 'Img')
			checkMarkIcon.src= 'icons/check.png'
			checkMark.appendChild(checkMarkIcon)
		}
	}
	render()

	//used for displaying 'checked' and 'notChecked' items.
	//Loads the matched item into a temporary array which then displays the matched elements.
	//Once it loads the items into the temporary array called 'temporaryStorage' it resets the array,
	//so when any other action is detected, the render() is called which overwrites the
	//temporaryStorage thus avoiding accidentally deleting items that weren't matched
	var loadTemporaryStorage = () => {
		$('#itemContainer').empty()

		for (var i=0; i<temporaryStorage.length; i++) {
			$('#itemContainer').append('<div class="items"><div class="whatToDo">' + temporaryStorage[i].text + '</div><div class="itemButtons"><div class="trash"><img src="icons/trash.png" class="trashNonHover"><img src="icons/trashhover.png" class="trashHover"></div><div class="' + temporaryStorage[i].completed + '"><img src="icons/check.png" class="checkNonHover' + ' ' + temporaryStorage[i].completed + 'Img' + '"></div></div></div>')
		}
		checkTemporaryToDos()
		temporaryStorage = []
	}

	//used for filtering the itemStorage array and displaying the matched items
	var filterItems = (value) => {
		let checkedItems = itemStorage.filter(function(item){
			return item.completed === value
		})

		let filteredItems = JSON.stringify(checkedItems)
		temporaryStorage = temporaryStorage.concat(JSON.parse(filteredItems))

		loadTemporaryStorage()
	}

	//If there is nothing in the to-do list, adds text 'There are currently no To-Dos'
	var checkToDos = () => {
		if (itemStorage.length != 0) {
			$('#noToDos').hide()
		}
		else {
			$('#noToDos').show()
		}
	}
	checkToDos()

	//If there is only checked items in the array and the user clicks to display the 'notChecked' items
	//this displays 'There are currently no To-Dos' message
	var checkTemporaryToDos = () => {
		if (temporaryStorage.length != 0) {
			$('#noToDos').hide()
		}
		else {
			$('#noToDos').show()
		}
	}

	//Removes items from the localStorage and re-renders the localStorage
	$('#itemContainer').on('click', '.trash', (e) => {
		let item = e.currentTarget.parentNode.parentNode
		let textInItem = item.firstChild.innerHTML
		let indexOfItem = itemStorage.findIndex(i => i.text === textInItem)

		if (indexOfItem != -1) {
			itemStorage.splice(indexOfItem, 1)
		}

		onChange()
	})

	//Changes the matched elements' completed key to 'checked'
	$('#itemContainer').on('click', '.notChecked', (e) => {
		let item = e.currentTarget.parentNode.parentNode
		let textInItem = item.firstChild.innerHTML
		let indexOfItem = itemStorage.findIndex(i => i.text === textInItem)

		if (indexOfItem != -1) {
			itemStorage[indexOfItem].completed = "checked"
		}
		onChange()
	})

	//Changes the matched elements' completed key to 'notChecked'
	$('#itemContainer').on('click', '.checked', (e) => {
		let item = e.currentTarget.parentNode.parentNode
		let textInItem = item.firstChild.innerHTML
		let indexOfItem = itemStorage.findIndex(i => i.text === textInItem)

		if (indexOfItem != -1) {
			itemStorage[indexOfItem].completed = "notChecked"
		}
		onChange()
	})

	//Checks if the user input is empty or has some text inside and then pushes the users' input into localStorage
	$('.addButton').on('click', () => {
		let newToDo = document.getElementById('input').value

		//Checks if the user input is empty. If it is the user gets an alert encouraging the him to write something in.
		if (newToDo === '') {
			alert('You can\'t add a blank to-do. Try actually adding a to-do you slack off!')
		}
		else {
			let inputValue = document.getElementById('input').value
			itemStorage.push({text: inputValue, completed: 'notChecked'})

			onChange()

			//After the user clicks on the button the value inside of the input bar gets reset. Thus avoiding spam.
			document.getElementById('input').value = ""
		}
	})

	//Passes a value to the filterItems which then display the matched items.
	$('.showItems').on('click', () => {
		filterItems('notChecked')
	})

	$('.showAll').on('click', () => {
		onChange()
	})

	$('.showFinishedItems').on('click', () => {
		filterItems('checked')
	})
})