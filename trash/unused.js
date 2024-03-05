const bodyParser = require('body-parser');
const calculateSimilarity = require('./calculateSimilarity');
const MsgCount = require('./models/msgCount');
// const botsrc = process.env.BOTSRC;

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(bodyParser.json()); //bot.ejsからのデータを受け取るときに使う

// app.use(express.static(path.join(__dirname, '../botpress/build')));
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "../botpress/build", "index.html"));
// });

app.get('/mouses', async (req, res) => {
    const { category: category } = req.query;
    if (category) {
        const mouses = await Mouse.find({ category: category });
        res.render('mouses/index', { mouses, category });
    } else {
        const mouses = await Mouse.find({});
        res.render('mouses/index', { mouses, category: '全' });
    }
});

/* autocomplete search */
app.get('/searchFill', function (req, res, next) {
    res.render('searchFill', { title: 'AutoComplete Search in Node.js with MySQL' });
});

// オートコンプリート機能のエンドポイント
app.get('/completeFill', (req, res) => {
    const input = req.query.input;
    Mouse.find({ creator: { $regex: new RegExp(input, 'i') } })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.get('/dropdown', async function (req, res, next) {
    try {
        const mouses = await Mouse.find({})
            .sort({ creator: 1 }); // creatorフィールドでソート

        // 重複を防ぐためのセット
        const uniqueCreators = new Set();
        const uniqueData = [];
        mouses.forEach(item => {
            // 重複していない場合のみ追加
            if (!uniqueCreators.has(item.creator)) {
                uniqueCreators.add(item.creator);
                uniqueData.push(item);
            }
        });

        // クライアントにデータを送信
        res.render('dropdown', { mouses: uniqueData });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/data', async (req, res) => {
    const data = await Mouse.find(); // データをMongooseから取得
    res.json(data); // 取得したデータをJSON形式で返す
});

app.get('/toomany', (req, res) => {
    res.render('toomany');
});

app.get('/mouses/:creator/:name', async (req, res) => {
    const { creator: creator, name: name } = req.params;
    // const decodeCreator = decodeURIComponent(creator);
    // const decodeName = decodeURIComponent(name);
    // console.log(idee);
    const mouse = await Mouse.findOne({ creator: creator, name: name });
    const items = await videoSearch(mouse.creator, mouse.name, 1);
    res.render('mouses/show', { mouse, items });
});

app.put('/mouses/:creator/:name', async (req, res) => {
    const { creator: creator, name: name } = req.params;
    const mouse = await Mouse.findOneAndUpdate({ creator: creator, name: name }, req.body, { runValidators: true, new: true });
    res.redirect(`/mouses/${mouse.creator}/${mouse.name}`);
});

app.delete('/mouses/:creator/:name', async (req, res) => {
    const { creator: creator, name: name } = req.params;
    const deletedmouse = await Mouse.findOneAndDelete({ creator: creator, name: name });
    res.redirect('/mouses');
})

// app.get('/bot.js', (req, res) => {
//     res.type('text/javascript');
//     // bot.jsファイルの内容を送信する
// });

// app.get('/bot', async (req, res) => {
//     let user = await MsgCount.findOne({ ip: req.ip });
//     if (user) {
//         console.log('ユーザーの期限', user.expirationDate, '現在時刻', new Date());
//         if (user.expirationDate < new Date()) { //<に直す
//             await MsgCount.findOneAndDelete({ ip: user.ip }, (err, deletedUser) => {
//                 if (err) {
//                     console.error('Error deleting user:', err);
//                 } else {
//                     console.log('Deleted user:', deletedUser);
//                 }
//             });
//             user = null;
//         } else if (user.count > 1) res.render('tooMany');
//     }
//     if(!user){
//         user = new MsgCount({
//             ip: req.ip,
//             count: 0,
//             expirationDate: new Date(Date.now() + 1 * 10 * 1000)
//         })
//         await user.save();
//     }
//     console.log('botを使うユーザー', user);

//     res.render('bot', { botsrc });
// });

// app.post('/bot', async (req, res) => {
//     try {
//         const query = { ip: req.ip };
//         const update = { $inc: { count: 1 } };
//         const updatedUser = await MsgCount.findOneAndUpdate(query, update, { runValidators: true, new: true });

//         console.log(updatedUser.count);
//         if (updatedUser.count > 1) {
//             res.send(200);
//         }
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// オートコンプリート機能のエンドポイント
app.get('/completeHref', (req, res) => {
    const input = req.query.input;

    // スペースで分割して検索条件を作成
    const searchConditions = input.split(' ').map(keyword => {
        return {
            $or: [
                { creator: { $regex: new RegExp(keyword, 'i') } },
                { name: { $regex: new RegExp(keyword, 'i') } }
            ]
        };
    });

    // 全ての検索条件を結合して検索
    Mouse.find({ $and: searchConditions })
        .then(data => {
            // アイテムごとに文字列の類似性を計算し、一致する文字数が多い順にソートする
            const sortedItems = data.map(item => {
                const nameSimilarity = calculateSimilarity(item.name, input);
                const creatorSimilarity = calculateSimilarity(item.creator, input);
                const totalSimilarity = nameSimilarity + creatorSimilarity;
                return { item, totalSimilarity };
            }).sort((a, b) => b.totalSimilarity - a.totalSimilarity);

            // ソートされたアイテムをレスポンスに返す
            res.json(sortedItems.map(entry => entry.item));
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

/* autocomplete search */
app.get('/searchHref', function (req, res, next) {
    res.render('searchHref', { title: 'AutoComplete Search in Node.js with MySQL' });
});