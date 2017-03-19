import $ from 'jquery'
export { highlightMagnet, numInputValidation }


function highlightMagnet() {
  const dir = $('.dir')
  const current = $('.current_dir')

  dir.mouseenter(function() {
    const $self = $(this)
    if(!$self.hasClass('current_dir')) {
      dir.addClass('current_dir')
      current.removeClass('current_dir')
    }
  })

  dir.mouseleave(function() {
    const $self = $(this)

    if(!current.hasClass('current_dir')) {
      current.addClass('current_dir')
      $self.removeClass('current_dir')
    }
  })
}

function numInputValidation($inputEL, callback) {

  $inputEL.keydown(function(event) {
    const button = event.which || event.button
    const keyVal = String.fromCharCode(button)

    if(!(button >= 48 && button <= 57 || button >= 96 && button <= 105 || button == 8
      || button == 37 || button == 39 || event.ctrlKey && button == 65)) {
      event.preventDefault()
    }
  })

  $inputEL.keyup(function(event) {
    const $self  = $(this)
    const button = event.which || event.button
    const keyVal = String.fromCharCode(button)

    if(keyVal !== " " && !isNaN(keyVal) || button == 8) {
      callback($self, event)
    }
  })
}
