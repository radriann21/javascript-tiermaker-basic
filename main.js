import { $, $$ } from "./lib/helpers"
import html2canvas from "html2canvas-pro" 

const inputImages = $('#images')
const imageContainer = $('#images-container')
const resetButton = $('#reset')
const saveButton = $('#save')
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
  const files = evt.dataTransfer ? Array.from(evt.dataTransfer.files) : Array.from(evt.target.files)
  files.forEach(file => createImg(file))
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

  const { currentTarget, } = evt
  currentTarget.classList.remove('drag-over')
  currentTarget.querySelector('.prev')?.remove()
}


function handleDragOverFromDesktop(evt) {
  evt.preventDefault()

  const { dataTransfer, currentTarget } = evt

  if (dataTransfer.types.includes('Files')) {
    currentTarget.classList.add('over-desktop')
  }
}


function handleDropFromDesktop(evt) {
  evt.preventDefault()
  const { currentTarget } = evt

  currentTarget.classList.remove('over-desktop')
  
  if (dataTransfer.items && dataTransfer.items[0].kind === 'file') {
    createItems(evt)  
  }
}


inputImages.addEventListener('change', createItems)

rows.forEach(row => {
  row.addEventListener('dragover', handleDragOver)
  row.addEventListener('drop', handleDrop)
  row.addEventListener('dragleave', handleDragLeave)
})

imageContainer.addEventListener('dragover', handleDragOver)
imageContainer.addEventListener('drop', handleDrop)

imageContainer.addEventListener('dragover', handleDragOverFromDesktop)
imageContainer.addEventListener('drop', handleDropFromDesktop)

resetButton.addEventListener('click', () => {
  const elements = $$('.level img')
  elements.forEach(element => {
    element.remove()
    imageContainer.appendChild(element)
  })
})

saveButton.addEventListener('click', () => {
  const tierContainer = $('.tier')
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  html2canvas(tierContainer).then(canvas => {
    ctx.drawImage(canvas, 0, 0)
    const imgUrl = canvas.toDataURL('image/png')

    const downloadLink = document.createElement('a')
    downloadLink.download = 'tier.png'
    downloadLink.href = imgUrl
    downloadLink.click()
  })
})