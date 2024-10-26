import { $, $$ } from "./lib/helpers"

const inputImages = $('#images')
const imageContainer = $('#images-container')
const resetButton = $('#reset')
const rows = $$('.level')

let sourceContainer = null
let currentElement = null


function createImg(file) {
  const reader = new FileReader()

  reader.readAsDataURL(file)
  reader.onload = (evt) => {
    const result = evt.target.result
    const imgElement = document.createElement('img')
    imgElement.src = result
    imgElement.draggable = true
    imgElement.addEventListener('dragstart', handleDrag)
    imageContainer.appendChild(imgElement)
  } 
}


function createItems(evt) {
  const files = Array.from(evt.target.files)

  if (files.length > 1) {
    files.forEach(file => {
      createImg(file)
    })
  } else {
    createImg(files[0])
  }
}


function createElement(evt) {
  const { currentTarget, dataTransfer } = evt

  if (sourceContainer && currentElement) {
    sourceContainer.removeChild(currentElement)
  }

  if (currentElement) {
    const src = dataTransfer.getData('text/plain')
    const imgElement = document.createElement('img')
    imgElement.src = src
    imgElement.addEventListener('dragstart', handleDrag)
    currentTarget.appendChild(imgElement)
  }
}


function handleDrag(evt) {
  currentElement = evt.target
  sourceContainer = currentElement.parentNode
  evt.dataTransfer.setData('text/plain', currentElement.src)
}


function handleDragOver(evt) {
  evt.preventDefault()
  const { currentTarget } = evt
  if (sourceContainer === currentTarget) return
  
  currentTarget.classList.add('drag-over')

  const dragPreview = currentTarget.querySelector('.prev')

  if (currentElement && !dragPreview) {
    const previewElement = currentElement.cloneNode(true)
    previewElement.classList.add('prev')
    currentTarget.appendChild(previewElement)
  }
}


function handleDrop(evt) {
  evt.preventDefault()

  const { currentTarget } = evt

  createElement(evt)
  currentTarget.querySelector('.prev')?.remove()
  currentTarget.classList.remove('drag-over')
}


function handleDragLeave(evt) {
  evt.preventDefault()

  const { currentTarget } = evt
  currentTarget.classList.remove('drag-over')
  currentTarget.querySelector('.prev')?.remove()
}


inputImages.addEventListener('change', createItems)

rows.forEach(row => {
  row.addEventListener('dragover', handleDragOver)
  row.addEventListener('drop', handleDrop)
  row.addEventListener('dragleave', handleDragLeave)
})

imageContainer.addEventListener('dragover', handleDragOver)
imageContainer.addEventListener('drop', handleDrop)

resetButton.addEventListener('click', () => {
  const elements = $$('.level img')
  elements.forEach(element => {
    element.remove()
    imageContainer.appendChild(element)
  })
})