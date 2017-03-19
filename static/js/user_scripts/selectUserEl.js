import $ from "jquery"

export default function selectUserEl() {
  const $user     = $('.user')
  const $userRole = $('.user-role-type')


  selectEl($user, 'selected-user')
  selectEl($userRole, 'selected-role')
}


function selectEl($el, highlightClass) {
  $el.click(function() {
    const $self = $(this)

    if($self.hasClass(highlightClass)) {
      $self.removeClass(highlightClass)
    }
    else {
      $('.' + highlightClass).removeClass(highlightClass)
      $self.addClass(highlightClass)
    }
  })
}
