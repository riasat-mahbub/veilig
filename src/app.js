// express
const express = require("express")
const app = express()

// knex db
const knex = require('knex')
const pg = knex({
  client: 'pg',
  connection: {
      connectionString: process.env.DATABASE_URL
  }
});

// cors
const cors = require('cors')
app.use(cors())

//bcrypt
const bcrypt = require('bcrypt');
const hashStr = 10;

// body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// load routes
let passPaths = require('./passRoutes')
app.use('/pass', passPaths)

const {get_random_word} = require('./gen_pass/getWord')
const {passFlagsChecker} = require('./gen_pass/passFlagsChecker')

// root 
app.get('/', (req, res) => {
    res.status(200).json("This is root path")
})

// passphrase func
app.get('/passphrase/n_words=:n_words/passFlags=:flags', (req, res) => {
    let {n_words,flags} = req.params

    if (n_words < 3 || n_words > 20) {
        res.send(400).json("Length out of bounds")
    }

    if(!(passFlagsChecker(flags))){
        res.send(400).json("Incorrect passFlags format")
    }

    let passphrase = ''
    for (let i = 0; i < n_words - 1; ++i) {
        passphrase += get_random_word(flags) + '-'
    }
    passphrase += get_random_word(flags)

    res.status(200).json(passphrase)
})

// passphrase function(alt routes)
app.get('/passphrase/n_words=:n_words', (req, res) => {
    let {n_words} = req.params

    if (n_words < 3 || n_words > 20) {
        res.send(400).json("Length out of bounds")
    }

    let passphrase = ''
    for (let i = 0; i < n_words - 1; ++i) {
        passphrase += get_random_word('000') + '-'
    }
    passphrase += get_random_word('000')

    res.status(200).json(passphrase)
})


app.get('/passphrase/passFlags=:flags', (req, res) => {
    let {flags} = req.params
    
    if(!(passFlagsChecker(flags))){
        res.send(400).json("Incorrect passFlags format")
    }

    let passphrase = ''
    for (let i = 0; i < 2; ++i) {
        passphrase += get_random_word(flags) + '-'
    }
    passphrase += get_random_word(flags)

    res.status(200).json(passphrase)
})

app.get('/passphrase/', (req, res) => {

    let passphrase = ''
    for (let i = 0; i < 2; ++i) {
        passphrase += get_random_word('000') + '-'
    }
    passphrase += get_random_word('000')

    res.status(200).json(passphrase)
})

// user signin function
app.post('/login', async (req, res) => {

    const {email,pass} = req.body;

    if (email === null || pass === null || email === undefined || pass === undefined) {
        res.status(400).json("Empty Email or password");
        return
    }

    const userData = await pg.select('*').from('master').where({
        master_email: email
    })

    const signinSuccess = bcrypt.compareSync(pass, userData[0].master_hash);

    if (signinSuccess) {
        const mockUser = {
            email: userData[0].master_email,
        }
        res.status(200).json(mockUser)
    } else {
        res.status(400).json("LOGIN ERROR")
    }
})

//register func
app.post("/register", (req, res) => {

    const {email, pass } = req.body;
    if (email === null || pass === null || email === undefined || pass === undefined) {
        res.status(400).json("Empty Email or password");
        return
    }
    
    let master_hash = bcrypt.hashSync(pass, hashStr);
  
    let new_user = {
        master_email: email,
        master_hash: master_hash
    }
    
    pg('master')
    .insert(new_user)
    .then( () =>{
        res.status(200).json("REGISTERED");
    })
    .catch( (err) =>{
        res.status(400).json("REGISTRATION ERROR")
    });
  
})

//delete account func
app.post("/del_acc", async(req, res) => {

    const {email,pass} = req.body;

    if (email === null || pass === null || email === undefined || pass === undefined) {
        res.status(400).json("Empty Email or password");
        return
    }

    const userData = await pg.select('*').from('master').where({
        master_email: email
    })

    const userFound = bcrypt.compareSync(pass, userData[0].master_hash);

    if (userFound) {
        pg('master')
        .where({master_email: email})
        .del()
        .then( () =>{
            res.status(200).json("ACCOUNT DELETED");
        })
        .catch( (err) =>{
            res.status(400).json("ACCOUNT DELETETION ERROR")
        });
    } else {
        res.status(400).json("ACCOUNT DELETETION ERROR")
    }
  
})
  
module.exports.app = app