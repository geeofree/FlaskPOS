import $ from "jquery"
import inputLimiter from "../misc/inputTextLimiter"

export default function formKeyEvents() {
  const $fnameInput = $('.input-firstname')
  const $lnameInput = $('.input-lastname')
  const $unameInput = $('.input-username')
  const $passInput  = $('.input-password')

  const inputs = [[$fnameInput, 25], [$lnameInput, 25], [$unameInput, 20], [$passInput, 25]]

  inputs.forEach(input => {
    const inputEL    = input[0]
    const text_limit = input[1]

    inputLimiter(inputEL, text_limit)
  })
}
