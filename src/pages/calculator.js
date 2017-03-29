const Sugar = require('../cmp/sugar/sugar.js')
const Ingrid = require('../cmp/ingrid/ingrid.js')
const Pie = require('../cmp/pie/pie.js')
const events = require('../events.js')

new Sugar(document.getElementById('cont-sugar'))

new Ingrid(document.getElementById('cont-ingrid'))

new Pie(document.getElementById('cont-pie'))
