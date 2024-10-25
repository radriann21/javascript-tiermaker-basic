import { $, $$ } from "./lib/helpers"

const inputImages = $('#images')
const imageContainer = $('#images-container')
const rows = $$('.level')

let sourceContainer = null
let currentElement = null


function handleDrag(evt) {
  currentElement = evt.target
  sourceContainer = currentElement.parentNode
  evt.dataTransfer.setData('text/plain', currentElement.src)
}


function handleDragOver(evt) {
  evt.preventDefault()
}


function handleDrop(evt) {
  evt.preventDefault()
  const { currentTarget, dataTransfer } = evt

  if (sourceContainer && currentElement) {
    sourceContainer.removeChild(currentElement)
  }

  if (currentElement) {
    const src = dataTransfer.getData('text/plain')
    const imgElement = document.createElement('img')
    imgElement.src = src
    imgElement.draggable = true
    imgElement.addEventListener('dragstart', handleDrag)
    currentTarget.appendChild(imgElement)
  }
}


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


inputImages.addEventListener('change', createItems)


rows.forEach(row => {
  row.addEventListener('dragover', handleDragOver)
  row.addEventListener('drop', handleDrop)
})