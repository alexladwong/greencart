import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) =>{
    const { sellerToken: cookieToken } = req.cookies;
    const headerToken = req.headers['x-seller-token'];
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const sellerToken = cookieToken || headerToken || bearerToken;

    if(!sellerToken) {
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
            if(tokenDecode.email === process.env.SELLER_EMAIL){
                next();
            }else{
                return res.json({ success: false, message: 'Not Authorized' });
            }
            
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
}

export default authSeller;
