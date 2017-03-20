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

    $confirmRem.click(function() {
      const $self = $(this)
      const $user = $('.data-firstname').text()
      const $pass = $('.user-remove-pw-input').val()

      const data = {
        user: $user,
        password: $pass
      }

      ajax(data, '/remove_user', function(resp) {
        if(resp.status == "success") {
          $self.off("click")
        }

        console.log(resp)
      })
    })

    // CLOSE MODAL
    closeModal(function() {
      $confirmRem.off("click")
    })
  }

  btnOpenModal($remUserBtn, $remUserModal, remUserModalEv)
}

function createUser() {
  const $newUserBtn   = $('.create-user')
  const $newUserModal = $('.create-user-modal')

  function newUserModalEv(content, showModal) {
    const $firstname = $('.input-firstname').val()
    const $lastname  = $('.input-lastname').val()
    const $username  = $('.input-username').val()
    const $password  = $('.input-password').val()
    const $role      = $('.selected-role').text() == "Admin" ? 1 : 0

    const $confirmCreate = $('.confirm-create')
    const $auth_input_pass = $('.user-create-pw-input')

    if($firstname.length == 0) {
      alert('Please enter value on firstname')
      return
    }
    else if($lastname.length == 0) {
      alert('Please enter value on lastname')
      return
    }
    else if($username.length < 5) {
      alert('Username must be 5 characters or more')
      return
    }
    else if($password.length < 8) {
      alert('Password must be 8 characters or more')
      return
    }
    else {
      // SHOW MODAL
      showModal()
    }


    $confirmCreate.click(function() {
      const $self = $(this)
      const $auth_pass = $auth_input_pass.val()

      const data = {
        auth_pass: $auth_pass,
        firstname: $firstname,
        lastname: $lastname,
        username: $username,
        password: $password,
        role: $role
      }

      ajax(data, '/new_user', function(resp) {

        if(resp.status == "success") {
          alert(resp.status)
          setTimeout(() => window.location.replace(resp.url), 800)
        }
        else if(resp.status == "fail") {
          alert(resp.error)
        }

      })
    })


    // CLOSE MODAL
    closeModal(function() {
      $confirmCreate.off("click")
      $pass.val('')
    })
  }

  btnOpenModal($newUserBtn, $newUserModal, newUserModalEv)
}
