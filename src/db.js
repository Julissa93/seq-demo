//const { userInfo } = require('node:os')
const Sequelize = require('sequelize')

const db = new Sequelize("postgres://localhost:5432/sequelize-demo", {logging: false})

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

User.beforeValidate(() => console.log('in before validate hook!!!'))
User.afterValidate(() => console.log('in after validate!!!'))
User.beforeCreate(() => console.log('in before create hook!!!'))
User.afterCreate(() => console.log('in after create hook!!!') )

const connect = async () => {
    await db.sync({force: true}) //will sync models to the database instance that we created with sequelize
    const kevin = await User.create({
        name: "Kevin",
        age: 26,
        email: "kevin@kevin.com"
    })
    /*await User.bulkCreate([])*/
    //console.log('magic methods: ', kevin.__proto__)
    const doppio = await Pet.create({
        name: "Doppio",
        age: 2,
        //userId: 1
    })
    doppio.setUser(kevin)
    console.log('pet magic methods: ', doppio.__proto__)
}
connect()