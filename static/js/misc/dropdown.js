import $ from "jquery"

export default function dropdown() {
  const $dropdown = $('.dropdown-text')

  function dropDownEv() {
    const $self = $(this)
    const $content = $self.parent('.dropdown').find('.dropdown-content')

    if($content.hasClass('show-dropdown')) {
      $content.removeClass('show-dropdown')
    }
    else {
      $content.addClass('show-dropdown')      
    }
  }

  $dropdown.click(dropDownEv)
}
