import $ from 'jquery'

export default function highlight_magnet() {
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
