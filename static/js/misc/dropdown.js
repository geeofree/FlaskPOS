import $ from "jquery"

export default function dropdown() {
  const $dropdown = $('.dropdown-text')

  function dropDownEv() {
    const $self = $(this)
    const $parent = $self.parent('.dropdown')
    const $text = $parent.find('.dropdown-text')
    const $content = $parent.find('.dropdown-content')

    if($content.hasClass('show-dropdown')) {
      $text.removeClass('dropdown-pressed')
      $content.removeClass('show-dropdown')
    }
    else {
      $('.dropdown-pressed').removeClass('dropdown-pressed')
      $('.show-dropdown').removeClass('show-dropdown')
      $text.addClass('dropdown-pressed')
      $content.addClass('show-dropdown')
    }
  }

  $dropdown.click(dropDownEv)
}
