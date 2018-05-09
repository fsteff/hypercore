var create = require('./helpers/create')
var tape = require('tape')

tape('hooks-trivial', function (t) {
    var feed = create({
        onread: function (index, offset, data, cb) {
            t.ok((index == 0 && data === 'HELLO') || (index == 1 && data === 'WORLD'))

            cb(null, data.toLowerCase())
        },

        onwrite: function (index, offset, data, from, cb) {
            t.ok((index == 0 && data === 'hello') || (index == 1 && data === 'world'))

            cb(null, data.toUpperCase())
        },
        valueEncoding: 'utf8'
    })

    feed.append(['hello', 'world'])

    feed.get(0, function (err, data) {
        if (err) t.err(error)
        t.equal(data, 'hello')
    })

    feed.get(1, function (err, data) {
        if (err) t.err(error)
        t.equal(data, 'world')
        t.end()
    })
});

tape('hooks-buffer', function (t) {
    function bin(str) {
        return Buffer.from(str, 'utf8')
    }
    var feed = create({
        onread: function (index, offset, data, cb) {
            for(var i = 0; i < data.length; i++){
                data[i] -= 1
            }

            t.ok((index == 0 && data.toString('utf8') === 'hello') || (index == 1 && data.toString('utf8') === 'world'))
            cb(null, data)
        },
        onwrite: function (index, offset, data, from, cb) {
            t.ok((index == 0 && data.toString('utf8') === 'hello') || (index == 1 && data.toString('utf8') === 'world'))
            for(var i = 0; i < data.length; i++){
                data[i] += 1
            }
            cb(null, data)
        },
        valueEncoding: 'binary'
    })

    feed.append([bin('hello'), bin('world')])

    feed.get(0, function (err, data) {
        if (err) t.err(error)
        t.equal(data.toString('utf8'), 'hello')
    })

    feed.get(1, function (err, data) {
        if (err) t.err(error)
        t.equal(data.toString('utf8'), 'world')
        t.end()
    })
})

tape('hooks-encoding', function (t) {
    function bin(str) {
        return Buffer.from(str, 'utf8')
    }
    var feed = create({
        onread: function (index, offset, data, cb) {
            t.ok((index == 0 && data.toString('utf8') === 'hello') || (index == 1 && data.toString('utf8') === 'world'))
            data = data.toString('utf8')
            cb(null, data)
        },
        onwrite: function (index, offset, data, from, cb) {
            data = Buffer.from(data, 'utf8')
            t.ok((index == 0 && data.toString('utf8') === 'hello') || (index == 1 && data.toString('utf8') === 'world'))
            cb(null, data)
        },
        valueEncoding: 'utf8'
    })

    feed.append(['hello', 'world'])

    feed.get(0, function (err, data) {
        if (err) t.err(error)
        t.equal(data, 'hello')
    })

    feed.get(1, function (err, data) {
        if (err) t.err(error)
        t.equal(data, 'world')
        t.end()
    })
})
