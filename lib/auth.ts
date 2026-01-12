import jwt from 'jsonwebtoken'

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}


export async function verifyAuth(request: Request, requiredRole?: string){
    try{
        const authHeader = request.headers.get('authorization');

        if(!authHeader?.startsWith('Bearer ')){
            return {
                error: 'No token provided',
                status: 401
            }
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
        
        // check role
        if(requiredRole && decoded.role !== requiredRole){
            return { error: "Insufficient permissions", status: 403 }
        }
        
        return {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email
        }
    }catch(error){
        console.log(error);
        return {
            error: "Invalid token",
            status: 401
        }
    }
}