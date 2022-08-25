const User = require('../databasemodels/userModel');
const bcrypt = require('bcrypt');
const generateToken = require("../config/generateToken");

const registerUser = async function(req,res){
   try {
    const {name:name1,email:email1,password:password1,pic:pic1} = req.body;

    if(!name1 || !email1 || !password1){
        res.status(404);
        throw new Error("Please fill the required fiels");
    }
    const userExists = await User.findOne({email:email1});

    if(userExists){
        throw new Error("User already exists");
    }
    
    var hashpassword;
    const saltRounds = 10;
    const myPlaintextPassword = password1;
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    console.log(hash);
    const user = await User.create({
        name:name1,
        email:email1,
        password:hash,
        pic:pic1,
    })

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            isAdmin:user.isAdmin,
            pic:user.pic,
            token: generateToken(user._id),
        });
    }else{
         res.status(400);
    throw new Error("User not found");
    }

   } catch (error) {
    console.log(error);
    process.exit();
   }
};

const authUser = async function(req,res){
   try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if (user && (await bcrypt.compareSync(password,user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
    } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
     }
   } catch (error) {
    console.log(error);
    process.exit();
   }
};

const allUsers= async function(req,res){
   try {
    const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
   } catch (error) {
    console.log(error);
    process.exit();
   }
}


module.exports = {registerUser,authUser,allUsers};