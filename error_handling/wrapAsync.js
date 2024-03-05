//これをやることでエラー画面に遷移できる
module.exports = asyncFunc => {
    return (req, res, next) => {
        asyncFunc(req, res, next).catch(error => next(error));
    }
}