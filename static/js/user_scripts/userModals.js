import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import ajax from "../misc/ajax"

export default function userButtonEvent() {
  removeUser()
  createUser()
}




function removeUser() {
  const $remUserBtn   = $('.remove-user')
  const $remUserModal = $('.remove-user-modal')

  function remUserModalEv(content, showModal) {
    const $selectedUser = $('.selected-user')
    const $fullname = $('.selected-user-fullname')
    const $confirmRem = $('.confirm-remove')

    if($selectedUser.length) {
      // SHOW MODAL
      showModal()
    }
    else {
      alert('No user selected to remove!')
    }

    // FULLNAME FOR H2 Element on Remove User Modal
    const fName = $('.data-firstname').text()
    const lName = $('.data-lastname').text()
    $fullname.text(fName + " " + lName)

    const $pass_input = $('.user-remove-pw-input')


    $confirmRem.click(function() {
      const $self = $(this)
      const $userID = Number($selectedUser.attr("id").match(/\d+/)[0])
      const $pass = $pass_input.val()

      const data = {
        user_id: $userID,
        auth_pass: $pass
      }

      console.log(data)

      ajax(data, '/remove_user', function(resp) {
        if(resp.status == "success") {
          alert(resp.status)
          $self.off("click")
          window.location.replace(resp.url)
        }
        else if(resp.status == "fail") {
          alert(resp.error)
        }
      })
    })

    // CLOSE MODAL
    closeModal(function() {
      $pass_input.val('')
      $confirmRem.off("click")
    })
  }

  btnOpenModal($remUserBtn, $remUserModal, remUserModalEv)
}






function createUser() {
  const $newUserBtn   = $('.create-user')
  const $newUserModal = $('.create-user-modal')

  function newUserModalEv(content, showModal) {
    const $confirmCreate = $('.confirm-create')

    const $firstname = $('.user-firstname-input')
    const $lastname = $('.user-lastname-input')
    const $username = $('.user-username-input')
    const $password = $('.user-password-input')

    // showModal
    showModal()

    $confirmCreate.click(function() {
      const $self = $(this)

      const $fname = $firstname.val()
      const $lname = $lastname.val()
      const $uname = $username.val()
      const $pass = $password.val()
      const $gender = $('.user-gender-input').val()
      const $role = $('.user-role-input').length == 0 ? 2 : $('.user-role-input').val()

      const data = {
        firstname: $fname,
        lastname: $lname,
        username: $uname,
        password: $pass,
        gender: $gender,
        role: Number($role)
      }

      if($fname.length < 1) {
        alert("No input given on user's FIRST NAME")
      }
      else if($lname.length < 1) {
        alert("No input given on user's LAST NAME")
      }
      else if($uname.length < 5) {
        alert("USERNAME must be more than 5 characters")
      }
      else if($pass.length < 8) {
        alert("PASSWORD must be more than 8 characters")
      }
      else {
        send_data(data, $self)
      }

    })


    function send_data(data, $self) {

      ajax(data, '/new_user', response)

      function response(resp) {
        if(resp.status == "success") {
          alert(resp.status)
          $self.off("click")
          window.location.replace(resp.url)
        }
        else if(resp.status == "fail") {
          alert(resp.error)
        }
      }
    }

    // CLOSE MODAL
    closeModal(function() {
      $confirmCreate.off("click")
      $firstname.val('')
      $lastname.val('')
      $username.val('')
      $password.val('')
    })
  }

  btnOpenModal($newUserBtn, $newUserModal, newUserModalEv)
}
