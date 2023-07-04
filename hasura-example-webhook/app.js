const express = require('express')
const bodyParser = require('body-parser')
const fetch = require("node-fetch")

const app = express()

app.use(bodyParser.json())

const HASURA_OPERATION = `
mutation InsertCar($id: uuid, $make: String, $model: String, $registration_number: String) {
  insert_rent_a_car_car(objects: {id: $id, make: $make, model: $model, registration_number: $registration_number}) {
    affected_rows
    returning {
      id
      make
      model
      registration_number
    }
  }
}
`;

// execute the parent operation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch(
    "https://hasura-intro-talk.hasura.app/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: HASURA_OPERATION,
        variables
      })
    }
  );
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data);
  return data;
};

// Request Handler
app.post('/insert-car', async (req, res) => {

  // get request input
  const { id, make, model, registration_number } = req.body.input;

  // run some business logic
  console.log(`Query traffic office for registration number.`)

  // execute the Hasura operation
  const { data, errors } = await execute({ id, make, model, registration_number });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0])
  }

  // success
  return res.json({
    ...data.insert_rent_a_car_car
  })
});

app.post('/newsletter', (req, res) => {
  console.log('Sending Newsletter')
  const newCar = req.body.event.data.new
  console.log(`${newCar.make} ${newCar.model} is new in stock. Try it out!`)
  res.status(200).send({email: true})
})

let port = process.env.PORT
if (port == null || port == "") {
  port = 8000
}

app.listen(port, () => {
  console.log(`Hasura Example Webhook listening on port ${port}`)
})