var express = require('express')
var router = express.Router()
var axios = require('axios')

/* GET home page. */
router.get('/', function (req, res, next) {
  // clear cookies for the user when he visits the homepage
  res.clearCookie('txnHash')

  // get the namespace for sockets and to send to trtl
  uniquePaymentIdentifier = res.locals.nameSpace

  // send msg to client to make sure all working
  var socketio = req.app.get('socketio').of(`/${res.locals.nameSpace}`)
  socketio.emit('message', `you are connected  to ${res.locals.nameSpace}`)

  res.render('index', { title: 'Express', id: uniquePaymentIdentifier })
})

router.get('/pay/', function (req, res, next) {
  // clear cookies for the user when he visits the homepage
  console.log('ip ', req.connection.remoteAddress)
  res.clearCookie('txnHash')

  // get the namespace for sockets and to send tu trtl
  uniquePaymentIdentifier = res.locals.nameSpace

  // send msg to client to make sure all working
  var socketio = req.app.get('socketio').of(`/${res.locals.nameSpace}`)
  socketio.emit('message', `you are connected  to ${res.locals.nameSpace}`)

  res.render('pay', {
    id: uniquePaymentIdentifier,
    buttonPayload: req.query.buttonPayload,
    layout: false
  })
})

router.post('/get-turtlepay-wallet', (req, res, next) => {
  console.log(req.body)
  const turtlePayData = {
    buttonPayload: req.body.buttonPayload,
    userDefined: { payee: req.body.payee }
  }

  if (req.body.redirectUrl && req.body.redirectUrl !== '') {
    turtlePayData.userDefined.redirectUrl = req.body.redirectUrl
  }
  // call turtlepay and pass our data
  axios
    .post('https://api.turtlepay.io/v1/button', turtlePayData)
    .then(function (response) {
      res.status(200).json({
        sendToAddress: response.data.sendToAddress,
        qrCode: response.data.qrCode,
        payee: response.data.userDefined.payee,
        amount: response.data.atomicAmount / Math.pow(10, 2),
        redirectUrl: response.data.userDefined.redirectUrl
      })
    })
    .catch(function (error) {
      return res.status(400).json({ msg: 'there was an error' })
    })
})


router.post('/generate_button', async (req, res, next) => {
  const amount = req.body.amount * 100
  const sendToAddress = req.body.sendToAddress
  const redirectUrl = req.body.redirectUrl || ''
  const turtlePayData = {
    amount: amount, 
    address: sendToAddress,
    callback: 'https://trtlbutton.com/turtlepay', // make sure you change this to your url
    confirmations: 2, // you can pick here how many confirmatiions before you consider the payment done
    userDefined: {
      redirectUrl: redirectUrl
    }
  }

  try {
    const turtlePayPayload = await axios.post('https://api.turtlepay.io/v1/button/new', turtlePayData)
    res.status(200).json({ buttonPayload: turtlePayPayload.data.buttonPayload })
  } catch (e) {
    console.log('error')
    // console.log(e)
    // res.status(400).send(e)
  }
})

// this is the callback url we provivde to turtlepay
router.post('/turtlepay', (req, res) => {
  // print the status turtlepay sends back in the console
  console.log(req.body)
  console.log(req.body.confirmationsRemaining)

  try {
    const user = req.body.request.userDefined.payee
    var socketio = req.app.get('socketio').of(`/${user}`)
    if (req.body.status === 200 || req.body.status === 102) {
      // update the client with confirmations remaining
      socketio.emit('message', {
        status: req.body.status,
        amountExpected: req.body.request.amount,
        amountReceived: req.body.amount,
        confirmationsRemaining: req.body.confirmationsRemaining
      })
    }

    // if turtlepay transfered the funds to your main wallet
    if (req.body.status === 200) {
      console.log('tx went through,hash: ' + req.body.txnHash)

      // send message to the client
      socketio.emit('message', {
        status: 200,
        txnHash: req.body.txnHash,
        redirectUrl: req.body.request.userDefined.redirectUrl
      })
    }
    res.status(200).send('ok')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
