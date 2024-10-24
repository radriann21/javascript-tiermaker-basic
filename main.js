/*  helpers  */
const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)

const inputImages = $('#images')
const imageContainer = $('#images-container')
const rows = $$('.level')
const reader = new FileReader()

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

function createImg(evt) {
  const file = evt.target.files[0]
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

inputImages.addEventListener('change', createImg)


rows.forEach(row => {
  row.addEventListener('dragover', handleDragOver)
  row.addEventListener('drop', handleDrop)
})