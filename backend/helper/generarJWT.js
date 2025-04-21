import jwt from "jsonwebtoken";

const generarJWT = (id, usuario, tipo) => {
    return jwt.sign({ id, usuario, tipo }, process.env.JWT_SECRET, {
        expiresIn: "8h",
    });
};

export default generarJWT;