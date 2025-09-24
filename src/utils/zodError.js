

export const ZodErrorParser = (errors) =>{
    return errors.map((error)=>{
        return {message: error.message, path: error.path[0]}
    })

}