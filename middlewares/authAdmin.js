const jwt = require('jsonwebtoken')

// Middleware to check if a Admin is logged in
const authAdmin = (req,res,next)=>
{
    try 
    {
     //validate the cookies before
     // Check if cookies exist
    if (!req.cookies) {
      return res.status(401).json({ error: "No cookies found, not authorized" });
    }

     // Get token from cookies

     const {token} = req.cookies
      
       // If no token, deny access
     if(!token)
     {
        return res.status(401).json({error:"Admin is not authorized"})
     }
        
     // if Admin has token verifying it to find any kind of tampering or issue

     const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
      
     // If token invalid, block access
     if(!decodedToken)
     {
        return res.status(401).json({error:"Admin is not authorized"}) 
     }
   
     
    // Check if token contains role as admin

if (decodedToken.role !== 'admin') {
  return res.status(403).json({ error: "Access denied. Not an Admin" });
}

     // Attach Admin info to request object
     req.admin = decodedToken


   next()
    } 
    
    catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Invalid or expired token" })  
    }
}
module.exports = authAdmin;