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
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQLPORT
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
    const code = Math.floor(Math.random() * 9000) + 1000;

    const messageBody = `
    <div style="text-align: left;">
        <h1>Verification Code</h1>
        <p style="margin-bottom: 0px; font-size: 14px;">
        Hello, </br>
        Use the code below to proceed with resetting your password
        </p>
        <h1 style="color: green; font-size: 32px; letter-spacing: 2px;">
        ${code}
        </h1>
        <p style="font-size: 14px;">If you did not make this request, kindly ignore this email.</P>
        <span style="font-size: 12px; opacity: .4">
        Care Card App
        </span>
    </div>
    `
    const mailOptions = {
        from: 'CareCard App <ace19dev@gmail.com>',
        to: email,
        subject: 'Reset Verification Code',
        html: messageBody
    }


    conn.query(query, [code, email], (err, info) => {
        if (err) {
            console.log('Error adding code to database', err)
            return res.status(500).json({ message: 'Error executing query' })
        } else if (info.affectedRows === 0) {
            console.log("Invalid Email")
            return res.status(404).json({ message: 'Email does not exist' })
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Error sending mail', err)
                return res.status(500).json({ message: 'Error sending Mail' })
            }
            console.log('Email Sent', info.response)
            return res.status(201).json({ message: 'Mail Sent' })
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
            return res.status(424).json({ message: 'Incorrect Code' })
        }
        return res.status(202).json({ message: 'Success' })
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
            return res.json({ message: 'User Does Not Exist' })
        }
        return res.send(result[0])
    })
})

// get all pending cards for user
app.get('/pendingcard/:email', (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM card WHERE email = ? AND status = 'Pending'"

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executing query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            return res.json({ message: 'No Cards Here' })
        }
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
            return res.json({ message: 'No Cards Here' })
        }
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
            return res.json({ message: 'No Cards Here' })
        }
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
            return res.json({ message: 'No Cards Here' })
        }
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
            return res.json({ message: 'No Cards Here' })
        }
        return res.send(result)
    })
})

