# Vor dem Vortrag

## Lokales Deployment

1. checke das repo aus
2. starte die docker container mit `cd docker && docker-compose up`
3. öffne Hasura console (http://localhost:8080/console

## Cloud Deployment

Wenn die Hands-On Session nicht lokal sondern in mit der Cloud Instanz von Hasura passieren soll, dann
- Öffne im Browser
    - Console des Hasura Cloud project (https://cloud.hasura.io/projects) statt lokale console 
- Versichere dich, dass folgende Dinge in Heroku (oder sonst wo in der cloud) deployed sind
    - Die postgres datenbank für das hasura cloud Projekt

## Programme auf dem Rechner öffnen

- Öffne auf deinem Desktop bzw. im Browser
    - pgAdmin
    - jwt.io
    - github.com/MAXIMAGO
        - hasura-example-webhook/app.js
    - render.com
        - logs des hasura-webhook-example services

## Hasura Console einrichten

- Führe "Step 2" von diesem guide aus: https://hasura.io/docs/latest/getting-started/docker-simple/
    - nenne die Datenbank "hasura-intro"
- In pgAdmin oder direkt in der Console:
    - Erzeuge in der DB ein Schema "rent_a_car"
    - Erstelle die Tabellen `car`, `Person`, `logbook`
    - Nutze die Skripte `data/car.sql`, `data/person.sql`, und `data/logbook.sql` um Daten in die Tabellen einzufügen
    - !!! Verwende noch nicht den Schema Editor um die Fremdschlüssel in Hasura zu tracken !!! (Das passiert während der Hands-on session)
- In der Console:
    - Lege im API Tab einen "Authorization" header an mit dem Wert: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvIE92ZXJsYW5kIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIl0sIngtaGFzdXJhLXVzZXItaWQiOiJmN2IzYzJkMS1iMTk0LTRhNWQtYmQ0Ny0wZGU3Y2FjYjc5OGYiLCJ4LWhhc3VyYS1vcmctaWQiOiI0NTYiLCJ4LWhhc3VyYS1jdXN0b20iOiJjdXN0b20tdmFsdWUifX0.Z-oGmngnAgxQesHi4wphiNFCu_OgeEkuGMXljS49GM4"
    - Der secret key dieses JWT ist genau der key aus dem docker-compose.yml file
    - Hier der link zum jwt: https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvIE92ZXJsYW5kIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIl0sIngtaGFzdXJhLXVzZXItaWQiOiJmN2IzYzJkMS1iMTk0LTRhNWQtYmQ0Ny0wZGU3Y2FjYjc5OGYiLCJ4LWhhc3VyYS1vcmctaWQiOiI0NTYiLCJ4LWhhc3VyYS1jdXN0b20iOiJjdXN0b20tdmFsdWUifX0.Z-oGmngnAgxQesHi4wphiNFCu_OgeEkuGMXljS49GM4
    - Setze eine Permission auf die Person Tabelle
        - Rolle "user"
        - Permission "select"
        - Filter: "id eq X-Hasura-User-Id"

## Vorbereitung für Actions + Events

- Versichere dich, dass folgende Dinge in Heroku (oder sonst wo in der cloud) deployed sind:
    - nodejs hasura-example-webhook

# Während dem Vortrag

## Beispiel "InsertCar" Action

Erstelle eine Mutation im API Tab:

```
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
```

Queryvars
```
{"id":"133ce0a8-55cc-4f33-a816-1eef7bb63be1","make":"VW","model":"Golf","registration_number":"DO M 1002"}
```

klicke auf "derive action" und gib dort die folgende URL als Ziel an:
`https://hasura-intro-talk-example-webhook.onrender.com/insert-car`

## Event "Newsletter for new car"

Erstelle ein Event wie [hier](./event-config-newsletter-on-car-insert.png)

Nutze die folgende URL als Ziel:
`https://hasura-intro-talk-example-webhook.onrender.com/newsletter`
