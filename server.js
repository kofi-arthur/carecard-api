import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import mysql from 'mysql2'
import * as nodemailer from 'nodemailer'

dotenv.config()
const app = express()
app.use(express.json())

const conn = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    uri: process.env.MYSQL_URL
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ace19dev@gmail.com',
        pass: 'txltdrhxconsffhm'
    }
});

app.get('/test', (req, res) => {
    res.send('This is a test')
})

// send reset code and add to DB
app.get('/sendCode/:email', (req, res) => {

    const email = req.params.email
    const query = 'UPDATE users SET code = ? WHERE email = ?'
    const code = Math.floor(Math.random() * 900000) + 100000;

    const messageBody = `
    <div style="text-align: center;">
        <p style="margin-bottom: 0px;">
        Hello, <br></br>
        Use the code below to proceed with resetting your password
        </p>
        <h1 style="color: green;">
        ${code}
        </h1>
        <p>If you did not mkae this request, kindly ignore this email.</P>
        <span style="font-size: 12px; opacity: .4">
        Care Card App
        </span>
    </div>
    `
    const mailOptions = {
        from: 'CareCard App <ace19dev@gmail.com>',
        to: email,
        subject: 'Reset Code',
        html: messageBody
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending mail', err)
            return res.status(500).json({ message: 'Error sending Mail' })
        }

        console.log('Email Sent', info.response)
        conn.query(query, [code, email], (err, info) => {
            if (err) {
                console.log('Error', err)
                res.status(500).json({ message: 'Error executing query' })
            } else if (info.affectedRows === 0) {
                console.log("Invalid Email")
                res.status(404).json({ message: 'Email does not exist' })
            }
            console.log('Code Added')
            res.status(200).json({ message: 'Code Added' })
        })

    })

})

// confirm code
app.get('/confirmCode/:email/:code', (req, res) => {
    const email = req.params.email
    const code = req.params.code
    const query = 'SELECT code FROM users WHERE email = ?'

    conn.query(query, email, (error, info) => {
        if (error) {
            console.log('Error', error)
            res.status(500).json({ message: 'Error executing query' })
        }
        const dbCode = info[0].code
        if (code !== dbCode) {
            console.log('Incorrect Code')
            res.status(424).json({ message: 'Incorrect Code' })
        }
        console.log('Success')
        res.status(202).json({ message: 'Success' })
    })

})

// get a user
app.get('/user/:email', (req, res) => {
    const email = req.params.email
    const query = 'SELECT * FROM users WHERE email = ?'

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executinig query')
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            console.log('User does not exist')
            return res.json({ message: 'Incorrect Email or Password' })
        }
        console.log('Data fetched successfully:', result[0])
        return res.send(result[0])
    })
})

// get all pending cards for user
app.get('/pendingcard/:email', (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM card WHERE email = ? AND status = 'Pending'"

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executinig query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            console.log('No cards belonging to user here')
            return res.json({ message: 'No Cards Here' })
        }
        console.log('Data fetched successfully:', result)
        return res.send(result)
    })
})

// get pending card number 
app.get('/pendingcardnum/:email', (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM card WHERE email = ? AND status = 'Pending'"

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executinig query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            console.log('No cards belonging to user here')
            return res.json({ message: 'No Cards Here' })
        }
        console.log('Data fetched successfully:', result)
        return res.send(result)
    })
})

// get all completed cards for user
app.get('/completedcards/:email', (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM card WHERE email = ? AND status = 'Completed'"

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executinig query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            console.log('No cards belonging to user here')
            return res.json({ message: 'No Cards Here' })
        }
        console.log('Data fetched successfully:', result)
        return res.send(result)
    })
})

// get completed card number 
app.get('/completedcardnum/:email', (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM card WHERE email = ? AND status = 'Completed'"

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executinig query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            console.log('No cards belonging to user here')
            return res.json({ message: 'No Cards Here' })
        }
        console.log('Data fetched successfully:', result)
        return res.send(result)
    })
})

// get all uncompleted cards for user
app.get('/uncompletedcards/:email', (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM card WHERE email = ? AND status = 'Uncompleted'"

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executinig query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            console.log('No cards belonging to user here')
            return res.json({ message: 'No Cards Here' })
        }
        console.log('Data fetched successfully:', result)
        return res.send(result)
    })
})

// get completed card number 
app.get('/uncompletedcardnum/:email', (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM card WHERE email = ? AND status = 'Uncompleted'"

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executinig query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            console.log('No cards belonging to user here')
            return res.json({ message: 'No Cards Here' })
        }
        console.log('Data fetched successfully:', result)
        return res.send(result)
    })
})

// update username
app.post('/user', (req, res) => {
    const { email, username } = req.body
    const query = 'UPDATE users SET username= ? WHERE email = ?'

    conn.query(query, [username, email], (error, result) => {
        if (error) {
            console.log('Error executinig query')
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.affectedRows === 0) {
            console.log('Username not updated')
            return res.status(409).send({ message: 'Username not updated' })
        }
        console.log('Username updated successfuly:', result)
        return res.send(result)
    })
})

