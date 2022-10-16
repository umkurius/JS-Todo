const User = require('./model/user'),
      bcrypt = require('bcryptjs'),
      jwt =  require('jsonwebtoken'),
      {validationResult} = require('express-validator'),
      {secret} = require('./config'),
      fs = require('file-system'),
      usersFilePath = 'users.json';


const generateAccessToken = (id) => {
    const payload = {
        id
    };

    return jwt.sign(payload, secret, {expiresIn: '24h'});
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Registration error', errors})
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if(candidate) {
                return res.status(400).json({message: 'This username already exist'})
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({username, password: hashPassword});

            await user.save();

            const usersData = getUsersFromDB();
            usersData.push(user);
            setUsersToDB(usersData)

            return res.json(user);
        } catch (e) {
            res.status(400).json({message: 'Registration error'});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;

            const user = await User.findOne({username});

            if (!user) {
                return res.status.json({message: `${username} not found.`});
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status.json({message: 'Wrong password'});
            }
            const id = user._id;
            const token = generateAccessToken(user._id);

            return res.json({token, username, id});
        } catch (e) {
            res.status(400).json({message: 'Login error'});
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();

            res.json(users);
        } catch (e) {
            res.status(400).json({message: 'Error'});
        }
    }
}

function setUsersToDB(usersData) {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData));
}
function getUsersFromDB() {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

module.exports = new authController();