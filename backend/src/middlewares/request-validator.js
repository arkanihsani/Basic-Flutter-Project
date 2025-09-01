const validate = (schema, source = "body") => (req, res, next) => {
  let dataToValidate;
  
  switch (source) {
    case "params":
      dataToValidate = req.params;
      break;
    case "query":
      dataToValidate = req.query;
      break;
    case "body":
    default:
      dataToValidate = req.body;
      break;
  }
  
  const { error } = schema.validate(dataToValidate, { abortEarly: false });
  if (error) {
    const messages = error.details
      .map((d) => {
        let message = d.message;
        message = message.replace(/"([^"]+)"/g, '$1');
        return message;
      })
      .join(", ");
    return res.status(400).json({ success: false, message: messages });
  }
  next();
};

export default validate;