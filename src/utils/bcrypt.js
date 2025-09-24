
import bcrypt from 'bcrypt'
export const hashPassword = async (password) =>{

  return await bcrypt.hash(password, 10)


}

export const comparePassword = async (plainTextPassword, hashPassword) =>{

    return await bcrypt.compare(plainTextPassword,hashPassword)

}