// get uncompleted card number 
app.get('/uncompletedcardnum/:email', (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM card WHERE email = ? AND status = 'Uncompleted'"

    conn.query(query, [email], (error, result) => {
        if (error) {
            console.log('Error executinig query', error)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (result.length === 0) {
            return res.json({ message: 'No Cards Here' })
        }
        return res.send(result)
    })
})

// login
app.post('/login', (req, res) => {
    const { email, password } = req.body
    const query = 'SELECT * FROM users WHERE email = ?'

    conn.query(query, [email], (err, info) => {
        if (err) {
            console.log('error executing query', err)
            return res.status(500).json({ message: 'Error executing query' })
        } if (info.length === 0) {
            console.log('user does not exist')
            return res.json({ message: 'User Does Not Exist' })
        }
        const dbPassword = info[0].password
        bcrypt.compare(password, dbPassword, (bErr, bPass) => {
            if (bErr) {
                console.log('error decryoting password')
                return res.json({ message: 'Error decrypting password' })
            } if (!bPass) {
                return res.json({ message: 'Incorrect Password' })
            }
            return res.json({ message: info[0] })
        })
    })
})

// update username
app.post('/changeUsername', (req, res) => {
    const { email, username } = req.body
    const query = 'UPDATE users SET username = ? WHERE email = ?'

    conn.query(query, [username, email], (err, success) => {
        if (err) {
            console.log('Error exectuing query', err)
            return res.status(500).json({ message: 'Error Executing Query' })
        }
        return res.status(201).json({ messasge: 'Success', success })
    })
})

// reset password
app.post('/resetPassword', (req, res) => {
    const { email, password } = req.body
    const query = 'UPDATE users SET password = ? WHERE email = ?'
    const salt = 13

    bcrypt.hash(password, salt, (fail, pass) => {
        if (fail) {
            console.log('Error hashing password:', fail)
            return res.status(500).json({ message: 'Error hashing password' })
        }
        conn.query(query, [pass, email], (errMsg, success) => {
            if (errMsg) {
                console.log('Error exectuing query', errMsg)
                return res.status(500).json({ message: 'Error Executing Query' })
            }
            return res.status(201).json({ messasge: 'Success', success })
        })
    })

})

// update password
app.post('/changePassword', (req, res) => {
    const { email, oldPassword, password } = req.body
    const fetchQuery = 'SELECT password from users WHERE email = ?'
    const query = 'UPDATE users SET password = ? WHERE email = ?'
    const salt = 13

    conn.query(fetchQuery, email, (err, info) => {
        if (err) {
            console.log('Error exectuing query', err)
            return res.status(500).json({ message: 'Error Executing Query' })
        }
        const dbPassword = info[0].password
        bcrypt.compare(oldPassword, dbPassword, (error, result) => {
            if (error) {
                console.log('error decrypting password', error)
                return res.status(500).json({ message: 'Error Decrypting Password' })
            }
            if (!result) {
                return res.status(500).json({ message: 'Wrong Password' })
            }
            bcrypt.hash(password, salt, (fail, pass) => {
                if (fail) {
                    console.log('Error hashing password:', fail)
                    return res.status(500).json({ message: 'Error hashing password' })
                }
                conn.query(query, [pass, email], (errMsg, success) => {
                    if (errMsg) {
                        console.log('Error exectuing query', errMsg)
                        return res.status(500).json({ message: 'Error Executing Query' })
                    }
                    return res.status(201).json({ messasge: 'Success', success })
                })
            })
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

    const { username, firstname, lastname, email, password, department, designation } = req.body
    const checkQuery = 'SELECT * FROM users WHERE email = ?'
    const query = 'INSERT INTO users (username, firstname, lastname, email, password, department, designation) VALUES (?, ?, ?, ?, ?, ?, ?)'

    conn.query(checkQuery, email, (qErr, qInfo) => {
        if (qErr) {
            console.log('error executing query', qErr)
            return res.status(500).json({ message: 'Error executing query' })
        }
        if (qInfo.length > 0) {
            console.log('User exists')
            return res.status(409).json({ message: 'User exists' })
        }

        bcrypt.hash(password, 13, (bErr, encrypted) => {
            if (bErr) {
                console.log('error hashing password', bErr)
                return res.status(500).json({ message: 'Error hashing password' })
            }
            console.log('Success')
            conn.query(query, [username, firstname, lastname, email, encrypted, department, designation], (error, result) => {
                if (error) {
                    console.log('Error executing query', error)
                    return res.status(500).json({ message: 'Error executing query' })
                }
                if (result.affectedRows === 0) {
                    console.log('User not created')
                    return res.status(409).json({ message: 'User not created' })
                }
                return res.status(201).json({ message: result })
            })
        })
    })
})

// add card
app.post("/card", (req, res) => {
    const { id, title, name, email, department, designation, country, location, observationType, observation, description, actionTaken, suggestion, date, time } = req.body
    const query = "INSERT INTO card (id, title, name, email, department, designation, country, location, observationType, observation, description, actionTaken, suggestion, status, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)"
    const queryWithoutTitle = "INSERT INTO card (id, name, email, department, designation, country, location, observationType, observation, description, actionTaken, suggestion, status, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)"
    if (title === '') {
        conn.query(queryWithoutTitle, [id, name, email, department, designation, country, location, observationType, observation, description, actionTaken, suggestion, date, time], (error, result) => {
            if (error) {
                console.log('Error executing query', error)
                return res.status(500).json({ message: `Error executing query` })
            }
            if (result.affectedRows === 0) {
                console.log('Card not created')
                return res.status(409).send({ message: 'Card not created' })
            }
            return res.status(201).send(result)
        })
    } else {
        conn.query(query, [id, title, name, email, department, designation, country, location, observationType, observation, description, actionTaken, suggestion, date, time], (error, result) => {
            if (error) {
                console.log('Error executing query', error)
                return res.status(500).json({ message: `Error executing query` })
            }
            if (result.affectedRows === 0) {
                console.log('Card not created')
                return res.status(409).send({ message: 'Card not created' })
            }
            return res.status(201).send(result)
        })
    }
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
const port = process.env.PORT
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
