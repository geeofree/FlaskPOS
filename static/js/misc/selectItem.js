import $ from "jquery"

export default function itemSelect(item, cl) {
  item.click(function() {
    const $self = $(this)

    if($self.hasClass('selected')) {
      $self.removeClass(cl)
    }
    else {
      $self.addClass(cl)
    }
  })
}