// update password
app.post('/changePassword', (req, res) => {
    const { email, password } = req.body
    const query = 'UPDATE users SET password = ? WHERE email = ?'
    const salt = 13

    bcrypt.hash(password, salt, (error, result) => {
        if (error) {
            console.log('Error hashing password:', err)
            return res.status(500).json({ message: 'Error hashing password' })
        }
        console.log('Password Hashesd:', result)
        conn.query(query, [result, email], (err, success) => {
            if (err) {
                console.log('Error exectuing query', err)
                return res.status(500).json({ message: 'Error Executing Query' })
            }
            console.log('Success', success)
            return res.status(201).json({ messasge: 'Succes', success })
        })
    })
})

// hash a password
app.get('/hashPass/:password', (req, res) => {
    const password = req.params.password
    const saltRounds = 13

    bcrypt.hash(password, saltRounds, (err, hashPassword) => {
        if (err) {
            console.log('Error hashing password:', err)
            return res.status(500).json({ message: 'Error hashing password' })
        }
        console.log('Hashed Password:', hashPassword)
        return res.json(hashPassword)
    })
})

// compare a password
app.post('/compPass', (req, res) => {
    const { password, hash } = req.body

    bcrypt.compare(password, hash)
        .then((result) => {
            if (!result) {
                console.log('Wrong Password')
                return res.send(result)
            }
            console.log('Password Correct')
            return res.send(result)
        })
        .catch((error) => {
            console.log('Error comparing Passwords', error)
            return res.json({ message: 'Error comapring passwords' })
        })
})

// compare password V2
app.post('/confirmPassword', (req, res) => {
    const { email, password } = req.body
    const query = 'SELECT password FROM users WHERE email = ?'

    conn.query(query, [email], (err, result) => {

        if (err) {
            console.log('Error executing query', err)
            return res.status(500).json({ message: 'Error executing query' })
        }

        console.log(result[0].password)
        const getPassword = result[0].password

        bcrypt.compare(password, getPassword, (error, success) => {
            if (error) {
                console.log('error comapring pasword', error)
                return res.status(500).json({ message: 'Error comparing pass' })
            } else if (success) {
                console.log('Success', success)
                return res.status(201).json({ message: 'Success' })
            }
        })

    })
})

// create user
app.post("/createUser", (req, res) => {
    const { username, firstname, lastname, email, password, department } = req.body
    const query = 'INSERT INTO users (username, firstname, lastname, email, password, department) VALUES (?, ?, ?, ?, ?, ?)'

    conn.query(query, [username, firstname, lastname, email, password, department], (error, result) => {
        if (error) {
            console.log('Error executing query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.affectedRows === 0) {
            console.log('User not created')
            return res.status(409).send({ message: 'User not created' })
        }
        console.log('User created successfully:', result);
        return res.status(201).send(result);
    })
})

// add card
app.post("/card", (req, res) => {
    const { id, name, email, department, location, observationType, observation, description, actionTaken, suggestion, date, time } = req.body
    const query = 'INSERT INTO card (id, name, email, department, location, observationType, observation, description, actionTaken, suggestion, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    conn.query(query, [id, name, email, department, location, observationType, observation, description, actionTaken, suggestion, date, time], (error, result) => {
        if (error) {
            console.log('Error executing query', error)
            return res.status(500).json({ message: `Error executing query: ${error}` })
        }
        if (result.affectedRows === 0) {
            console.log('Card not created')
            return res.status(409).send({ message: 'Card not created' })
        }
        console.log('Card created successfully:', result)
        return res.status(201).send(result)
    })
})

// report a bug
app.post("/reportBug", (req, res) => {
    const { email, title, message } = req.body
    const messageBody = `
    <div>
        <p style="width: 90%; text-align: left; margin-bottom: 0px;">
        Hello Devs, <br></br>
        You have a new message from the Care Card App.<br></br>
        Sent by <a href='mailto:${email}' style="text-decoration: none; color: green">${email}</a>
        </p>
        <br></br>
        <h3>
        ${title}
        </h3>
        <p style="width: 320px;">
        ${message}
        </p>
        <span style="font-size: 12px; opacity: .4">
        Sent from Care Card App
        </span>
    </div>
    `
    const mailOptions = {
        from: 'CareCard App <ace19dev@gmail.com>',
        to: 'ace19dev@gmail.com',
        subject: 'Reported Bug',
        html: messageBody
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending mail', err)
            return res.status(500).json({ message: 'Error sending Mail' })
        }
        console.log('Email Sent', info.response)
        return res.json({ message: 'Email Sent' + ":" + info })
    })
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('Something Broke!')
})

// listen
app.listen(3000, () => {
    console.log('Listening on 3000')
})
