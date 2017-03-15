import $ from "jquery"

export default function selectUser() {
  const $user = $('.user')

  $user.click(function() {
    const $self = $(this)

    if($self.hasClass('selected-user')) {
      $self.removeClass('selected-user')
    }
    else {
      $('.selected-user').removeClass('selected-user')
      $self.addClass('selected-user')
    }
  })
}
