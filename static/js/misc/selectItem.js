import $ from "jquery"

export default function itemSelect(item, cl) {
  item.click(function() {
    const $self = $(this)

    if($self.hasClass(cl)) {
      $self.removeClass(cl)
    }
    else {
      $self.addClass(cl)
    }
  })
}
