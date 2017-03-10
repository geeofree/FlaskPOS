export default function buttonEv(btnTarget, callback) {
  function mdown() {
    btnTarget.addClass('clicked')
  }

  function mup(){
    btnTarget.removeClass('clicked')
    callback()
  }

  btnTarget.mousedown(mdown)
  btnTarget.mouseup(mup)
}
