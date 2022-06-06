const range = document.querySelector('.range')
const thumb = document.querySelector('.thumb')
const track = document.querySelector('.track-inner')
const text = document.querySelector('#englishLevelSliderValue')

const updateSlider = (value) => {
    thumb.style.left = `${value}%`
    thumb.style.transform = `translate(-${value}%, -50%)`
    track.style.width = `${value}%`
    text.textContent = value
}

range.oninput = (e) => {
    updateSlider(e.target.value)
    console.log(e.target.value)
}

updateSlider(50) // Init value