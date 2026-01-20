import type { Mongoose } from "mongoose";
declare global{
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    }
}
import '@testing-library/jest-dom'
export {}