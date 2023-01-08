import ApiError from "./ApiError";
import { Response } from "express";

export default function (error: ApiError, res: Response) {
    return {
        res: res.status(error.statusCode).send({ error: error.message }),
    };
}