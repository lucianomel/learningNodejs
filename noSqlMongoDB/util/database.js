const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient

let _db

const mongoConnect=cb=>{
    MongoClient.connect(
        'mongodb+srv://luciano:nTjBZ7K5Ac9ZPNAR@cluster0.zwd4t.mongodb.net/shop?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}
    )
        .then(client=>{
            console.log('Connected')
            _db=client.db() //can pass argument of db to connect
            cb()
        })
        .catch(err=>{
            console.log(err)
            throw err;
        })
}

const getDb=()=>{
    if(_db){
        return _db
    }
    throw 'No database found'
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb