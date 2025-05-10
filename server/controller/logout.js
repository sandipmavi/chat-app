async function logout(req, res){
    try{
        const cookieOptions ={
            http: true,
            secure: true,
        }
        // res.cookie('token','',cookieOptions);
        return res.cookie('token', token, cookieOptions).status(200).json({
            message:"session expired",
            success: true,
        })
    }catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
        })

    }
}
module.exports = logout;