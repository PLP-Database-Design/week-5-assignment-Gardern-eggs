const express = require('express');
const app = express();
const mysql = require ('mysql2');
const dotenv = require ('dotenv');
const cors = require("cors");
const { request } = require('http');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })


    db.connect((err) =>{
        //check if DB is connected
        if(err){
            console.log("Error connecting to the SQL:", err.message, err.code);
        return} 
        //IF wedding is connected
        console.log("connecting to MYSQL succecefull as id: ", db.threadId)

        //code goes here

//sett method to display information to the browser throught the server
        app.set('view engine','ejs');
        app.set('views', __dirname + '/views');


        //1. Retrieve all patients
        //get method to display information of patients to the browser
        app.get('/data', (req,res)=>{
            //getting data from the database
            db.query('SELECT * FROM patients', (err,results)=>{
                if (err){
                    console.error(err);
                    res.status(500).send('Error retriving Data');
                }else{
                    //Display data to broweser
                    res.render('data', {results: results});
                }
            });
        });

        //2. Retrieve all providers
        //get method to display information providers to the browser
        app.get('/providers', (req,res)=>{
            //getting data from the database
            db.query('SELECT * FROM providers', (err,results)=>{
                if (err){
                    console.error(err);
                    res.status(500).send('Error retriving Data');
                }else{
                    //Display data to broweser
                    res.render('providers', {results: results});
                }
            });
        });


        //3. Filter patients by FirstName
        // GET endpoint to retrieve patients by their first name
app.get('/filter', (req, res) => {
    const { first_name } = req.query; // Extract first_name from query parameters

    if (!first_name) {
        return res.status(400).send('First name is required');
    }


    db.query('SELECT * FROM patients WHERE first_name = ?', [first_name], (err, results) => {
        if (err) {
            console.error('Error retrieving patients:', err);
            return res.status(500).send('Database query failed' );
        }

        if (results.length === 0) {
            return res.status(404).send('No patients found with the given first name' );
        }

        res.render('filter',{results});
    });
});

        //4. Retrive all providers by their specialty
    // GET endpoint to retrieve patients by their first name
    app.get('/filterProvider', (req, res) => {
        const { provider_specialty } = req.query; // Extract specialty from query parameters
    
        if (!provider_specialty) {
            return res.status(400).send('Specialty is required');
        }
    
    
        db.query('SELECT * FROM providers WHERE provider_specialty = ?', [provider_specialty], (err, results) => {
            if (err) {
                console.error('Error retrieving providers:', err);
                return res.status(500).send('Database query failed' );
            }
    
            if (results.length === 0) {
                return res.status(404).send('No provider found with the given first name' );
            }
    
            res.render('filterProvider',{results});
        });
    });


        app.listen(process. env.PORT, () =>{
            console.log(`Server Listening on port ${process.env.PORT}`);
//checking to see if the connection is initiated succeful to the broswer
            console.log('are you connected to the server....')
            app.get('/', (req,res)=>{
                res.send("Server has stated")
            })
        })
    })