import { deleteAllUsers } from "../db/queries/users.js";
export async function handlerReset(req, res) {
    await deleteAllUsers();
    res.status(200).send();
}
