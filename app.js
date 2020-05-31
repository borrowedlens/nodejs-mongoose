const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/ErrorController');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views/ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findById('5e8b74abb10e3b16646babac')
        .then((user) => {
            if (user) {
                req.user = user;
                next();
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRouter);
app.use('/', errorController.get404Error);

mongoose
    .connect(
        'mongodb+srv://VivekPrasad:wengerknows@cluster0-ulb7d.mongodb.net/shop?retryWrites=true&w=majority',
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
    )
    .then(() => {
        User.findOne()
        .then((user) => {
            if(!user) {
                const user = new User({
                    name: 'Vivek',
                    email: 'test@test.com',
                    cart: {
                        items: []
                    }
                })
                user.save()
            }
        })
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });