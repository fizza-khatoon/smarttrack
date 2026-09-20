const jwt=require('jsonwebtoken');
const protect=(req ,res, next) => {
  const authHeader=req.headers.authorization;

  if(!authHeader || !authHeader.startsWith('Bearer')){c
    return res.status(401).json({message: "No token ,access denied"});
  }

  try{
    const token=authHeader.split(' ')[1];
    const decoded= jwt.verify(token, process.env.JWT_SECRET);
     
    req.user=decoded;
    next();

  }catch(error){
    res.status(401).json({message: "Invalid or expired token"});
  }
};

module.exports=protect;