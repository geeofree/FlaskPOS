import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import ajax from "../misc/ajax"

export default function userButtonEvent() {
  removeUser()
  updateUser()
  createUser()
}



// REMOVE USER MODAL EVENT
function removeUser() {
  const $remUserBtn   = $('.remove-user')
  const $remUserModal = $('.remove-user-modal')

  function remUserModalEv(content, showModal) {
    const $selectedUser = $('.selected-user')
    const $fullname = $('.selected-user-fullname')
    const $confirmRem = $('.confirm-remove')
    const $pass_input = $('.user-remove-pw-input')

    const client_username = $('#client-account').text()
    const client_role = $('#position').text()

    const user_username = $('.data-username').text()
    const user_role = $('.selected-user').find('.user-role').text()

    if(user_username && $selectedUser.length) {
      if(user_username == client_username) {
        alert('You cannot remove yourself')
        return
      }
      else if((client_role == user_role || (user_role == "Super Admin" && client_role == "Admin")) && user_username != client_username) {
        alert('You do not have enough privilages to remove another admin')
        return
      }
      else {
        // SHOW MODAL
        showModal()
      }
    }
    else if($selectedUser.length == 0) {
      alert('No user selected to remove!')
    }


    // FULLNAME FOR H2 Element on Remove User Modal
    const fName = $('.data-firstname').text()
    const lName = $('.data-lastname').text()
    $fullname.text(fName + " " + lName)


    $confirmRem.click(function() {
      const $self = $(this)
      const $userID = Number($selectedUser.attr("id").match(/\d+/)[0])
      const $pass = $pass_input.val()

      const data = {
        user_id: $userID,
        auth_pass: $pass
      }

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



// UPDATE USER MODAL EVENT
function updateUser() {
  const $editUserBtn = $('.update-user')
  const $editModal = $('.update-user-modal')

  function editUserModalEv(content, showModal) {
    const $selectedUser = $('.selected-user')
    const $confirmUpdate = $('.confirm-update')

    const client_username = $('#client-account').text()
    const client_role = $('#position').text()

    const user_username = $('.data-username').text()
    const user_role = $('.selected-user').find('.user-role').text()

    if(user_username && $selectedUser.length) {
      if((client_role == user_role || (user_role == "Super Admin" && client_role == "Admin")) && user_username != client_username) {
        alert('You do not have enough privilages to update another admin')
        return
      }
      else {
        // SHOW MODAL
        showModal()
      }
    }
    else if($selectedUser.length == 0) {
      alert('No user selected to update!')
    }


    const $fnameInput  = $('.user-update-firstname')
    const $lnameInput  = $('.user-update-lastname')
    const $unameInput  = $('.user-update-username')
    const $genderInput = $('.user-update-gender')
    const $roleInput   = $('.user-update-role')
    const $passInput   = $('.user-update-password')

    const $fnameVal = $('.data-firstname').text()
    const $lnameVal = $('.data-lastname').text()
    const $unameVal = $('.data-username').text()
    const $genderVal = $('.data-sex').text()
    const $roleVal = $selectedUser.find('.user-role').text()

    $fnameInput.val($fnameVal)
    $lnameInput.val($lnameVal)
    $unameInput.val($unameVal)
    $genderInput.val($genderVal)
    $roleInput.val($roleVal)

    function send_data(data) {

      function response(resp, $self) {
        if(resp.status == 'success') {
          alert('Update Success')
          window.location.replace(resp.url)
          $self.off("click")
        }
        else {
          alert(resp.error)
        }
      }

      ajax(data, '/update_user', response)
    }

    $confirmUpdate.click(function() {
      const $self = $(this)
      const $userID = Number($selectedUser.attr('id').match(/\d+/)[0])

      const $newFname = $fnameInput.val()
      const $newLname = $lnameInput.val()
      const $newUname = $unameInput.val()
      const $newGender = $genderInput.val()
      const $newRole = $roleInput.val() ? Number($roleInput.val()) : ''
      const $newPass = $passInput.val()


      if($newFname.length < 1) {
        alert("No input given on user's FIRSTNAME")
        return
      }
      else if($newFname.length < 1) {
        alert("No input given on user's lastname")
        return
      }
      else if($newUname.length < 5) {
        alert("USERNAME must be more than 5 characters")
        return
      }
      else if($newPass.length > 0 && $newPass.length < 8) {
        alert("PASSWORD must be more than 8 characters")
        return
      }

      const data = {
        user_id: $userID,
        firstname: $newFname,
        lastname: $newLname,
        username: $newUname,
        password: $newPass,
        gender: $newGender,
        role: $newRole
      }

      send_data(data, $self)
    })

    // CLOSE MODAL
    closeModal(function() {
      $confirmUpdate.off("click")
    })
  }

  btnOpenModal($editUserBtn, $editModal, editUserModalEv)
}




// CREATE USER MODAL EVENT
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

      // console.log(data)

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
