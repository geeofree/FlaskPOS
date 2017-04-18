import $ from "jquery"
import ajax from "../misc/ajax"


export default function selectUserEl() {
  const $user     = $('.user')
  const $userRole = $('.user-role-type')


  selectEl($user, 'selected-user', getUser)
  selectEl($userRole, 'selected-role')
}


function selectEl($el, highlightClass, callback) {
  const $profileData = $('.profile-data')

  $el.click(function() {
    const $self = $(this)

    if($self.hasClass(highlightClass)) {
      $self.removeClass(highlightClass)

      if(highlightClass == 'selected-user') {
        $profileData.text('')
      }

    }
    else {
      $('.' + highlightClass).removeClass(highlightClass)
      $self.addClass(highlightClass)

      if(callback) {
        const $selectedUser = $('.selected-user')
        callback($selectedUser)
      }

    }
  })
}

function getUser($selectedUser) {
  const $userID    = Number($selectedUser.attr("id").match(/\d+/)[0])
  const fNameEL    = $('.data-firstname')
  const lNameEL    = $('.data-lastname')
  const uNameEL    = $('.data-username')
  const dateJoinEL = $('.data-date-join')
  const genderEL   = $('.data-sex')


  ajax({ uID: $userID }, '/user_req', function(data) {
    const dateJoin = data.join_date.split(/(\s\d+:\d+)/)[0]

    fNameEL.text(data.firstname)
    lNameEL.text(data.lastname)
    uNameEL.text(data.username)
    dateJoinEL.text(dateJoin)
    genderEL.text(data.gender)
  })
}
