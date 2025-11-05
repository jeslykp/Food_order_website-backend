const jwt = require(`jsonwebtoken`)

const generateToken = (id,role)=>{
    console.log(role,"====roleeeeeeeeee")
    try {
        const token = jwt.sign({id:id,role:role},process.env.JWT_SECRET_KEY,{expiresIn:`1h`})
        return token
    } catch (error) {
        console.log(error)
        throw new Error(`token creation failed`,error)
        
    }
}

module.exports = generateToken