const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const ytKey = process.env.YT_KEY;
const axios = require('axios');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./error_handling/wrapAsync')
const AppError = require('./error_handling/AppError')
const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const uuid = require('uuid');


const Mouse = require('./models/mouse');

//'mongodb://localhost:27017/mouseSite' process.env.DB_URL
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { })
    .then(() => {
        console.log('MongoDBコネクションOK');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー');
        console.log(err);
    })

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith: '_',
}));
app.use(helmet({
    contentSecurityPolicy: false,
}));

const secret = process.env.SECRET;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret
    },
    touchAfter: 24 * 3600 * 7// time period in seconds
});

store.on('error', e => {
    console.log('セッションストアエラー', e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

app.post('/dark-mode-toggle', (req, res) => {
    req.session.darkMode = !req.session.darkMode;
    console.log(req.session.darkMode);
    res.sendStatus(200);
});

app.get('/', wrapAsync(async function (req, res) {
    const mouses = await Mouse.find();
    const darkMode = req.session.darkMode || false;
    res.render('database', { mouses, darkMode });
}));

app.get('/HandFit', async function (req, res) {
    const mouses = await Mouse.find();
    const darkMode = req.session.darkMode || false;
    res.render('calc', {darkMode, mouses});
});

app.get('/Contact', async function (req, res) {
    const darkMode = req.session.darkMode || false;
    res.render('contact', {darkMode});
});

app.get('/desiMouse', wrapAsync(async (req, res) => {
    const desiX = Number(req.query.desiX);
    const desiY = Number(req.query.desiY);
    const desiZ = Number(req.query.desiZ);

    const totalItemCount = await Mouse.countDocuments();
    let mouses = await Mouse.aggregate([{ $sample: { size: totalItemCount } }]);
    if (mouses.length > 0) {
        mouses.forEach(obj => {
            obj.difX = Math.round((obj.width - desiX) * 100) / 100;
            obj.difY = Math.round((obj.length - desiY) * 100) / 100;
            obj.totalDif = Math.round((Math.abs(obj.difX) + Math.abs(obj.difY)) * 100) / 100;
        });
        if (!isNaN(desiZ)){
            mouses.forEach(obj => {
                obj.difZ = Math.round((obj.height - desiZ) * 100) / 100;
                obj.totalDif = Math.round((obj.totalDif + Math.abs(obj.difZ)) * 100) / 100;
            });
        }
        mouses.sort((a, b) => a.totalDif - b.totalDif);
    } else {
        console.log('mouses not found');
    }

    let items = null;
    await videoSearch(mouses[0].creator, mouses[0].name, 1)
        .then(result => {
            items = result;
        })
    const darkMode = req.session.darkMode || false;
    res.render('results', { mouses, items, desiX, desiY, desiZ, darkMode});
}));

async function videoSearch(search1, search2, maxResults) {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${ytKey}&maxResults=${maxResults}&type=video&q=${search1}+${search2}`);
        return response.data.items;
    } catch (error) {
        return null;
    }
}

// -----------------------------------------------------------editor

// app.get('/editor', wrapAsync(async function (req, res) {
//     const mouses = await Mouse.find();
//     const darkMode = req.session.darkMode || false;
//     res.render('editor', { mouses, darkMode });
// }));

// app.get('/mouses/new', (req, res) => {
//     res.render('mouses/new');
// });

// app.post('/mouses', async (req, res) => {
//     // console.log(req.body);
//     const newmouse = new Mouse(req.body);
//     await newmouse.save();
//     console.log(newmouse);
//     res.redirect(`/editor`);
// });

// app.get('/mouses/:id/edit', wrapAsync(async (req, res) => {
//     const { id: id } = req.params;
//     const mouse = await Mouse.findById(id)
//     res.render('mouses/edit', { mouse });
// }));

// app.get('/mouses/:id/dup', wrapAsync(async (req, res) => {
//     const { id: id } = req.params;
//     await Mouse.findById(id)
//         .then(originalDoc => {
//             if (!originalDoc) {
//                 console.error('Original document not found');
//                 return;
//             }
//             // Which fields to avoid copying. Writing fields deletes the fields of original document
//             const { _id, ...newDocData } = originalDoc.toObject();

//             // newDocData._id = uuid.v4();
//             newDocData.name = 'dup'
//             const newDocument = new Mouse(newDocData);
//             newDocument.save()
//                 .then(savedDoc => {
//                     console.log('New document saved successfully:', savedDoc);
//                 })
//                 .catch(err => {
//                     console.error('Error saving new document:', err);
//                 });
//         })
//         .catch(err => {
//             console.error('Error finding original document:', err);
//         });
//     res.redirect(`/editor`);
// }));

// app.put('/mouses/:id', async (req, res) => {
//     const { id: id } = req.params;
//     const mouse = await Mouse.findByIdAndUpdate(id , req.body, { runValidators: true, new: true });
//     console.log(mouse);
//     res.redirect(`/editor`);
// });

// app.delete('/mouses/:id', async (req, res) => {
//     const { id: id } = req.params;
//     const deletedmouse = await Mouse.findByIdAndDelete(id);
//     console.log(deletedmouse);
//     res.redirect('/editor');
// })
//---------------------------------------------------------------------------------
app.all('*', (req, res, next) => {
    next(new AppError('Page not found. What!? Where are you trying to go!?', 404));
});

app.use((err, req, res, next) => {
    const { condition = 500 } = err;
    console.log('err.messageは', err.message);
    res.status(condition).render('error', { err });
});

app.listen(80, () => {
    console.log('waiting at port 80');
});