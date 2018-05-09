var create = require('./helpers/create')
var tape = require('tape')

tape('hooks-trivial', function (t){
    var feed = create({
        onread: function(index, offset, data, cb){
            //console.log('onread: ' + data + ", index: " + index)

            t.ok((index == 0 && data === 'HELLO') || (index == 1 && data === 'WORLD'))

            cb(null, data.toLowerCase())
        },

        onwrite: function(index, offset, data, from, cb){
            //console.log('onwrite: ' + data+ ", offset: " + offset)

            t.ok((index == 0 && data === 'hello') || (index == 1 && data === 'world'))

            cb(null, data.toUpperCase())
        },
        valueEncoding: 'utf-8'
    })

    feed.append(['hello', 'world'])

    feed.get(0, function(err, data){
      if(err) t.err(error)
      t.equal(data, 'hello')  
    })

    feed.get(1, function(err, data){
        if(err) t.err(error)
        t.equal(data, 'world')   
        t.end()
    })

});