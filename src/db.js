const Sequelize = require('sequelize')

const db = new Sequelize("postgres://localhost:5432/sequelize-demo")
//const db = new Sequelize("postgres://localhost:5432/sequelize-demo", {logging: false}) <-- this will remove logging of sql queries
const User = db.define("user", {
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
    email: Sequelize.STRING
})

const Pet = db.define("pet", {
    name: Sequelize.STRING,
    age: Sequelize.INTEGER
})

//one to many relationship
User.hasMany(Pet)
Pet.belongsTo(User) //creates the foreign key column

//console.log('Database object: ', db)

//hooks - Check out this https://gist.github.com/Julissa93/6a6d29874d34a801d603d2522645025f to see what other Hooks you can use.
User.beforeValidate(() => console.log('in before validate hook!!!'))
User.afterValidate(() => console.log('in after validate!!!'))
User.beforeCreate(() => console.log('in before create hook!!!'))
User.afterCreate(() => console.log('in after create hook!!!') )

const connect = async () => {
    await db.sync({force: true}) //will sync models to the database instance that we created with sequelize
    const kevin = await User.create({
        name: 'Kevin',
        age: 26,
        email: 'kevin@kevin.com'
    })
    //await User.bulkCreate([]) <-- to create multiple instances - bulkCreate takes an array of objects as an argument.
    //console.log('magic methods: ', kevin.__proto__) <-- this logs all the methods available on an *instance*. FYI: if you call this on the model you won't see the magic methods.
    const doppio = await Pet.create({
        name: 'Doppio',
        age: 2,
        userId: 1
    })
    await Pet.create({
        name: 'Bella',
        age: 10
    })
    //doppio.setUser(kevin) <-- Instead of passing userId:1 like we did above, we can also use the *magic method* 
    console.log('pet magic methods: ', doppio.__proto__)

    // Also we didn't have time to do this in the demo but we did go over it in the slide deck. 
    // If you want to query a table you can use methods like findAll to retrieve all rows, findOne to retrieve one row, etc. 
    // Check out the Sequelize docs to see what other methods you can use: https://sequelize.org/master/manual/model-querying-basics.html
    User.findAll() // will retrieve all the rows from the users table in an array of objects. 
    Pet.findOne({ // will retrieve one row from pets table where name = Doppio
        where: {name: 'Doppio'}
    })

}
connect()