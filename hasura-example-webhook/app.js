const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.post('/insertCar', (req, res) => {

  // get request input
  const { object } = req.body.input;

  console.log(`Query traffic office for registration number.`)

  // execute the Hasura operation
  const { data, errors } = {
    data: { insert_rent_a_car_car_one: undefined },
    errors: undefined
  } // await execute({ object });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0])
  }

  // success
  return res.json({
    ...data.insert_rent_a_car_car_one
  })
})

app.post('/newsletter', (req, res) => {
  console.log('Sending Newsletter')
  const newCar = req.body.event.data.new
  console.log(`${newCar.make} ${newCar.model} is new in stock. Try it out!`)
  res.status(200).send({email: true})
})


app.post('/welcome-customer', (req, res) => {
  console.log('Sending Welcome Email')
  const newCustomer = req.body.event.data.new
  console.log(`Welcome ${newCustomer.first_name} ${newCustomer.last_name} to Rent-A-Car!`)
  res.status(200).send({email: true})
})

let port = process.env.PORT
if (port == null || port == "") {
  port = 8000
}
app.listen(port, () => {
  console.log(`Hasura Example Webhook listening on port ${port}`)
})