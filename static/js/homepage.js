import $ from 'jquery'

export default function homepage() {
  const underline  = $('.underline')
  const text_input = $('.text-input')

  text_input.focus(function() {
    const self = $(this)
    self.next().addClass('stretch')
  })

  text_input.blur(function() {
    const self = $(this)
    self.next().removeClass('stretch')
  })
}
