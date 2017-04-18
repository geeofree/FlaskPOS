import $ from "jquery"
import inputLimiter from "../misc/inputTextLimiter"

export default function formKeyEvents() {
  const $fnameInput = $('.user-firstname-input')
  const $lnameInput = $('.user-lastname-input')
  const $unameInput = $('.user-username-input')
  const $passInput  = $('.user-password-input')

  const inputs = [[$fnameInput, 20], [$lnameInput, 20], [$unameInput, 20]]

  inputs.forEach(input => {
    const inputEL    = input[0]
    const text_limit = input[1]

    inputLimiter(inputEL, text_limit)
  })
}
