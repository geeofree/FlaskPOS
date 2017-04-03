import { highlightMagnet, logout } from "./misc/misc"
import checkout from "./checkout_scripts/checkout"
import product from "./product_scripts/product"
import reports from "./report_scripts/reports"
import users from "./user_scripts/user"
import dropdown from "./misc/dropdown"
import logs from "./log_scripts/logs"
import homepage from "./homepage"

(function() {
  // MISC
  highlightMagnet()
  dropdown()
  logout()

  // MAIN
  homepage()
  checkout()
  product()
  logs()
  users()
  reports()
})()
