const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

let phoneBook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "5",
    name: "mtn",
    number: "310",
  },
];

// ***********LIST*************
app.get("/api/persons", (request, response) => {
  return response.json(phoneBook);
});

// **********INFO************
app.get("/info", (request, response) => {
  // return response.json(phoneBook);
  const numberOfContact = phoneBook.length;
  const date = new Date();

  return response.send(`
    <h2>Phone has info for ${numberOfContact} people</h2>
    <p>${date}</p>
    `);
});

// *************DETAIL***************
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = phoneBook.find((n) => {
    return n.id === id;
  });

  if (!person) {
    return response.status(400).json({ error: "invalid id" });
  }
  return response.json(person);
});

// const lastId = () => {
//   const maxId =
//     phoneBook.length > 0 ? Math.max(...phoneBook.map((n) => Number(n.id))) : 0;
//   return String(maxId + 1);
// };

const randomId = () => {
  const alphnum = "abcdefghijklmnopqrstuvwxyz0123456789";
  const len = 8;
  let idVal = "";

  for (let i = 0; i < len; i++) {
    // console.log(i);
    idVal += alphnum[Math.floor(Math.random() * alphnum.length)];
  }
  return idVal;
};

// console.log("the last id is", lastId());

// // ************CREATE************
app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.name || !person.number) {
    return response
      .status(400)
      .json({ error: "Name and number field is required" });
  }

  if (person) {
    phoneBook.map((n) => {
      const isUnique = n.name.toLowerCase() === person.name.toLowerCase();

      if (isUnique) response.json({ error: "name must be unique" });
    });
  }

  const contactInfo = {
    name: person.name,
    number: person.number || null,
    id: randomId(),
    // id: lastId(),
  };

  phoneBook = phoneBook.concat(contactInfo);
  response.json(contactInfo);
  // console.log("returned data", contactInfo);
});

// // ****************UPDATE******************
// app.put("/api/persons/:id", (request, response) => {
//   const id = request.params.id;
//   const body = request.body;

//   const contact = phoneBook.find((n) => n.id === id);

//   if (!contact)
//     return response.status(404).json({ error: "User does not exist" });

//   const updatedContact = { ...contact, ...body };

//   const updatedPhoneBook = phoneBook.map((n) =>
//     n.id === id ? updatedContact : n,
//   );

//   response.json(updatedContact);
// });

// // ***********DELETE******************
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const contactInfo = phoneBook.filter((n) => n.id !== id);
  response.status(200).end();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
