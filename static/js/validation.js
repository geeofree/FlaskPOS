(function() {
  const form = document.querySelector("form")
  const user_input = document.querySelector("#user")
  const pass_input = document.querySelector("#pass")

  form.onsubmit = function(event) {
    event.preventDefault()
    const username = user_input.value
    const password = pass_input.value

    if(username.length < 5) {
      alert("Username is too short.")
      return false
    }
    else if(password.length < 5) {
      alert("Password is too short.")
      return false
    }

    return true
  }
})()
