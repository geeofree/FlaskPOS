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
  const lastLogEL  = $('.data-last-login')

  function TwelveHourFormat(timeStr) {
    const time    = timeStr.split(':')
    const oldHour = Number(time[0])

    const hour        = oldHour < 12 ? oldHour : oldHour - 12
    const minute      = time[1]
    const time_period = oldHour < 12 ? "AM" : "PM"

    return `${hour}:${minute} ${time_period}`
  }

  ajax({ uID: $userID }, '/user_req', function(data) {
    const dateJoin = data.join_date.split(/(\s\d+:\d+)/)[0]

    let logDateData = data.last_login ? data.last_login.split(/(\s\d+:\d+)/) : false
    logDateData = logDateData ? logDateData[0] + " " + TwelveHourFormat(logDateData[1]) : "Never"


    fNameEL.text(data.firstname)
    lNameEL.text(data.lastname)
    uNameEL.text(data.username)
    dateJoinEL.text(dateJoin)
    lastLogEL.text(logDateData)
  })
}
