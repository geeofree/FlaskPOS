import $ from "jquery"

export default function inputLimiter($inputEL, max_text_limit) {
  $inputEL.keydown(function(event) {
    const $self    = $(this)
    const $val     = $self.val()
    const inputLen = $val.length
    const button = event.which || event.button

    if(!(inputLen != max_text_limit || button == 8 || event.ctrlKey && button == 65)) {
      event.preventDefault()
    }
  })
}
