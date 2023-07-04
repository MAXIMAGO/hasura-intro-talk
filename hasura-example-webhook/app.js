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
      }),
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvIE92ZXJsYW5kIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJhZG1pbiIsIngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl0sIngtaGFzdXJhLXVzZXItaWQiOiJmN2IzYzJkMS1iMTk0LTRhNWQtYmQ0Ny0wZGU3Y2FjYjc5OGYifX0.krSS1UPgJNYekkx6qP5E_5ZIjSANcEpkO9p5CsHhYzU",
        "Content-Type": "application/json"
      }
    }
  );
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data);
  return data;
};

// Request Handler
app.post('/insert-car', async (req, res) => {
  console.log(`Start Action InsertCar.`);

  // get request input
  const { id, make, model, registration_number } = req.body.input;
  // run some business logic
  console.log(`Query traffic office for registration number ${registration_number}.`);
  if (registration_number.startsWith("BO M"))
  {
    console.log(`Registration number is invalid.`);
    return res.json({affectedRows: 0})
  }

  // execute the Hasura operation
  const { data, errors } = await execute({ id, make, model, registration_number });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0])
  }

  console.log('End Action InsertCar')
  console.log('===')
  // success
  return res.json({
    ...data.insert_rent_a_car_car
  })
});

app.post('/newsletter', (req, res) => {
  console.log('Start Event Newsletter')
  const newCar = req.body.event.data.new
  console.log(`${newCar.make} ${newCar.model} is new in stock. Try it out!`)
  console.log('End Event Newsletter')
  console.log('===')
  res.status(200).send({email: true})
})

let port = process.env.PORT
if (port == null || port == "") {
  port = 8000
}

app.listen(port, () => {
  console.log(`Hasura Example Webhook listening on port ${port}`)
})