import '../../bower_components/jquery-ui/ui/widgets/datepicker'
import { select, createEl} from "./transSelect"
import { scrollbar } from "../misc/misc"
import ajax from "../misc/ajax"
import $ from "jquery"


export default function logs() {
  dateUI()
  select()
}

function dateUI() {
  const $datepicker = $('#datepicker').datepicker({
    showOn: "button",
    buttonText: `<i class="fa fa-calendar" aria-hidden="true"></i>`,
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    minDate: $('#minDate').text(),
    maxDate: $('#maxDate').text(),
    onSelect: request_trans_by_date
  })

  $datepicker.datepicker('setDate', new Date())
}


function request_trans_by_date(date) {
  clearTransactions()

  ajax({'date': date}, '/transaction_req', resp => {
    resp.forEach(data => createTransRecord(data))
    scrollbar($('.transactions-body'))
  })
}

function clearTransactions() {
  const $trans_data = $('.trans-data-wrapper')
  $trans_data.each((_, data) => $(data).remove())
  scrollbar($('.transactions-body'))
}

function createTransRecord(data) {
  const $wrapper   = $('.transactions-body')
  const $container = createEl('div', {'class': 'trans-column trans-data-wrapper'})
  const $invNo     = createEl('span', {'class': 'transID', 'style': 'display:none;'}, data.invoice_no)
  const $retailer  = createEl('span', {'class': 'trans-data retailer'}, data.retailer)
  const $totalQty  = createEl('span', {'class': 'trans-data trans-total-qty'}, data.totalqty)
  const $subtotal  = createEl('span', {'class': 'trans-data trans-subtotal'}, "₱" + data.subtotal)
  const $dateSold  = createEl('span', {'class': 'trans-data date-sold'}, formatDate(data.date_sold))

  $container.append($invNo, $retailer, $totalQty, $subtotal, $dateSold)
  $wrapper.append($container)
}

function formatDate(dateSTR) {
  const dateSlice = dateSTR.match(/\d{2} \w+ \d{4}/g)[0].split(" ")
  const months = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  }

  const day   = dateSlice[0]
  const month = months[dateSlice[1]]
  const year  = dateSlice[2]

  return `${year}-${month}-${day}`
}
